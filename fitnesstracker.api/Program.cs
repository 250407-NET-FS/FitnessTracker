using System.Reflection;
using FitnessTracker.Api.Exercises.Commands;
using FitnessTracker.Api.Features.Queries;
using FitnessTracker.Api.client.Commands;
using FitnessTracker.Api.Exercises.Queries;
using FitnessTracker.Api.Authentication;
using FitnessTracker.Api.UserExercises.Commands;
using FitnessTracker.Api.UserExercises.Queries;
using FitnessTracker.Api.Features.Extensions;

using FitnessTracker.Data;
using FitnessTracker.Model;
using FitnessTracker.Api;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<FitnessTrackerDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "FitnessTracker API",
        Version = "v1",
        Description = "API for managing fitness exercises and user tracking"
    });

    c.TagActionsBy(api => new[] { api.GroupName ?? api.HttpMethod });


    c.OrderActionsBy(apiDesc => apiDesc.GroupName);

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header. Enter your token ",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
// cors before build 
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

//exception handler for whole api
builder.Services.AddExceptionHandler(options =>
{
    options.ExceptionHandler = async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        await context.Response.WriteAsJsonAsync(new { error = "An unexpected error occurred" });
    };
});

builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<FitnessTrackerDbContext>()
    .AddDefaultTokenProviders();

var jwtKey = builder.Configuration["JwtSettings:Key"] ?? "your-default-secret-key-that-is-long-enough-for-sha256";
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"] ?? "fitnessTrackerApi",
        ValidAudience = builder.Configuration["JwtSettings:Audience"] ?? "fitnessTrackerClient",
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes)
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Headers["Authorization"].FirstOrDefault();

            if (!string.IsNullOrEmpty(accessToken) && accessToken.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            {
                accessToken = accessToken.Substring(7);
            }

            context.Token = accessToken;
            return Task.CompletedTask;
        }
    };
});

// Add authorization services
builder.Services.AddAuthorization();

var app = builder.Build();

// Seed admin user
using (var scope = app.Services.CreateScope())
{
    await SeedData.InitializeAsync(scope.ServiceProvider);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "FitnessTracker API v1"));
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
// Enable CORS
app.UseCors("AllowAll");
app.UseExceptionHandler();

app.MapGet("/APIhealth", () => Results.Ok("API is running"))
    .WithName("HealthCheck")
    .WithOpenApi();


//////////////////////////////////////////////////////////////////////////////////////////  
// Exercise endpoints
app.MapPost("/exercises", async (CreateExerciseCommand command, IMediator mediator) =>
{
    var id = await mediator.Send(command);
    return Results.Created($"/exercises/{id}", id);
})
.WithName("CreateExercise")
.WithTag("Exercises");

app.MapGet("/exercises", async (IMediator mediator) =>
{
    var exercises = await mediator.Send(new GetAllExerciseQuery());
    return Results.Ok(exercises);
})
.WithName("GetAllExercises")
.WithTag("Exercises");

app.MapGet("/exercises/{id}", async (Guid id, IMediator mediator) =>
{
    var exercise = await mediator.Send(new GetExerciseByIdQuery(id));
    return exercise is not null ? Results.Ok(exercise) : Results.NotFound();
})
.WithName("GetExerciseById")
.WithTag("Exercises");

app.MapPut("/exercises/{id}", async (Guid id, UpdateExerciseCommand command, IMediator mediator) =>
{
    var success = await mediator.Send(command with { Id = id });
    return success ? Results.NoContent() : Results.NotFound();
})
.WithName("UpdateExercise")
.WithTag("Exercises");

app.MapDelete("/exercises/{id}", async (Guid id, IMediator mediator) =>
{
    var success = await mediator.Send(new DeleteExerciseCommand(id));
    return success ? Results.NoContent() : Results.NotFound();
})
.WithName("DeleteExercise")
.WithTag("Exercises");
/////////////////////////////////////////////////////////////////////////////////////////////
// User endpoints
app.MapPost("/users", async (CreateUserCommand command, IMediator mediator) =>
{
    var id = await mediator.Send(command);
    return Results.Created($"/users/{id}", id);
})
.WithName("CreateUser")
.WithTag("User");

app.MapGet("/users", async (IMediator mediator) =>
{
    var users = await mediator.Send(new GetAllUserQuery());
    return Results.Ok(users);
})
.WithName("GetAllUsers")
.WithTag("User");

app.MapGet("/users/{id}", async (Guid id, IMediator mediator) =>
{
    var user = await mediator.Send(new GetUserByIdQuery(id));
    return user is not null ? Results.Ok(user) : Results.NotFound();
})
.WithName("GetUserById")
.WithTag("User");

app.MapPut("/users/{id}", async (Guid id, UpdateUserCommand command, IMediator mediator) =>
{
    var success = await mediator.Send(command with { UserId = id });
    return success ? Results.NoContent() : Results.NotFound();
})
.WithName("UpdateUser")
.WithTag("User");

app.MapDelete("/users/{id}", async (Guid id, IMediator mediator) =>
{
    var success = await mediator.Send(new DeleteUserCommand(id));
    return success ? Results.NoContent() : Results.NotFound();
})
.WithName("DeleteUser")
.WithTag("User")
.RequireAuthorization(policy => policy.RequireRole("Admin"));


app.MapLoginEndpoint();

//////////////////////////// User - Exercise 
app.MapPost("/users/{userId}/exercises/{exerciseId}", async (Guid userId, Guid exerciseId, ExerciseDetailsRequest details, IMediator mediator) =>
{
    var command = new AssignExerciseToUserCommand(userId, exerciseId, details.TargetSets, details.TargetReps);
    var success = await mediator.Send(command);
    return success ? Results.NoContent() : Results.NotFound();
})
.WithName("AssignExerciseToUser")
.WithTag("User Exercises");

app.MapDelete("/users/{userId}/exercises/{exerciseId}", async (Guid userId, Guid exerciseId, IMediator mediator) =>
{
    var success = await mediator.Send(new RemoveExerciseFromUserCommand(userId, exerciseId));
    return success ? Results.NoContent() : Results.NotFound();
})
.WithName("RemoveExerciseFromUser")
.WithTag("User Exercises");

app.MapGet("/users/{userId}/exercises", async (Guid userId, IMediator mediator) =>
{
    var exercises = await mediator.Send(new GetUserExercisesQuery(userId));
    return exercises.Any() ? Results.Ok(exercises) : Results.NotFound();
})
.WithName("GetUserExercises")
.WithTag("User Exercises");

app.MapGet("/exercises/{exerciseId}/users", async (Guid exerciseId, IMediator mediator) =>
{
    var users = await mediator.Send(new GetExerciseUsersQuery(exerciseId));
    return users.Any() ? Results.Ok(users) : Results.NotFound();
})
.WithName("GetExerciseUsers")
.WithTag("User Exercises");

app.Run();
