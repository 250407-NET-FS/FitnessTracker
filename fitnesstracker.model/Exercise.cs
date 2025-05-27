namespace FitnessTracker.Model;

public class Exercise
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string TargetMuscleGroup { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<UserExercise> UserExercises { get; set; } = new List<UserExercise>();
}