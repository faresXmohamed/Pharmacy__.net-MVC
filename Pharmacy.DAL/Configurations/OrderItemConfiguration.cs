using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.BLL.Entities;

namespace Pharmacy.DAL.Configurations
{
    public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
    {
        public void Configure(EntityTypeBuilder<OrderItem> builder)
        {
            builder.HasKey(oi => oi.Id);

            builder.Property(oi => oi.MedicineName)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(oi => oi.UnitPrice)
                   .HasPrecision(10, 2);

            builder.HasOne(oi => oi.Medicine)
                   .WithMany(m => m.OrderItems)
                   .HasForeignKey(oi => oi.MedicineId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(oi => oi.OrderItemBatches)
                   .WithOne(oib => oib.OrderItem)
                   .HasForeignKey(oib => oib.OrderItemId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.ToTable(table =>
            {
                table.HasCheckConstraint(
                    "CK_OrderItem_Quantity",
                    "[Quantity] > 0");

                table.HasCheckConstraint(
                    "CK_OrderItem_UnitPrice",
                    "[UnitPrice] > 0");
            });
        }
    }
}