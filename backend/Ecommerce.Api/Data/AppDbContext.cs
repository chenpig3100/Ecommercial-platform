using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Ecommerce.Api.Models;

namespace Ecommerce.Api.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Product>()
            .HasOne(product => product.Seller)
            .WithMany(user => user.Products)
            .HasForeignKey(product => product.SellerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Product>()
            .Property(product => product.IsActive)
            .HasDefaultValue(true);
    }
}
