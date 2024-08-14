﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace WebEditor2.Models
{
    public class FileUpload
    {
        public int GameId { get; set; }
        public string Key { get; set; }
        public string Attribute { get; set; }
        public string AllFiles { get; set; }
        public string PostedFile { get; set; }

        [Required]
        public IFormFile File { get; set; }
    }
}