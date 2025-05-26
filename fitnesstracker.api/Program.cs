using System.Reflection;
using FitnessTracker.Api.Exercises.Commands;
using MediatR;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapGet("/health", () => Results.Ok("API is running"))
    .WithName("HealthCheck")
    .WithOpenApi();


app.MapPost("/exercises", async (CreateExerciseCommand command, IMediator mediator) =>
{
    var id = await mediator.Send(command);
    return Results.Created($"/exercises/{id}", id);
})
.WithName("CreateExercise")
.WithOpenApi();

app.Run();
