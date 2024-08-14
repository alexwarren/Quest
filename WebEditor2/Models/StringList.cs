using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebEditor2.Models
{
    public class StringList
    {
        public string Attribute { get; set; }
        public string EditPrompt { get; set; }
        public IDictionary<string, string> Items { get; set; }
    }
}