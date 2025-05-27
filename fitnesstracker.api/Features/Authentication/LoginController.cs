using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace FitnessTracker.Api.Authentication;

public record LoginRequest(string Username, string Password);
public record LoginResponse(string Token, DateTime Expiration);

public static class LoginController
{
    public static void MapLoginEndpoint(this WebApplication app)
    {
        app.MapPost("/login", async (LoginRequest request, UserManager<IdentityUser> userManager, IConfiguration config) =>
        {
            try
            {
                var user = await userManager.FindByEmailAsync(request.Username);
                if (user == null)
                {
                    Console.WriteLine($"User not found: {request.Username}");
                    return Results.Unauthorized();
                }

                var isPasswordValid = await userManager.CheckPasswordAsync(user, request.Password);
                if (!isPasswordValid)
                {
                    Console.WriteLine("Invalid password");
                    return Results.Unauthorized();
                }

                var roles = await userManager.GetRolesAsync(user);
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName!),
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };

                foreach (var role in roles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role));
                }

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                    config["JwtSettings:Key"] ?? "your-default-secret-key-that-is-long-enough-for-sha256"));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var expiry = DateTime.Now.AddDays(1);

                var token = new JwtSecurityToken(
                    issuer: config["JwtSettings:Issuer"] ?? "fitnessTrackerApi",
                    audience: config["JwtSettings:Audience"] ?? "fitnessTrackerClient",
                    claims: claims,
                    expires: expiry,
                    signingCredentials: creds
                );

                return Results.Ok(new LoginResponse(
                    new JwtSecurityTokenHandler().WriteToken(token),
                    expiry
                ));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Login error: {ex.Message}");
                return Results.Problem(
                    title: "An error occurred during login",
                    detail: ex.Message,
                    statusCode: 500
                );
            }
        })
        .AllowAnonymous()
        .WithName("Login")
        .WithOpenApi();
    }
}