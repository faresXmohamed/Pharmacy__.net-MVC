using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.BLL.Entities;

namespace Pharmacy.DAL.Configurations
{
    public class OrderItemBatchConfiguration
        : IEntityTypeConfiguration<OrderItemBatch>
    {
        public void Configure(EntityTypeBuilder<OrderItemBatch> builder)
        {
            builder.HasKey(oib => oib.Id);

            builder.HasOne(oib => oib.OrderItem)
                   .WithMany(oi => oi.OrderItemBatches)
                   .HasForeignKey(oib => oib.OrderItemId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(oib => oib.MedicineBatch)
                   .WithMany(mb => mb.OrderItemBatches)
                   .HasForeignKey(oib => oib.MedicineBatchId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.ToTable(table =>
            {
                table.HasCheckConstraint(
                    "CK_OrderItemBatch_Quantity",
                    "[Quantity] > 0");
            });
        }
    }
}