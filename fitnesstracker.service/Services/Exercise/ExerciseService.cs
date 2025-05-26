using Microsoft.AspNetCore.Identity;
using fitnesstracker.model;
using fitnesstracker.data;

namespace fitnesstracker.service;

public class UserService : IUserService
{
    private readonly UserManager<User> _userManager;
    private readonly FitnessTrackerDbContext _dbContext;

    public UserService(UserManager<User> userManager, FitnessTrackerDbContext dbContext)
    {
        _userManager = userManager;
        _dbContext = dbContext;
    }

    public async Task<IdentityResult> CreateUserAsync(User user, string password)
    {
        return await _userManager.CreateAsync(user, password);
    }

    public async Task<IdentityResult> UpdateUserAsync(User user)
    {
        return await _userManager.UpdateAsync(user);
    }

    public async Task<IdentityResult> DeleteUserAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return IdentityResult.Failed(new IdentityError { Description = "User not found." });
        return await _userManager.DeleteAsync(user);
    }

    public async Task<User?> GetUserByIdAsync(Guid userId)
    {
        return await _userManager.FindByIdAsync(userId.ToString());
    }

    public async Task<IEnumerable<User>> GetAllUsersAsync()
    {
        return _dbContext.Users.ToList();
    }
}