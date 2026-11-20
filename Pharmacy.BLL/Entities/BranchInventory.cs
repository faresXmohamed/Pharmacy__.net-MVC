using Pharmacy.BLL.Entities.Pharmacy.BLL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Pharmacy.BLL.Entities
{
    public class BranchInventory
    {
        public int Id { get; set; }

        public int BranchId { get; set; }

        public int MedicineId { get; set; }

       

        // Navigation Properties
        public Branch Branch { get; set; }

        public Medicine Medicine { get; set; }

        public ICollection<MedicineBatch> Batches { get; set; }
            = new List<MedicineBatch>();
    }
}

