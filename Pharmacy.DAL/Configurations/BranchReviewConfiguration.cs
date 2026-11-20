using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pharmacy.BLL.Entities;

namespace Pharmacy.DAL.Configurations
{
    public class BranchReviewConfiguration
        : IEntityTypeConfiguration<BranchReview>
    {
        public void Configure(EntityTypeBuilder<BranchReview> builder)
        {
            builder.HasKey(br => br.Id);

            builder.Property(br => br.Comment)
                   .HasMaxLength(1000);

            builder.Property(br => br.CreatedAt)
                   .IsRequired();

            builder.HasIndex(br => br.OrderId)
                   .IsUnique();

            builder.HasOne(br => br.Branch)
                   .WithMany(b => b.BranchReviews)
                   .HasForeignKey(br => br.BranchId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(br => br.User)
                   .WithMany(u => u.BranchReviews)
                   .HasForeignKey(br => br.UserId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(br => br.Order)
                   .WithOne(o => o.BranchReview)
                   .HasForeignKey<BranchReview>(br => br.OrderId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.ToTable(table =>
            {
                table.HasCheckConstraint(
                    "CK_BranchReview_Rating",
                    "[Rating] >= 1 AND [Rating] <= 5");
            });
        }
    }
}