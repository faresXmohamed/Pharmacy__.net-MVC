using Microsoft.EntityFrameworkCore;
using Pharmacy.BLL.Entities;
using Pharmacy.BLL.Entities.Pharmacy.BLL.Entities;

namespace Pharmacy.DAL.Context
{
    public class PharmacyDbContext : DbContext
    {
        public DbSet<Category> Categories { get; set; }
        public DbSet<Medicine> Medicines { get; set; }
        public DbSet<Branch> Branches { get; set; }
        public DbSet<BranchInventory> BranchInventories { get; set; }
        public DbSet<MedicineBatch> MedicineBatches { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<OrderItemBatch> OrderItemBatches { get; set; }
        public DbSet<BranchReview> BranchReviews { get; set; }
        public DbSet<ApplicationUser> ApplicationUsers { get; set; }

        public PharmacyDbContext(DbContextOptions<PharmacyDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(
                typeof(PharmacyDbContext).Assembly
            );
        }
    }
}