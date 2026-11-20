using Pharmacy.BLL.Entities.Pharmacy.BLL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Pharmacy.BLL.Entities
{
    public class OrderItem
    {
        public int Id { get; set; }

        public int OrderId { get; set; }

        public int MedicineId { get; set; }

        public string MedicineName { get; set; } = string.Empty;

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }


        // Navigation Properties
        public Order Order { get; set; }

        public Medicine Medicine { get; set; }
        public ICollection<OrderItemBatch> OrderItemBatches { get; set; }
               = new List<OrderItemBatch>();
       
    }
}
