using System;
using FitnessTracker.Data;
using MediatR;

namespace FitnessTracker.Api.Exercises.Commands;

public record UpdateExerciseCommand(Guid Id, string Name, string Description, string TargetMuscleGroup) : IRequest<bool>;
public class UpdateExerciseCommandHandler : IRequestHandler<UpdateExerciseCommand, bool>
{
    private readonly FitnessTrackerDbContext _db;

    public UpdateExerciseCommandHandler(FitnessTrackerDbContext db)
    {
        _db = db;
    }

    public async Task<bool> Handle(UpdateExerciseCommand request, CancellationToken cancellationToken)
    {
        var exercise = await _db.Exercises.FindAsync(new object[] { request.Id }, cancellationToken);
        if (exercise == null) return false;

        exercise.Name = request.Name;
        exercise.Description = request.Description;
        exercise.TargetMuscleGroup = request.TargetMuscleGroup;

        _db.Exercises.Update(exercise);
        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }
}