﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Ciloci.Flee;
using AxeSoftware.Quest.Functions;

namespace AxeSoftware.Quest.Scripts
{
    public class ScriptContext
    {
        private ExpressionContext m_expressionContext;
        private WorldModel m_worldModel;
        private Dictionary<string, Type> m_types = new Dictionary<string, Type>();
        protected Context m_context;

        public ScriptContext(WorldModel worldModel)
        {
            m_worldModel = worldModel;
            m_expressionContext = new ExpressionContext(worldModel.ExpressionOwner);
            m_expressionContext.Imports.AddType(typeof(StringFunctions));

            m_expressionContext.Variables.ResolveVariableType += new EventHandler<ResolveVariableTypeEventArgs>(Variables_ResolveVariableType);
            m_expressionContext.Variables.ResolveVariableValue += new EventHandler<ResolveVariableValueEventArgs>(Variables_ResolveVariableValue);
            m_expressionContext.Variables.ResolveFunction += new EventHandler<ResolveFunctionEventArgs>(Variables_ResolveFunction);
            m_expressionContext.Variables.InvokeFunction += new EventHandler<InvokeFunctionEventArgs>(Variables_InvokeFunction);
            m_expressionContext.Options.ParseCulture = System.Globalization.CultureInfo.InvariantCulture;
        }

        void Variables_ResolveFunction(object sender, ResolveFunctionEventArgs e)
        {
            if (e.FunctionName == "IsDefined")
            {
                e.ReturnType = typeof(bool);
                return;
            }
            Element proc = m_worldModel.Procedure(e.FunctionName);
            if (proc != null)
            {
                e.ReturnType = WorldModel.ConvertTypeNameToType(proc.Fields[FieldDefinitions.ReturnType]);
            }
        }

        void Variables_InvokeFunction(object sender, InvokeFunctionEventArgs e)
        {
            if (e.FunctionName == "IsDefined")
            {
                e.Result = m_context.Parameters.ContainsKey((string)e.Arguments[0]);
                return;
            }
            Element proc = m_worldModel.Procedure(e.FunctionName);
            Parameters parameters = new Parameters();
            int cnt = 0;
            // TO DO: Check number of parameters matches
            foreach (object val in e.Arguments)
            {
                parameters.Add((string)proc.Fields[FieldDefinitions.ParamNames][cnt], val);
                cnt++;
            }

            e.Result = m_worldModel.RunProcedure(e.FunctionName, parameters, true);
        }

        void Variables_ResolveVariableValue(object sender, ResolveVariableValueEventArgs e)
        {
            e.VariableValue = ResolveVariable(e.VariableName);
        }

        void Variables_ResolveVariableType(object sender, ResolveVariableTypeEventArgs e)
        {
            Type type = GetVariableType(e.VariableName);
            m_types[e.VariableName] = type;
            e.VariableType = type;
        }

        private Type GetVariableType(string variable)
        {
            object value = ResolveVariable(variable);
            return (value == null) ? typeof(object) : value.GetType();
        }

        public bool HaveVariableTypesChanged()
        {
            // ** TO DO: Fix! **


            //foreach (string variable in m_types.Keys)
            //{
            //    if (GetVariableType(variable) != m_types[variable]) return true;
            //}
            //return false;
            return true;
        }

        private object ResolveVariable(string name)
        {
            if (m_context.Parameters != null && m_context.Parameters.ContainsKey(name))
            {
                return m_context.Parameters[name];
            }
            else
            {
                Element result;
                if (m_worldModel.TryResolveExpressionElement(Utility.ResolveElementName(name), out result))
                {
                    return result;
                }
                else
                {
                    Fields fields;
                    string variable;
                    ResolveVariableName(name, out fields, out variable);

                    do
                    {
                        if (Utility.ContainsUnresolvedDotNotation(variable))
                        {
                            // We may have been passed in something like someobj.parent.someproperty
                            string nestedObj;
                            Utility.ResolveVariableName(ref variable, out nestedObj, out variable);
                            fields = fields.GetObject(nestedObj).Fields;
                        }
                    } while (Utility.ContainsUnresolvedDotNotation(variable));

                    if (!fields.Exists(variable))
                    {
                        return null;
                    }
                    return fields.Get(variable);
                }
            }
        }

        private void ResolveVariableName(string name, out Fields fields, out string variable)
        {
            string obj;
            Utility.ResolveVariableName(ref name, out obj, out variable);

            Element result;
            if (m_worldModel.TryResolveExpressionElement(name, out result))
            {
                fields = result.Fields;
            }
            else
            {
                if (obj == null) throw new Exception(string.Format("Unknown object or variable '{0}'", name));

                object value = ResolveVariable(obj);
                Element instance = value as Element;
                if (instance == null)
                {
                    throw new Exception(string.Format("Variable does not refer to an object: '{0}'", obj));
                }
                fields = instance.Fields;
            }
        }

        public Context ExecutionContext
        {
            get { return m_context; }
            set { m_context = value; }
        }

        public ExpressionContext ExpressionContext
        {
            get { return m_expressionContext; }
        }

        public WorldModel WorldModel
        {
            get { return m_worldModel; }
        }
    }
}
