using FitnessTracker.Model;
using FitnessTracker.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FitnessTracker.Api.Features.Queries;

public record GetAllExerciseQuery() : IRequest<List<Exercise>>;
public class GetAllExerciseQueryHandler : IRequestHandler<GetAllExerciseQuery, List<Exercise>>
{
    private readonly FitnessTrackerDbContext _db;

    public GetAllExerciseQueryHandler(FitnessTrackerDbContext db)
    {
        _db = db;
    }

    public async Task<List<Exercise>> Handle(GetAllExerciseQuery request, CancellationToken cancellationToken)
    {
        return await _db.Exercises.ToListAsync(cancellationToken);
    }
}