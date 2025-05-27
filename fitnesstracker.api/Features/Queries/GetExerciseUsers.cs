using FitnessTracker.Data;
using FitnessTracker.Model;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FitnessTracker.Api.UserExercises.Queries; // Changed from UserExercise to UserExercises

public record GetExerciseUsersQuery(Guid ExerciseId) : IRequest<List<User>>;

public class GetExerciseUsersQueryHandler : IRequestHandler<GetExerciseUsersQuery, List<User>>
{
    private readonly FitnessTrackerDbContext _db;

    public GetExerciseUsersQueryHandler(FitnessTrackerDbContext db)
    {
        _db = db;
    }

    public async Task<List<User>> Handle(GetExerciseUsersQuery request, CancellationToken cancellationToken)
    {
        return await _db.UserExercises
            .Where(ue => ue.ExerciseId == request.ExerciseId)
            .Select(ue => ue.User)
            .ToListAsync(cancellationToken);
    }
}