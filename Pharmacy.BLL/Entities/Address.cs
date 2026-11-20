using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Pharmacy.BLL.Entities
{
    public class Address
    {
        public int Id { get; set; }

        public string UserId { get; set; } = string.Empty;

        public string City { get; set; } = string.Empty;

        public string Street { get; set; } = string.Empty;

        public string Building { get; set; } = string.Empty;

        public decimal Latitude { get; set; }

        public decimal Longitude { get; set; }

        public bool IsDefault { get; set; }

        // Navigation Property
        public ApplicationUser User { get; set; }
        public ICollection<Order> Orders { get; set; }
              = new List<Order>();
    }
}

