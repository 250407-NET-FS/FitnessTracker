using System;
using FitnessTracker.Data;
using MediatR;

namespace FitnessTracker.Api.Exercises.Commands;

public record DeleteExerciseCommand(Guid Id) : IRequest<bool>;
public class DeleteExerciseCommandHandler : IRequestHandler<DeleteExerciseCommand, bool>
{
    private readonly FitnessTrackerDbContext _db;

    public DeleteExerciseCommandHandler(FitnessTrackerDbContext db)
    {
        _db = db;
    }

    public async Task<bool> Handle(DeleteExerciseCommand request, CancellationToken cancellationToken)
    {
        var exercise = await _db.Exercises.FindAsync(new object[] { request.Id }, cancellationToken);
        if (exercise == null) return false;

        _db.Exercises.Remove(exercise);
        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }
}