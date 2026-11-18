using Microsoft.AspNetCore.Mvc;

namespace Pharmacy.Controllers
{
    public class AdminController : Controller
    {
        public IActionResult Dashboard()
        {
            return View();
        }


        public IActionResult Branches()
        {
            return View();
        }


        public IActionResult Medicines()
        {
            return View();
        }


        public IActionResult Orders()
        {
            return View();
        }



    }
}
