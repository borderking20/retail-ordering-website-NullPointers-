using System.Collections.Generic;

namespace backend.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;

        public string UserRole { get; set; } = "User"; 

        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
