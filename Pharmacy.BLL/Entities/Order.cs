using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


using Pharmacy.BLL.Enums;

namespace Pharmacy.BLL.Entities
{
    public class Order
    {
        public int Id { get; set; }

        public string UserId { get; set; } = string.Empty;

        public int BranchId { get; set; }

        public int AddressId { get; set; }

        public decimal SubTotal { get; set; }

        public decimal DeliveryFee { get; set; }

        public decimal TotalAmount { get; set; }
        public string? Notes { get; set; }

        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        public PaymentMethod PaymentMethod { get; set; }
            = PaymentMethod.CashOnDelivery;

        public PaymentStatus PaymentStatus { get; set; }
            = PaymentStatus.Pending;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string DeliveryCity { get; set; } = string.Empty;

        public string DeliveryStreet { get; set; } = string.Empty;

        public string DeliveryBuilding { get; set; } = string.Empty;
        public decimal DeliveryLatitude { get; set; }

        public decimal DeliveryLongitude { get; set; }

        // Navigation Properties
        public ApplicationUser User { get; set; }

        public Branch Branch { get; set; }

        public Address Address { get; set; }
       

        public ICollection<OrderItem> OrderItems { get; set; }
            = new List<OrderItem>();

        public BranchReview? BranchReview { get; set; }
    }
}

