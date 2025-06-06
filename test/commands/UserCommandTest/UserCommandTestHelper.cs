using System;
using FitnessTracker.Data;
using Microsoft.EntityFrameworkCore;
using Xunit;
using FitnessTracker.Model;

namespace test.commands
{
    public class UserCommandTestHelper : IDisposable
    {
        public FitnessTrackerDbContext DbContext { get; private set; }


        public UserCommandTestHelper()
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
            var users = new List<User>
            {
                new User
                {
                    Name = "Test User",
                    Email = "test@example.com",
                    Password = "password123"
                }
            };

            DbContext.Users.AddRange(users);
            DbContext.SaveChanges();
        }

        public void Dispose()
        {
            DbContext.Dispose();
        }
    }
}