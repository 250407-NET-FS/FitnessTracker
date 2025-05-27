using FitnessTracker.Model;
using FitnessTracker.Data;
using MediatR;

namespace FitnessTracker.Api.client.Commands;

public record UpdateUserCommand(Guid UserId, string Name, string Email) : IRequest<bool>;
public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, bool>
{
    private readonly FitnessTrackerDbContext _db;

    public UpdateUserCommandHandler(FitnessTrackerDbContext db)
    {
        _db = db;
    }

    public async Task<bool> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _db.Users.FindAsync(request.UserId);
        if (user == null)
        {
            return false;
        }

        user.Name = request.Name;
        user.Email = request.Email;

        _db.Users.Update(user);
        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }
}