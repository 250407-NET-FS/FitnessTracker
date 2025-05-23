using FitnessTracker.Model;
using MediatR;

namespace FitnessTracker.Api.Features.Exercises.Commands;

public record CreateExerciseCommand : IRequest<int>
{
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string TargetMuscleGroup { get; init; } = string.Empty;
}

public class CreateExerciseCommandHandler : IRequestHandler<CreateExerciseCommand, int>
{

}