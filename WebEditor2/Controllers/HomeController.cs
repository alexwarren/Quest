using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using WebEditor2.Models;

namespace WebEditor2.Controllers
{
    public class HomeController : Controller
    {
        private readonly IConfiguration _configuration;

        public HomeController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IActionResult Index()
        {
            var url = _configuration["WebsiteHome"];
            if (url == null)
            {
                return NotFound();
            }
            return new RedirectResult(url);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
