using FitnessTracker.Model;
using FitnessTracker.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FitnessTracker.Api.Exercises.Queries;

public record GetExerciseByIdQuery(Guid Id) : IRequest<Exercise?>;

public class GetExerciseByIdQueryHandler : IRequestHandler<GetExerciseByIdQuery, Exercise?>
{
    private readonly FitnessTrackerDbContext _db;

    public GetExerciseByIdQueryHandler(FitnessTrackerDbContext db)
    {
        _db = db;
    }

    public async Task<Exercise?> Handle(GetExerciseByIdQuery request, CancellationToken cancellationToken)
    {
        return await _db.Exercises.FirstOrDefaultAsync(e => e.Id == request.Id, cancellationToken);
    }
}