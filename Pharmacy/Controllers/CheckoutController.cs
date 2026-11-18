using Microsoft.AspNetCore.Mvc;

namespace Pharmacy.Controllers
{
    public class CheckoutController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
