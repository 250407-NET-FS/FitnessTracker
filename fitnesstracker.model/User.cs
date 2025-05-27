using System.ComponentModel.DataAnnotations;

namespace FitnessTracker.Model;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public ICollection<UserExercise> UserExercises { get; set; } = new List<UserExercise>();
}