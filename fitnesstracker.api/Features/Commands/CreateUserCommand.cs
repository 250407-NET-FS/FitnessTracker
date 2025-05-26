using FitnessTracker.Model;
using FitnessTracker.Data;
using MediatR;

namespace FitnessTracker.Api.client.Commands;

public record CreateUserCommand(string Name, string Email, string Password) : IRequest<Guid>;
public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, Guid>
{
    private readonly FitnessTrackerDbContext _db;

    public CreateUserCommandHandler(FitnessTrackerDbContext db)
    {
        _db = db;
    }

    public async Task<Guid> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            Password = request.Password,
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync(cancellationToken);
        return user.Id;
    }
}