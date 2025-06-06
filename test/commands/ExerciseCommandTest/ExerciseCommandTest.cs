using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FitnessTracker.Api.Exercises.Commands;
using FitnessTracker.Data;
using FitnessTracker.Model;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace tests.commands
{
    public class ExerciseCommandTest : IClassFixture<ExerciseCommandTestHelper>
    {
        private readonly FitnessTrackerDbContext _dbContext;

        public ExerciseCommandTest(ExerciseCommandTestHelper fixture)
        {
            _dbContext = fixture.DbContext;
            _dbContext.Exercises.RemoveRange(_dbContext.Exercises);
            _dbContext.SaveChanges();
        }

        [Fact]
        public async Task CreateExerciseCommand_ShouldAddExerciseToDatabase()
        {
            var command = new CreateExerciseCommand("Push-up", "Basic upper body exercise", "Chest");
            var handler = new CreateExerciseCommandHandler(_dbContext);

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.NotEqual(Guid.Empty, result);
            Assert.Single(_dbContext.Exercises);
            Assert.Equal("Push-up", _dbContext.Exercises.First().Name);
        }

        [Fact]
        public async Task UpdateExerciseCommand_WithValidId_ShouldUpdateExercise()
        {
            var exercise = new Exercise
            {
                Id = Guid.NewGuid(),
                Name = "Old Name",
                Description = "Old Description",
                TargetMuscleGroup = "Old Target"
            };
            _dbContext.Exercises.Add(exercise);
            await _dbContext.SaveChangesAsync();

            var command = new UpdateExerciseCommand(exercise.Id, "New Name", "New Description", "New Target");
            var handler = new UpdateExerciseCommandHandler(_dbContext);

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.True(result);

            var updatedExercise = await _dbContext.Exercises.FindAsync(exercise.Id);
            Assert.Equal("New Name", updatedExercise.Name);
            Assert.Equal("New Description", updatedExercise.Description);
            Assert.Equal("New Target", updatedExercise.TargetMuscleGroup);
        }

        [Fact]
        public async Task UpdateExerciseCommand_WithInvalidId_ShouldReturnFalse()
        {
            var nonExistentId = Guid.NewGuid();
            var command = new UpdateExerciseCommand(nonExistentId, "New Name", "New Description", "New Target");
            var handler = new UpdateExerciseCommandHandler(_dbContext);


            var result = await handler.Handle(command, CancellationToken.None);

            Assert.False(result);
        }

        [Fact]
        public async Task DeleteExerciseCommand_WithValidId_ShouldRemoveExercise()
        {
            var exercise = new Exercise
            {
                Id = Guid.NewGuid(),
                Name = "Exercise to Delete",
                Description = "Will be deleted",
                TargetMuscleGroup = "Any"
            };
            _dbContext.Exercises.Add(exercise);
            await _dbContext.SaveChangesAsync();

            var command = new DeleteExerciseCommand(exercise.Id);
            var handler = new DeleteExerciseCommandHandler(_dbContext);

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.True(result);
            Assert.Null(await _dbContext.Exercises.FindAsync(exercise.Id));
        }

        [Fact]
        public async Task DeleteExerciseCommand_WithInvalidId_ShouldReturnFalse()
        {
            var nonExistentId = Guid.NewGuid();
            var command = new DeleteExerciseCommand(nonExistentId);
            var handler = new DeleteExerciseCommandHandler(_dbContext);

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.False(result);
        }
    }
}