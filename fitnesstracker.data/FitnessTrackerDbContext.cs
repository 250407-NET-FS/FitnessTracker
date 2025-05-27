using FitnessTracker.Model;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace FitnessTracker.Data;

public class FitnessTrackerDbContext : IdentityDbContext<IdentityUser>
{
    public FitnessTrackerDbContext(DbContextOptions<FitnessTrackerDbContext> options)
        : base(options)
    {
    }

    public DbSet<Exercise> Exercises => Set<Exercise>();
    public DbSet<User> Users => Set<User>();
    public DbSet<UserExercise> UserExercises => Set<UserExercise>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Exercise>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.TargetMuscleGroup).HasMaxLength(100);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.Property(u => u.Name).IsRequired().HasMaxLength(100);
            entity.Property(u => u.Email).IsRequired().HasMaxLength(100);
            entity.Property(u => u.Password).IsRequired().HasMaxLength(100);
        });

        // User can have many exercises and exercises can be assigned to many users
        modelBuilder.Entity<UserExercise>(entity =>
        {
            entity.HasKey(ue => new { ue.UserId, ue.ExerciseId });

            entity.HasOne(ue => ue.User)
                .WithMany(u => u.UserExercises)
                .HasForeignKey(ue => ue.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(ue => ue.Exercise)
                .WithMany(e => e.UserExercises)
                .HasForeignKey(ue => ue.ExerciseId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(ue => ue.Notes).HasMaxLength(500);
        });
    }
}