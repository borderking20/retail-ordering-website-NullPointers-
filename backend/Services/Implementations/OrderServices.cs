using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementations
{
    public class OrderServices : IOrderServices
    {
        private readonly AppDbContext _context;
        private readonly IProductServices _productService;

        public OrderServices(AppDbContext context, IProductServices productService)
        {
            _context = context;
            _productService = productService;
        }

        public async Task<Order> CreateOrderAsync(Order order)
        {
            order.CreatedAt = DateTime.UtcNow;
            order.OrderStatus = "Pending";

            // Reduce stock for each item
            foreach (var item in order.OrderItems)
            {
                var success = await _productService.ReduceProductStock(item.ProductId, item.Quantity);
                if (!success)
                {
                    throw new Exception($"Failed to reduce stock for product ID {item.ProductId}");
                }
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<IEnumerable<Order>> GetUserOrdersAsync(int userId)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }
    }
}
