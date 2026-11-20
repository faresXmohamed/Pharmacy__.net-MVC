using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Pharmacy.BLL.Entities
{
    public class BranchReview
    {
        public int Id { get; set; }

        public int BranchId { get; set; }

        public string UserId { get; set; } = string.Empty;

        public int OrderId { get; set; }

        public int Rating { get; set; }

        public string? Comment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public Branch Branch { get; set; }

        public ApplicationUser User { get; set; }

        public Order Order { get; set; }
    }
}

