using FitnessTracker.Model;
using Microsoft.EntityFrameworkCore;

namespace FitnessTracker.Data;

public class FitnessTrackerDbContext : DbContext
{
    public FitnessTrackerDbContext(DbContextOptions<FitnessTrackerDbContext> options)
        : base(options)
    {
    }

    public DbSet<Exercise> Exercises => Set<Exercise>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Exercise entity
        modelBuilder.Entity<Exercise>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.TargetMuscleGroup).HasMaxLength(100);
        });
    }
}