using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

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

        if (!await roleManager.RoleExistsAsync("Trainer"))
        {
            await roleManager.CreateAsync(new IdentityRole("Trainer"));
        }

        var adminEmail = "admin@fitnesstracker.com";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser == null)
        {
            adminUser = new IdentityUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(adminUser, "Admin123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }

        var trainerEmail = "trainer@fitnesstracker.com";
        var trainerUser = await userManager.FindByEmailAsync(trainerEmail);
        if (trainerUser == null)
        {
            trainerUser = new IdentityUser
            {
                UserName = trainerEmail,
                Email = trainerEmail,
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(trainerUser, "Trainer123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(trainerUser, "Trainer");
            }
        }
    }
}