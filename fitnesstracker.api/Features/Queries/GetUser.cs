using FitnessTracker.Model;
using FitnessTracker.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FitnessTracker.Api.Features.Queries;

public record GetUserByIdQuery(Guid Id) : IRequest<User?>;
public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, User?>
{
    private readonly FitnessTrackerDbContext _db;

    public GetUserByIdQueryHandler(FitnessTrackerDbContext db)
    {
        _db = db;
    }

    public async Task<User?> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        return await _db.Users.FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken);
    }
}