using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Pharmacy.BLL.Entities
{
    public class OrderItemBatch
    {
        public int Id { get; set; }

        public int OrderItemId { get; set; }

        public int MedicineBatchId { get; set; }

        public int Quantity { get; set; }

        // Navigation Properties
        public OrderItem OrderItem { get; set; }

        public MedicineBatch MedicineBatch { get; set; }
    }
}
