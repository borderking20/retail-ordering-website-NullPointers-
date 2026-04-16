using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementations
{
    public class ProductServices : IProductServices
    {
        private readonly AppDbContext _context;

        public ProductServices(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            return await _context.Products.ToListAsync();
        }

        public async Task<bool> ReduceProductStock(int productId, int quantity)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null || product.ProductStock < quantity)
            {
                return false;
            }

            product.ProductStock -= quantity;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
