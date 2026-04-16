using backend.DTOs.Auth;
using backend.Helpers;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly JwtHelper _jwtHelper;

        public AuthService(AppDbContext context, JwtHelper jwtHelper)
        {
            _context = context;
            _jwtHelper = jwtHelper;
        }

        public async Task<string> RegisterAsync(RegisterRequestDto request)
        {
            var user = new User
            {
                userName = request.userName,
                userEmail = request.userEmail,
                passwordHash = BCrypt.Net.BCrypt.HashPassword(request.password),
                userRole = "User"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return _jwtHelper.GenerateToken(user.userId, user.userEmail, user.userRole);
        }

        public async Task<string> LoginAsync(LoginRequestDto request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.userEmail == request.userEmail);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.password, user.passwordHash))
            {
                throw new Exception("Invalid credentials");
            }

            return _jwtHelper.GenerateToken(user.userId, user.userEmail, user.userRole);
        }
    }
}