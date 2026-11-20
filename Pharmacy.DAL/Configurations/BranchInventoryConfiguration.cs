using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.BLL.Entities;

namespace Pharmacy.DAL.Configurations
{
    public class BranchInventoryConfiguration
        : IEntityTypeConfiguration<BranchInventory>
    {
        public void Configure(EntityTypeBuilder<BranchInventory> builder)
        {
            builder.HasKey(bi => bi.Id);

           
            builder.HasIndex(bi => new { bi.BranchId, bi.MedicineId })
                   .IsUnique();

            builder.HasOne(bi => bi.Branch)
                   .WithMany(b => b.Inventories)
                   .HasForeignKey(bi => bi.BranchId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(bi => bi.Medicine)
                   .WithMany(m => m.BranchInventories)
                   .HasForeignKey(bi => bi.MedicineId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(bi => bi.Batches)
                   .WithOne(b => b.BranchInventory)
                   .HasForeignKey(b => b.BranchInventoryId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
