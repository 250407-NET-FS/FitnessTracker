using System;
using System.Threading;
using System.Threading.Tasks;
using FitnessTracker.Api.client.Commands;
using FitnessTracker.Data;
using FitnessTracker.Model;
using Xunit;

namespace test.commands
{
    public class UserCommandTest : IClassFixture<UserCommandTestHelper>
    {
        private readonly FitnessTrackerDbContext _dbContext;

        public UserCommandTest(UserCommandTestHelper fixture)
        {
            _dbContext = fixture.DbContext;
            _dbContext.Users.RemoveRange(_dbContext.Users);
            _dbContext.SaveChanges();
        }

        [Fact]
        public async Task CreateUserCommand_CreatesUser()
        {
            var command = new CreateUserCommand("New User", "newuser@example.com", "password456");
            var handler = new CreateUserCommandHandler(_dbContext);

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.NotEqual(Guid.Empty, result);
            var user = await _dbContext.Users.FindAsync(result);
            Assert.NotNull(user);
            Assert.Equal(command.Name, user.Name);
            Assert.Equal(command.Email, user.Email);
            Assert.Equal(command.Password, user.Password);
        }

        [Fact]
        public async Task DeleteCommand_DeletesUser()
        {
            var user = new User
            {
                Name = "Delete User",
                Email = "delete@example.com",
                Password = "password123"
            };
            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            var command = new DeleteUserCommand(user.Id);
            var handler = new DeleteUserCommandHandler(_dbContext);

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.True(result);
            var deletedUser = await _dbContext.Users.FindAsync(user.Id);
            Assert.Null(deletedUser);
        }

        [Fact]
        public async Task UpdateUserCommand_UpdateUser()
        {
            var user = new User
            {
                Name = "Update User",
                Email = "update@example.com",
                Password = "oldpassword"
            };
            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            var command = new UpdateUserCommand(user.Id, "Updated Name", "updated@example.com");
            var handler = new UpdateUserCommandHandler(_dbContext);

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.True(result);
            var updatedUser = await _dbContext.Users.FindAsync(user.Id);
            Assert.NotNull(updatedUser);
            Assert.Equal(command.Name, updatedUser.Name);
            Assert.Equal(command.Email, updatedUser.Email);
        }

        [Fact]
        public async Task InvalidUserCommand_DeleteInvalidUser()
        {
            var command = new DeleteUserCommand(Guid.NewGuid());
            var handler = new DeleteUserCommandHandler(_dbContext);

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.False(result);
        }
    }
}