using Pharmacy.BLL.Entities.Pharmacy.BLL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Pharmacy.BLL.Entities
{
    public class Category
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string? Description { get; set; }

        // Navigation Property
        public ICollection<Medicine> Medicines { get; set; }
            = new List<Medicine>();
       
    }
}

