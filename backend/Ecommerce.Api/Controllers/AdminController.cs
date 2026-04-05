using Ecommerce.Api.Data;
using Ecommerce.Api.DTOs;
using Ecommerce.Api.Infrastructure.Errors;
using Ecommerce.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = IdentitySeeder.AdminRole)]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public AdminController(AppDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<AdminDashboardDto>> GetDashboard()
    {
        var roleAssignments = await _context.UserRoles
            .Join(
                _context.Roles,
                userRole => userRole.RoleId,
                role => role.Id,
                (userRole, role) => new { userRole.UserId, RoleName = role.Name ?? string.Empty })
            .ToListAsync();

        var summary = new AdminDashboardDto
        {
            TotalUsers = await _context.Users.CountAsync(),
            BuyerCount = roleAssignments.Count(entry => entry.RoleName == IdentitySeeder.BuyerRole),
            SellerCount = roleAssignments.Count(entry => entry.RoleName == IdentitySeeder.SellerRole),
            AdminCount = roleAssignments.Count(entry => entry.RoleName == IdentitySeeder.AdminRole),
            TotalProducts = await _context.Products.CountAsync(),
            ActiveProducts = await _context.Products.CountAsync(product => product.IsActive),
            TotalOrders = await _context.Orders.CountAsync(),
            PendingSellerOrders = await _context.SellerOrders.CountAsync(order => order.Status == OrderStatus.Pending),
            GrossRevenue = await _context.Orders.SumAsync(order => (decimal?)order.TotalAmount) ?? 0m
        };

        return Ok(summary);
    }

    [HttpGet("users")]
    public async Task<ActionResult<IEnumerable<AdminUserDto>>> GetUsers([FromQuery] AdminUserQueryDto query)
    {
        var users = await _context.Users
            .AsNoTracking()
            .OrderBy(user => user.Email)
            .ToListAsync();

        var rolesByUser = await _context.UserRoles
            .Join(
                _context.Roles,
                userRole => userRole.RoleId,
                role => role.Id,
                (userRole, role) => new { userRole.UserId, RoleName = role.Name ?? string.Empty })
            .GroupBy(entry => entry.UserId)
            .ToDictionaryAsync(
                group => group.Key,
                group => group
                    .Select(entry => entry.RoleName)
                    .Distinct()
                    .OrderBy(roleName => roleName)
                    .ToList());

        var productCounts = await _context.Products
            .AsNoTracking()
            .Where(product => product.SellerId != null)
            .GroupBy(product => product.SellerId!)
            .Select(group => new { UserId = group.Key, Count = group.Count() })
            .ToDictionaryAsync(entry => entry.UserId, entry => entry.Count);

        var orderCounts = await _context.Orders
            .AsNoTracking()
            .GroupBy(order => order.UserId)
            .Select(group => new { UserId = group.Key, Count = group.Count() })
            .ToDictionaryAsync(entry => entry.UserId, entry => entry.Count);

        var sellerOrderCounts = await _context.SellerOrders
            .AsNoTracking()
            .GroupBy(order => order.SellerId)
            .Select(group => new { UserId = group.Key, Count = group.Count() })
            .ToDictionaryAsync(entry => entry.UserId, entry => entry.Count);

        var result = users.Select(user => new AdminUserDto
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                Roles = rolesByUser.TryGetValue(user.Id, out var roles) ? roles : [],
                ProductCount = productCounts.TryGetValue(user.Id, out var productCount) ? productCount : 0,
                CustomerOrderCount = orderCounts.TryGetValue(user.Id, out var customerOrderCount) ? customerOrderCount : 0,
                SellerOrderCount = sellerOrderCounts.TryGetValue(user.Id, out var sellerOrderCount) ? sellerOrderCount : 0
            })
            .AsEnumerable();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim().ToLowerInvariant();
            result = result.Where(user =>
                user.Email.ToLowerInvariant().Contains(search) ||
                user.Roles.Any(role => role.ToLowerInvariant().Contains(search)));
        }

        if (!string.IsNullOrWhiteSpace(query.Role))
        {
            result = result.Where(user =>
                user.Roles.Any(role => role.Equals(query.Role.Trim(), StringComparison.OrdinalIgnoreCase)));
        }

        return Ok(result.ToList());
    }

    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(currentUserId))
        {
            return this.ApiUnauthorized("User identity is missing.");
        }

        if (string.Equals(currentUserId, id, StringComparison.Ordinal))
        {
            return this.ApiBadRequest("You cannot delete your own admin account.");
        }

        var user = await _userManager.FindByIdAsync(id);
        if (user is null)
        {
            return this.ApiNotFound("The user account was not found.");
        }

        var hasProducts = await _context.Products.AnyAsync(product => product.SellerId == id);
        var hasOrders = await _context.Orders.AnyAsync(order => order.UserId == id);
        var hasSellerOrders = await _context.SellerOrders.AnyAsync(order => order.SellerId == id);
        var hasOrderItems = await _context.OrderItems.AnyAsync(item => item.SellerId == id);

        if (hasProducts || hasOrders || hasSellerOrders || hasOrderItems)
        {
            return this.ApiBadRequest(
                "This account cannot be deleted because it is still referenced by products or order history.");
        }

        var deleteResult = await _userManager.DeleteAsync(user);
        if (!deleteResult.Succeeded)
        {
            return this.ApiBadRequest(
                "Unable to delete the account.",
                new Dictionary<string, string[]>
                {
                    ["user"] = deleteResult.Errors.Select(error => error.Description).ToArray()
                });
        }

        return NoContent();
    }

    [HttpGet("products")]
    public async Task<ActionResult<IEnumerable<AdminProductDto>>> GetProducts([FromQuery] AdminProductQueryDto query)
    {
        var productsQuery = _context.Products
            .AsNoTracking()
            .Include(product => product.Seller)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim().ToLowerInvariant();
            productsQuery = productsQuery.Where(product =>
                product.Name.ToLower().Contains(search) ||
                product.Description.ToLower().Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(query.Category))
        {
            var category = query.Category.Trim().ToLowerInvariant();
            productsQuery = productsQuery.Where(product => product.Category.ToLower() == category);
        }

        if (!string.IsNullOrWhiteSpace(query.SellerEmail))
        {
            var sellerEmail = query.SellerEmail.Trim().ToLowerInvariant();
            productsQuery = productsQuery.Where(product =>
                product.Seller != null &&
                product.Seller.Email != null &&
                product.Seller.Email.ToLower().Contains(sellerEmail));
        }

        if (query.IsActive.HasValue)
        {
            productsQuery = productsQuery.Where(product => product.IsActive == query.IsActive.Value);
        }

        var products = await productsQuery
            .OrderByDescending(product => product.CreatedAtUtc)
            .ThenBy(product => product.Name)
            .Select(product => new AdminProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Category = product.Category,
                Price = product.Price,
                ImageUrl = product.ImageUrl,
                Stock = product.Stock,
                IsActive = product.IsActive,
                SellerId = product.SellerId,
                SellerEmail = product.Seller != null ? product.Seller.Email : null,
                CreatedAtUtc = product.CreatedAtUtc
            })
            .ToListAsync();

        return Ok(products);
    }

    [HttpGet("orders")]
    public async Task<ActionResult<IEnumerable<AdminOrderDto>>> GetOrders([FromQuery] AdminOrderQueryDto query)
    {
        var ordersQuery = _context.SellerOrders
            .AsNoTracking()
            .Include(order => order.Order)
            .ThenInclude(order => order!.User)
            .Include(order => order.Seller)
            .Include(order => order.Items)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Status))
        {
            var normalizedStatus = OrderStatus.Normalize(query.Status);
            ordersQuery = ordersQuery.Where(order => order.Status == normalizedStatus);
        }

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim().ToLowerInvariant();
            ordersQuery = ordersQuery.Where(order =>
                (order.Seller != null && (order.Seller.Email ?? string.Empty).ToLower().Contains(search)) ||
                (order.Order != null && order.Order.User != null && (order.Order.User.Email ?? string.Empty).ToLower().Contains(search)) ||
                (order.Order != null && order.Order.RecipientName.ToLower().Contains(search)) ||
                order.Id.ToString().Contains(search) ||
                order.OrderId.ToString().Contains(search));
        }

        var orders = await ordersQuery
            .OrderByDescending(order => order.CreatedAtUtc)
            .Select(order => new AdminOrderDto
            {
                Id = order.Id,
                OrderId = order.OrderId,
                Status = order.Status,
                RecipientName = order.Order != null ? order.Order.RecipientName : string.Empty,
                BuyerEmail = order.Order != null && order.Order.User != null ? order.Order.User.Email ?? string.Empty : string.Empty,
                SellerEmail = order.Seller != null ? order.Seller.Email ?? string.Empty : string.Empty,
                TotalAmount = order.TotalAmount,
                TotalItems = order.Items.Sum(item => item.Quantity),
                CreatedAtUtc = order.CreatedAtUtc
            })
            .ToListAsync();

        return Ok(orders);
    }
}
