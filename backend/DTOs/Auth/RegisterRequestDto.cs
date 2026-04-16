namespace backend.DTOs.Auth
{
    public class RegisterRequestDto
    {
        public string userName { get; set; } = string.Empty;
        public string userEmail { get; set; } = string.Empty;
        public string password { get; set; } = string.Empty;   // ✅ ADD THIS
    }
}
