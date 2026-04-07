# Ecommercial Platform

Full-stack ecommerce platform built with ASP.NET Core, PostgreSQL, React, and Azure. The project supports product browsing, authentication, cart and checkout flows, buyer order tracking, seller management tools, and admin dashboards.

## Live Demo

- Frontend: https://gray-beach-03b527b00.2.azurestaticapps.net
- Backend health check: https://ecommerce-api-bryan-ddbsfyh7c7chajba.australiaeast-01.azurewebsites.net/health
- Backend API base URL: https://ecommerce-api-bryan-ddbsfyh7c7chajba.australiaeast-01.azurewebsites.net/api

## Features

- Public product catalog with category filtering and search
- Product detail pages
- User registration and JWT-based login
- Buyer cart, checkout, and order history
- Seller dashboard, product management, and seller order management
- Admin dashboard for users, products, and orders
- Role-based route protection across Buyer, Seller, and Admin flows

## Tech Stack

### Backend

- ASP.NET Core 10 Web API
- Entity Framework Core
- PostgreSQL
- ASP.NET Core Identity
- JWT authentication

### Frontend

- React 19
- Vite
- React Router

### Deployment

- Azure App Service
- Azure Database for PostgreSQL Flexible Server
- Azure Static Web Apps
- GitHub Actions

## Project Structure

```text
backend/Ecommerce.Api              ASP.NET Core API
frontend/ecommerce-frontend       React frontend
.github/workflows                 Azure deployment workflows
```

## Local Development

### Prerequisites

- .NET SDK 10
- Node.js 20+
- PostgreSQL

### Backend

From the project root:

```bash
dotnet restore backend/Ecommerce.Api/Ecommerce.Api.csproj
dotnet run --project backend/Ecommerce.Api/Ecommerce.Api.csproj
```

The API runs locally on:

```text
http://localhost:5207
```

### Frontend

From `frontend/ecommerce-frontend`:

```bash
npm install
npm run dev
```

The frontend runs locally on:

```text
http://localhost:5173
```

## Environment Variables

### Backend

The backend reads production configuration from environment variables:

```text
ConnectionStrings__DefaultConnection
Jwt__Key
Jwt__Issuer
Jwt__Audience
Jwt__ExpiresInMinutes
Cors__AllowedOrigins
ASPNETCORE_URLS
```

Example values:

```text
ConnectionStrings__DefaultConnection=Host=<server>.postgres.database.azure.com;Port=5432;Database=ecommerce_db;Username=<username>;Password=<password>;Ssl Mode=Require;Trust Server Certificate=true
Jwt__Issuer=EcommercialPlatform
Jwt__Audience=Users
Jwt__ExpiresInMinutes=60
Cors__AllowedOrigins=https://gray-beach-03b527b00.2.azurestaticapps.net
ASPNETCORE_URLS=http://+:8080
```

### Frontend

```text
VITE_API_BASE_URL
```

Example:

```text
VITE_API_BASE_URL=https://ecommerce-api-bryan-ddbsfyh7c7chajba.australiaeast-01.azurewebsites.net/api
```

## Seeded Accounts

The backend seeds these roles and accounts on startup:

- Admin: `admin@bryanstore.com` / `Admin123!`
- Seller: `seller@bryanstore.com` / `Seller123!`

Buyer accounts can be created through the register page.

## Key Pages

- `/products`
- `/products/:id`
- `/cart`
- `/checkout`
- `/orders`
- `/seller/dashboard`
- `/seller/products`
- `/seller/orders`
- `/admin/dashboard`
- `/admin/users`
- `/admin/products`
- `/admin/orders`

## Deployment Notes

- Backend is deployed to Azure App Service with GitHub Actions
- Frontend is deployed to Azure Static Web Apps
- PostgreSQL schema is managed through Entity Framework Core migrations
- Health check endpoint: `/health`

## Scripts

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

### Backend

```bash
dotnet build backend/Ecommerce.Api/Ecommerce.Api.csproj
dotnet run --project backend/Ecommerce.Api/Ecommerce.Api.csproj
```
