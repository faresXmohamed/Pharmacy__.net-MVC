using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Pharmacy.BLL.Entities
{
    public class Branch
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

        public decimal Latitude { get; set; }

        public decimal Longitude { get; set; }

        public bool DeliveryAvailable { get; set; }

        public decimal DeliveryRadiusKm { get; set; }

        public bool IsActive { get; set; } = true;

        public decimal DeliveryFee { get; set; }
        // Navigation Properties
        public ICollection<BranchInventory> Inventories { get; set; }
             = new List<BranchInventory>();
        public ICollection<Order> Orders { get; set; }
             = new List<Order>();

        public ICollection<BranchReview> BranchReviews { get; set; }
            = new List<BranchReview>();
    }
}

