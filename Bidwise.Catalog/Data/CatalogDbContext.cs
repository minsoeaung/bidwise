using Bidwise.Catalog.Entities;
using Microsoft.EntityFrameworkCore;

namespace Bidwise.Catalog.Data;

public class CatalogDbContext(DbContextOptions options) : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>()
            .HasIndex(c => c.Name)
            .IsUnique();

        modelBuilder.Entity<Item>()
            .HasOne(i => i.Category)
            .WithMany()
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Item>()
           .HasMany(i => i.Images)
           .WithOne()
           .HasForeignKey(i => i.ItemId)
           .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Item>()
          .HasMany(i => i.Attributes)
          .WithOne()
          .HasForeignKey(i => i.ItemId)
          .OnDelete(DeleteBehavior.Cascade);

        base.OnModelCreating(modelBuilder);
    }

    public DbSet<Item> Items { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Image> Images { get; set; }
    public DbSet<Entities.Attribute> Attributes { get; set; }
}
