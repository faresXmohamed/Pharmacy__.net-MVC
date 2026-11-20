using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pharmacy.BLL.Entities
{

    namespace Pharmacy.BLL.Entities
    {
        public class Medicine
        {
            public int Id { get; set; }

            public string Name { get; set; }

            public string? Description { get; set; }

            public decimal Price { get; set; }

            public string? ImageUrl { get; set; }

            public bool IsActive { get; set; } = true;
            public string? Barcode { get; set; }
            public string? DosageForm { get; set; }
            public bool RequiresPrescription { get; set; }

            // Foreign Key
            public int CategoryId { get; set; }

            // Navigation Property
            public Category Category { get; set; }
            public ICollection<BranchInventory> BranchInventories { get; set; }
                   = new List<BranchInventory>();

            public ICollection<OrderItem> OrderItems { get; set; }
                  = new List<OrderItem>();
        }
    }

}
