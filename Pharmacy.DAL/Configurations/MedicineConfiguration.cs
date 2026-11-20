using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.BLL.Entities;
using Pharmacy.BLL.Entities.Pharmacy.BLL.Entities;

namespace Pharmacy.DAL.Configurations
{
    public class MedicineConfiguration : IEntityTypeConfiguration<Medicine>
    {
        public void Configure(EntityTypeBuilder<Medicine> builder)
        {
            builder.HasKey(m => m.Id);

            builder.Property(m => m.Name)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(m => m.Description)
                   .HasMaxLength(1000);

            builder.Property(m => m.Price)
                   .HasPrecision(10, 2);

            builder.Property(m => m.ImageUrl)
                   .HasMaxLength(500);

            builder.Property(m => m.Barcode)
                   .HasMaxLength(50);

            builder.Property(m => m.DosageForm)
                   .HasMaxLength(100);
        }
    }
}