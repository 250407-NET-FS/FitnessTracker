using FitnessTracker.Data;
using FitnessTracker.Model;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FitnessTracker.Api.UserExercises.Queries; // Changed from UserExercise to UserExercises

public record GetUserExercisesQuery(Guid UserId) : IRequest<List<Exercise>>;

public class GetUserExercisesQueryHandler : IRequestHandler<GetUserExercisesQuery, List<Exercise>>
{
    private readonly FitnessTrackerDbContext _db;

    public GetUserExercisesQueryHandler(FitnessTrackerDbContext db)
    {
        _db = db;
    }

    public async Task<List<Exercise>> Handle(GetUserExercisesQuery request, CancellationToken cancellationToken)
    {
        return await _db.UserExercises
            .Where(ue => ue.UserId == request.UserId)
            .Select(ue => ue.Exercise)
            .ToListAsync(cancellationToken);
    }
}