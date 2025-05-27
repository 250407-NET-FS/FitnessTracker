using FitnessTracker.Model;
using FitnessTracker.Data;
using MediatR;

namespace FitnessTracker.Api.client.Commands;

public record DeleteUserCommand(Guid UserId) : IRequest<bool>;
public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, bool>
{
    private readonly FitnessTrackerDbContext _db;

    public DeleteUserCommandHandler(FitnessTrackerDbContext db)
    {
        _db = db;
    }

    public async Task<bool> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _db.Users.FindAsync(request.UserId);
        if (user == null)
        {
            return false;
        }

        _db.Users.Remove(user);
        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }
}