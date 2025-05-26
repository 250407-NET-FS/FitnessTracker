using Microsoft.AspNetCore.Identity;
using fitnesstracker.model;

namespace fitnesstracker.service;

piblic interface IExerciseService
{
    Task<IdentityResult> CreateExerciseAsync(Exercise exercise);
    Task<IdentityResult> UpdateExerciseAsync(Exercise exercise);
    Task<IdentityResult> DeleteExerciseAsync(Guid exerciseId);
    Task<Exercise?> GetExerciseByIdAsync(Guid exerciseId);
    Task<IEnumerable<Exercise>> GetAllExercisesAsync();
}