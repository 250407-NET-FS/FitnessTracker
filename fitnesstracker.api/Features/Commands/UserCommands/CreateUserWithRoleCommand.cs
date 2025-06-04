using FitnessTracker.Model;
using FitnessTracker.Data;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace FitnessTracker.Api.client.Commands;

public record CreateUserWithRoleCommand(string Name, string Email, string Password, bool IsTrainer) : IRequest<Guid>;

public class CreateUserWithRoleCommandHandler : IRequestHandler<CreateUserWithRoleCommand, Guid>
{
    private readonly FitnessTrackerDbContext _db;
    private readonly UserManager<IdentityUser> _userManager;

    public CreateUserWithRoleCommandHandler(FitnessTrackerDbContext db, UserManager<IdentityUser> userManager)
    {
        _db = db;
        _userManager = userManager;
    }

    public async Task<Guid> Handle(CreateUserWithRoleCommand request, CancellationToken cancellationToken)
    {
        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            Password = request.Password,
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync(cancellationToken);

        var identityUser = new IdentityUser
        {
            UserName = request.Email,
            Email = request.Email,
            EmailConfirmed = true
        };

        var result = await _userManager.CreateAsync(identityUser, request.Password);

        if (result.Succeeded)
        {
            await _userManager.AddToRoleAsync(identityUser, request.IsTrainer ? "Trainer" : "User");
        }

        return user.Id;
    }
}