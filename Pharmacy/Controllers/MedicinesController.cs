using Microsoft.AspNetCore.Mvc;

namespace Pharmacy.Controllers
{
    public class MedicinesController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
