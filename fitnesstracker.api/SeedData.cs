using Microsoft.AspNetCore.Identity;

namespace FitnessTracker.Api;

public static class SeedData
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = serviceProvider.GetRequiredService<UserManager<IdentityUser>>();

        if (!await roleManager.RoleExistsAsync("Admin"))
        {
            await roleManager.CreateAsync(new IdentityRole("Admin"));
        }

        var adminUser = await userManager.FindByNameAsync("admin@fitnesstracker.com");
        if (adminUser == null)
        {
            adminUser = new IdentityUser
            {
                UserName = "admin@fitnesstracker.com",
                Email = "admin@fitnesstracker.com",
                EmailConfirmed = true
            };

            await userManager.CreateAsync(adminUser, "AdminP@ss123!");
            await userManager.AddToRoleAsync(adminUser, "Admin");
        }
    }
}