# 🍕 Retail Ordering Website (Full Stack .NET)

A full-stack retail ordering system that allows users to browse products, add items to cart, and place orders seamlessly. The system ensures secure authentication, efficient inventory management, and scalable API architecture.

---

## 🚀 Features

### 👤 User Features

* User Registration & Login (JWT based authentication)
* Browse products (Pizza, Drinks, Breads)
* Add to cart
* Place orders
* Order history (extendable)

### 🔐 Security

* JWT Authentication
* Role-based Authorization (Admin / User)
* Password hashing using BCrypt
* Secure APIs with validation

### 🛠️ Core Functionalities

* Product management (CRUD)
* Cart management
* Order placement & tracking
* Automatic inventory update on order
* REST APIs with Swagger documentation

---

## 🏗️ Tech Stack

### Backend

* ASP.NET Core Web API
* Entity Framework Core
* SQL Server (SSMS)
* JWT Authentication
* BCrypt (Password Hashing)

### Frontend

* Angular (planned / integrated separately)

---

## 📁 Project Structure

```
backend/
│
├── Configurations/
│   └── JwtSettings.cs
│
├── Controllers/
│   ├── AuthController.cs
│   ├── ProductController.cs
│   ├── CartController.cs
│   └── OrderController.cs
│
├── DTOs/
│   ├── Auth/
│   └── Cart/
│
├── Models/
│   ├── User.cs
│   ├── Product.cs
│   ├── Order.cs
│   └── OrderItem.cs
│
├── Services/
│   ├── Interfaces/
│   └── Implementations/
│
├── Helpers/
│   └── JwtHelper.cs
│
├── Middlewares/
│
├── Migrations/
│
├── appsettings.json
└── Program.cs
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/borderking20/retail-ordering-website-NullPointers-
cd retail-ordering-website
```

---

### 2️⃣ Configure Database

Update `appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=PizzaDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

---

### 3️⃣ Install Required Packages

* Microsoft.EntityFrameworkCore.SqlServer
* Microsoft.EntityFrameworkCore.Tools
* Microsoft.AspNetCore.Authentication.JwtBearer
* BCrypt.Net-Next
* Swashbuckle.AspNetCore

---

### 4️⃣ Run Migrations

```bash
Add-Migration InitialCreate
Update-Database
```

---

### 5️⃣ Run Project

```bash
dotnet run
```

Swagger will open at:

```
https://localhost:<port>/swagger
```

---

## 🔑 API Endpoints

### Auth

* POST `/api/auth/register`
* POST `/api/auth/login`

### Products

* GET `/api/products`
* POST `/api/products` (Admin)
* PUT `/api/products/{id}`
* DELETE `/api/products/{id}`

### Cart

* POST `/api/cart/add`
* GET `/api/cart`

### Orders

* POST `/api/orders/place`
* GET `/api/orders`

---

## 🔄 Authentication Flow

1. User registers/logs in
2. Server returns JWT token
3. Client stores token
4. Token sent in Authorization header
5. Backend validates token

---

## 👥 Roles

* **User** → browse, order
* **Admin** → manage products

---

## 📌 Future Enhancements

* Email notifications
* Payment integration
* Order tracking
* Admin dashboard
* Promotions & coupons

---

## 🤝 Contributors

* Devansh Gupta (Auth, APIs, Security)
* Abdullah Parvez (Database, Services, Business Logic)
* Gaurav Singh & yash pratap singh (Angular)

---

## 💡 Notes

* Designed for hackathon scalability
* Clean architecture with separation of concerns
* Easy to extend with new features

---

## ⭐ If you like this project

Give it a star on GitHub ⭐
