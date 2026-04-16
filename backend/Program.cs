using backend.Configurations;
using backend.Helpers;
using backend.Models;
using backend.Services.Implementations;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options => {
    options.UseSqlServer("Server= ABDULLAH\\SQLEXPRESS;Database=RetailOrderDB;Trusted_Connection=True;TrustServerCertificate=True");
});


builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("JwtSettings"));

builder.Services.AddScoped<JwtHelper>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProductServices, ProductServices>();
builder.Services.AddScoped<IOrderServices, OrderServices>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = false;
        // Use camelCase to match Angular frontend model property names
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtSettings.SecretKey))
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAngular");


app.UseHttpsRedirection();

app.UseAuthentication();   // ?? VERY IMPORTANT
app.UseAuthorization();

app.MapControllers();

// Seed database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<AppDbContext>();
    context.Database.EnsureCreated();

    var allProducts = new List<Product>
    {
        // ── Pizza ──────────────────────────────────────
        new Product { ProductName = "Margherita Pizza",       ProductPrice = 299, ProductStock = 50,  ProductCategory = "Pizza" },
        new Product { ProductName = "Pepperoni Feast",        ProductPrice = 449, ProductStock = 30,  ProductCategory = "Pizza" },
        new Product { ProductName = "Stuffed Crust Veggie",   ProductPrice = 399, ProductStock = 40,  ProductCategory = "Pizza" },
        new Product { ProductName = "BBQ Chicken Pizza",      ProductPrice = 499, ProductStock = 35,  ProductCategory = "Pizza" },
        new Product { ProductName = "Paneer Tikka Pizza",     ProductPrice = 379, ProductStock = 45,  ProductCategory = "Pizza" },
        new Product { ProductName = "Double Cheese Pizza",    ProductPrice = 349, ProductStock = 60,  ProductCategory = "Pizza" },

        // ── Breads ─────────────────────────────────────
        new Product { ProductName = "Garlic Bread",           ProductPrice = 129, ProductStock = 100, ProductCategory = "Breads" },
        new Product { ProductName = "Cheese Garlic Bread",    ProductPrice = 159, ProductStock = 80,  ProductCategory = "Breads" },
        new Product { ProductName = "Whole Wheat Loaf",       ProductPrice = 89,  ProductStock = 120, ProductCategory = "Breads" },
        new Product { ProductName = "Focaccia Herb Bread",    ProductPrice = 179, ProductStock = 60,  ProductCategory = "Breads" },
        new Product { ProductName = "Pita Bread (4 pcs)",     ProductPrice = 99,  ProductStock = 90,  ProductCategory = "Breads" },

        // ── Cold Drinks ────────────────────────────────
        new Product { ProductName = "Coca-Cola 500ml",        ProductPrice = 40,  ProductStock = 200, ProductCategory = "Cold Drinks" },
        new Product { ProductName = "Sprite 500ml",           ProductPrice = 40,  ProductStock = 180, ProductCategory = "Cold Drinks" },
        new Product { ProductName = "Mango Lassi",            ProductPrice = 79,  ProductStock = 100, ProductCategory = "Cold Drinks" },
        new Product { ProductName = "Fresh Lime Soda",        ProductPrice = 59,  ProductStock = 120, ProductCategory = "Cold Drinks" },
        new Product { ProductName = "Iced Lemon Tea",         ProductPrice = 69,  ProductStock = 90,  ProductCategory = "Cold Drinks" },
        new Product { ProductName = "Cold Coffee",            ProductPrice = 99,  ProductStock = 80,  ProductCategory = "Cold Drinks" },

        // ── Burgers ────────────────────────────────────
        new Product { ProductName = "Classic Chicken Burger", ProductPrice = 199, ProductStock = 50,  ProductCategory = "Burgers" },
        new Product { ProductName = "Veggie Delight Burger",  ProductPrice = 159, ProductStock = 60,  ProductCategory = "Burgers" },
        new Product { ProductName = "Double Patty Smash",     ProductPrice = 279, ProductStock = 40,  ProductCategory = "Burgers" },
        new Product { ProductName = "Crispy Fish Burger",     ProductPrice = 229, ProductStock = 45,  ProductCategory = "Burgers" },

        // ── Desserts ───────────────────────────────────
        new Product { ProductName = "Chocolate Lava Cake",   ProductPrice = 149, ProductStock = 70,  ProductCategory = "Desserts" },
        new Product { ProductName = "Tiramisu",               ProductPrice = 179, ProductStock = 50,  ProductCategory = "Desserts" },
        new Product { ProductName = "Gulab Jamun (4 pcs)",   ProductPrice = 89,  ProductStock = 100, ProductCategory = "Desserts" },
        new Product { ProductName = "Mango Cheesecake",      ProductPrice = 199, ProductStock = 40,  ProductCategory = "Desserts" },
    };

    var existingNames = context.Products.Select(p => p.ProductName).ToHashSet();
    var newProducts = allProducts.Where(p => !existingNames.Contains(p.ProductName)).ToList();
    if (newProducts.Any())
    {
        context.Products.AddRange(newProducts);
        context.SaveChanges();
    }
}

app.Run();