using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


using Microsoft.AspNetCore.Identity;

namespace Pharmacy.BLL.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;


        // Navigation Properties


         public ICollection<Address> Addresses { get; set; }
              = new List<Address>();

        public Cart Cart { get; set; }

        public ICollection<Order> Orders { get; set; }
            = new List<Order>();

        public ICollection<BranchReview> BranchReviews { get; set; }
            = new List<BranchReview>();
    }
}

