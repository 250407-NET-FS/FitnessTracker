using FitnessTracker.Data;
using FitnessTracker.Model;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FitnessTracker.Api.UserExercises.Commands;

public record AssignExerciseToUserCommand(
    Guid UserId,
    Guid ExerciseId,
    int? TargetSets = null,
    int? TargetReps = null,
    string? Notes = null) : IRequest<bool>;

public class AssignExerciseToUserCommandHandler : IRequestHandler<AssignExerciseToUserCommand, bool>
{
    private readonly FitnessTrackerDbContext _db;

    public AssignExerciseToUserCommandHandler(FitnessTrackerDbContext db)
    {
        _db = db;
    }

    public async Task<bool> Handle(AssignExerciseToUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _db.Users.FindAsync(new object[] { request.UserId }, cancellationToken);
        if (user == null) return false;
        var exercise = await _db.Exercises.FindAsync(new object[] { request.ExerciseId }, cancellationToken);
        if (exercise == null) return false;

        var existing = await _db.UserExercises
            .FirstOrDefaultAsync(ue =>
                ue.UserId == request.UserId && ue.ExerciseId == request.ExerciseId,
                cancellationToken);

        if (existing != null)
        {
            existing.TargetSets = request.TargetSets;
            existing.TargetReps = request.TargetReps;
            existing.Notes = request.Notes;
            existing.DateAssigned = DateTime.UtcNow;
        }
        else
        {
            var userExercise = new UserExercise
            {
                UserId = request.UserId,
                ExerciseId = request.ExerciseId,
                TargetSets = request.TargetSets,
                TargetReps = request.TargetReps,
                Notes = request.Notes,
                DateAssigned = DateTime.UtcNow
            };

            await _db.UserExercises.AddAsync(userExercise, cancellationToken);
        }

        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }
}