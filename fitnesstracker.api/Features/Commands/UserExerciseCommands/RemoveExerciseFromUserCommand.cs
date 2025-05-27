using FitnessTracker.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FitnessTracker.Api.UserExercises.Commands;

public record RemoveExerciseFromUserCommand(Guid UserId, Guid ExerciseId) : IRequest<bool>;

public class RemoveExerciseFromUserCommandHandler : IRequestHandler<RemoveExerciseFromUserCommand, bool>
{
    private readonly FitnessTrackerDbContext _db;

    public RemoveExerciseFromUserCommandHandler(FitnessTrackerDbContext db)
    {
        _db = db;
    }

    public async Task<bool> Handle(RemoveExerciseFromUserCommand request, CancellationToken cancellationToken)
    {
        var userExercise = await _db.UserExercises
            .FirstOrDefaultAsync(ue =>
                ue.UserId == request.UserId && ue.ExerciseId == request.ExerciseId,
                cancellationToken);

        if (userExercise == null) return false;

        _db.UserExercises.Remove(userExercise);
        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }
}