using FitnessTracker.Model;
using FitnessTracker.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FitnessTracker.Api.Features.Queries;

public record GetAllUserQuery() : IRequest<List<User>>;
public class GetAllUserQueryHandler : IRequestHandler<GetAllUserQuery, List<User>>
{
    private readonly FitnessTrackerDbContext _db;

    public GetAllUserQueryHandler(FitnessTrackerDbContext db)
    {
        _db = db;
    }

    public async Task<List<User>> Handle(GetAllUserQuery request, CancellationToken cancellationToken)
    {
        return await _db.Users.ToListAsync(cancellationToken);
    }
}