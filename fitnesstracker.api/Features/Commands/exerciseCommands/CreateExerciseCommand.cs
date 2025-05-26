using FitnessTracker.Model;
using FitnessTracker.Data;
using MediatR;

namespace FitnessTracker.Api.Exercises.Commands;

public record CreateExerciseCommand(string Name, string Description, string TargetMuscleGroup) : IRequest<Guid>;

public class CreateExerciseCommandHandler : IRequestHandler<CreateExerciseCommand, Guid>
{
    private readonly FitnessTrackerDbContext _db;

    public CreateExerciseCommandHandler(FitnessTrackerDbContext db)
    {
        _db = db;
    }

    public async Task<Guid> Handle(CreateExerciseCommand request, CancellationToken cancellationToken)
    {
        var exercise = new Exercise
        {
            Name = request.Name,
            Description = request.Description,
            TargetMuscleGroup = request.TargetMuscleGroup,
            CreatedAt = DateTime.UtcNow
        };
        _db.Exercises.Add(exercise);
        await _db.SaveChangesAsync(cancellationToken);
        return exercise.Id;
    }
}