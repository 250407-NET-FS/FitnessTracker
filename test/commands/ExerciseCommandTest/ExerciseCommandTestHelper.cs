using System;
using FitnessTracker.Data;
using Microsoft.EntityFrameworkCore;
using Xunit;
using FitnessTracker.Model;

namespace tests.commands
{
    public class ExerciseCommandTestHelper : IDisposable
    {
        public FitnessTrackerDbContext DbContext { get; private set; }

        public ExerciseCommandTestHelper()
        {
            var options = new DbContextOptionsBuilder<FitnessTrackerDbContext>()
                .UseInMemoryDatabase(databaseName: "FitnessTrackerTestDb")
                .Options;

            DbContext = new FitnessTrackerDbContext(options);

            DbContext.Database.EnsureCreated();

            SeedDatabase();
        }

        private void SeedDatabase()
        {
            var exercises = new List<Exercise>
            {
                new Exercise
                {
                    Id = Guid.NewGuid(),
                    Name = "Push-up",
                    Description = "Basic upper body exercise",
                    TargetMuscleGroup = "Chest",
                    CreatedAt = DateTime.UtcNow

                }
            };
            DbContext.Exercises.AddRange(exercises);
            var users = new List<User>
            {
                new User
                {
                    Name = "Test User",
                    Email = "test@email.com",
                    Password = "Password123!",
                }
            };
            DbContext.Users.AddRange(users);
            var userExercises = new List<UserExercise>
            {
                new UserExercise
                {
                    UserId = users[0].Id,
                    ExerciseId = exercises[0].Id
                }
            };
            DbContext.UserExercises.AddRange(userExercises);
            DbContext.SaveChanges();
        }

        public void Dispose()
        {
            DbContext.Database.EnsureDeleted();
            DbContext.Dispose();
        }
    }
}