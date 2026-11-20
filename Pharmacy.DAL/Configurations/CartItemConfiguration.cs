using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.BLL.Entities;

namespace Pharmacy.DAL.Configurations
{
    public class CartItemConfiguration : IEntityTypeConfiguration<CartItem>
    {
        public void Configure(EntityTypeBuilder<CartItem> builder)
        {
            builder.HasKey(ci => ci.Id);

            builder.HasIndex(ci => new
            {
                ci.CartId,
                ci.MedicineId
            }).IsUnique();

            builder.Property(ci => ci.Quantity)
                   .IsRequired();

            builder.HasOne(ci => ci.Medicine)
                   .WithMany()
                   .HasForeignKey(ci => ci.MedicineId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.ToTable(table =>
            {
                table.HasCheckConstraint(
                    "CK_CartItem_Quantity",
                    "[Quantity] > 0");
            });
        }
    }
}