using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Services.Interfaces
{
    public interface IOrderServices
    {
        Task<Order> CreateOrderAsync(Order order);
        Task<IEnumerable<Order>> GetUserOrdersAsync(int userId);
    }
}
