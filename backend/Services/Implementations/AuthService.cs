using backend.DTOs.Auth;
using backend.Helpers;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;


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
                UserName = request.UserName,
                UserEmail = request.UserEmail,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                UserRole = "User"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return _jwtHelper.GenerateToken(user.UserId, user.UserEmail, user.UserRole);
        }

        public async Task<string> LoginAsync(LoginRequestDto request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.UserEmail == request.UserEmail);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new Exception("Invalid credentials");
            }

            return _jwtHelper.GenerateToken(user.UserId, user.UserEmail, user.UserRole);
        }
    }
}