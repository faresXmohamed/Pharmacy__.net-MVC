using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Pharmacy.BLL.Entities
{
    public class MedicineBatch
    {
        public int Id { get; set; }

        public int BranchInventoryId { get; set; }

        public string BatchNumber { get; set; } = string.Empty;

        public DateTime ExpiryDate { get; set; }

        public int Quantity { get; set; }

        public int ReservedQuantity { get; set; }

        // Navigation Property
        public BranchInventory BranchInventory { get; set; }
        public ICollection<OrderItemBatch> OrderItemBatches { get; set; }
                 = new List<OrderItemBatch>();

       
    }
}

