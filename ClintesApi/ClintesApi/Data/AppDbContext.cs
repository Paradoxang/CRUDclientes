using ClientesApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ClientesApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Cliente> Clientes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
       
        modelBuilder.Entity<Cliente>()
            .HasIndex(c => c.Correo)
            .IsUnique();
    }
}