using System;
using System.Collections.Generic;
using System.Linq;
using System.Configuration;
using WebInterfaces;

namespace WebEditor2.Services
{
    public class FileManagerLoader(IConfiguration configuration)
    {
        private static bool s_loaded = false;
        private static IEditorFileManager s_editorFileManager = null;

        public IEditorFileManager GetFileManager()
        {
            if (s_loaded)
            {
                return s_editorFileManager;
            }
            else
            {
                string typeName = configuration["FileManagerType"];
                s_loaded = true;
                if (typeName == null) return null;
                s_editorFileManager = (IEditorFileManager)Activator.CreateInstance(Type.GetType(typeName));
                return s_editorFileManager;
            }
        }
    }
}