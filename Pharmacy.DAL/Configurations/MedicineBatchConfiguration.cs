using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.BLL.Entities;

namespace Pharmacy.DAL.Configurations
{
    public class MedicineBatchConfiguration
        : IEntityTypeConfiguration<MedicineBatch>
    {
        public void Configure(EntityTypeBuilder<MedicineBatch> builder)
        {
            builder.HasKey(mb => mb.Id);

            builder.Property(mb => mb.BatchNumber)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(mb => mb.ExpiryDate)
                   .IsRequired();

            builder.HasIndex(mb => new
            {
                mb.BranchInventoryId,
                mb.BatchNumber
            }).IsUnique();

            builder.ToTable(table =>
            {
                table.HasCheckConstraint(
                    "CK_MedicineBatch_Quantity",
                    "[Quantity] >= 0");

                table.HasCheckConstraint(
                    "CK_MedicineBatch_ReservedQuantity",
                    "[ReservedQuantity] >= 0 AND [ReservedQuantity] <= [Quantity]");
            });
        }
    }
}