using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.BLL.Entities;

namespace Pharmacy.DAL.Configurations
{
    public class BranchConfiguration : IEntityTypeConfiguration<Branch>
    {
        public void Configure(EntityTypeBuilder<Branch> builder)
        {
            builder.HasKey(b => b.Id);

            builder.Property(b => b.Name)
                   .IsRequired()
                   .HasMaxLength(150);

            builder.Property(b => b.Address)
                   .IsRequired()
                   .HasMaxLength(300);

            builder.Property(b => b.Latitude)
                   .HasPrecision(9, 6);

            builder.Property(b => b.Longitude)
                   .HasPrecision(9, 6);

            builder.Property(b => b.DeliveryRadiusKm)
                   .HasPrecision(8, 2);

            builder.Property(b => b.DeliveryFee)
                   .HasPrecision(10, 2);
        }
    }
}