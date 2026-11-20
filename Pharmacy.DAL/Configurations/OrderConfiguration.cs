using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.BLL.Entities;

namespace Pharmacy.DAL.Configurations
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.HasKey(o => o.Id);

            builder.Property(o => o.SubTotal)
                   .HasPrecision(10, 2);

            builder.Property(o => o.DeliveryFee)
                   .HasPrecision(10, 2);

            builder.Property(o => o.TotalAmount)
                   .HasPrecision(10, 2);

            builder.Property(o => o.Notes)
                   .HasMaxLength(500);

            builder.Property(o => o.DeliveryCity)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(o => o.DeliveryStreet)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(o => o.DeliveryBuilding)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(o => o.DeliveryLatitude)
                   .HasPrecision(9, 6);

            builder.Property(o => o.DeliveryLongitude)
                   .HasPrecision(9, 6);

            builder.HasOne(o => o.User)
                   .WithMany(u => u.Orders)
                   .HasForeignKey(o => o.UserId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(o => o.Branch)
                   .WithMany(b => b.Orders)
                   .HasForeignKey(o => o.BranchId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(o => o.Address)
                   .WithMany(a => a.Orders)
                   .HasForeignKey(o => o.AddressId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(o => o.OrderItems)
                   .WithOne(oi => oi.Order)
                   .HasForeignKey(oi => oi.OrderId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}