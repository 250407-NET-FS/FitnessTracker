using Microsoft.AspNetCore.Identity;
using fitnesstracker.model;


namespace fitnesstracker.services;

public interface IUserService
{
    Task<IdentityResult> CreateUserAsync(User user, string password);
    Task<IdentityResult> UpdateUserAsync(User user);
    Task<IdentityResult> DeleteUserAsync(Guid userId);
    Task<User?> GetUserByIdAsync(Guid userId);
    Task<IEnumerable<User>> GetAllUsersAsync();
}