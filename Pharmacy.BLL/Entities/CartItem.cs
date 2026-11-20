using Pharmacy.BLL.Entities.Pharmacy.BLL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Pharmacy.BLL.Entities
{
    public class CartItem
    {
        public int Id { get; set; }

        public int CartId { get; set; }

        public int MedicineId { get; set; }

        public int Quantity { get; set; }

        // Navigation Properties
        public Cart Cart { get; set; }

        public Medicine Medicine { get; set; }
    }
}

