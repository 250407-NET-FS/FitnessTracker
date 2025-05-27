namespace FitnessTracker.Model;

public class UserExercise
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid ExerciseId { get; set; }
    public Exercise Exercise { get; set; } = null!;

    public DateTime DateAssigned { get; set; } = DateTime.UtcNow;
    public int? TargetSets { get; set; }
    public int? TargetReps { get; set; }
    public string? Notes { get; set; }
}