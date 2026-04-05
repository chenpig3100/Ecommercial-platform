using System.Security.Claims;
using Ecommerce.Api.Data;
using Ecommerce.Api.DTOs;
using Ecommerce.Api.Infrastructure.Errors;
using Ecommerce.Api.Mappings;
using Ecommerce.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/seller/orders")]
[Authorize(Roles = $"{IdentitySeeder.SellerRole},{IdentitySeeder.AdminRole}")]
public class SellerOrdersController : ControllerBase
{
    private readonly AppDbContext _context;

    public SellerOrdersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SellerOrderDto>>> GetSellerOrders([FromQuery] SellerOrderQueryDto query)
    {
        var sellerId = GetCurrentUserId();
        if (string.IsNullOrWhiteSpace(sellerId))
        {
            return this.ApiUnauthorized("User identity is missing.");
        }

        var sellerOrdersQuery = BuildAccessibleSellerOrdersQuery(sellerId);

        if (!string.IsNullOrWhiteSpace(query.Status))
        {
            var normalizedStatus = OrderStatus.Normalize(query.Status);
            sellerOrdersQuery = sellerOrdersQuery.Where(order => order.Status == normalizedStatus);
        }

        var sellerOrders = await sellerOrdersQuery
            .OrderByDescending(order => order.CreatedAtUtc)
            .ToListAsync();

        return Ok(sellerOrders.Select(OrderDtoMapper.MapSellerOrderDto));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<SellerOrderDto>> GetSellerOrderById(int id)
    {
        var sellerId = GetCurrentUserId();
        if (string.IsNullOrWhiteSpace(sellerId))
        {
            return this.ApiUnauthorized("User identity is missing.");
        }

        var sellerOrder = await BuildAccessibleSellerOrdersQuery(sellerId)
            .FirstOrDefaultAsync(order => order.Id == id);

        if (sellerOrder is null)
        {
            return this.ApiNotFound($"Seller order {id} was not found.");
        }

        return Ok(OrderDtoMapper.MapSellerOrderDto(sellerOrder));
    }

    [HttpPut("{id:int}/status")]
    public async Task<ActionResult<SellerOrderDto>> UpdateSellerOrderStatus(int id, UpdateOrderStatusDto dto)
    {
        var sellerId = GetCurrentUserId();
        if (string.IsNullOrWhiteSpace(sellerId))
        {
            return this.ApiUnauthorized("User identity is missing.");
        }

        var sellerOrder = await _context.SellerOrders
            .Include(savedSellerOrder => savedSellerOrder.Order)
            .ThenInclude(order => order!.SellerOrders)
            .Include(savedSellerOrder => savedSellerOrder.Items)
            .FirstOrDefaultAsync(savedSellerOrder => savedSellerOrder.Id == id);

        if (sellerOrder is null)
        {
            return this.ApiNotFound($"Seller order {id} was not found.");
        }

        if (!CanAccessSellerOrder(sellerOrder, sellerId))
        {
            return this.ApiForbidden("You do not have permission to access this seller order.");
        }

        var normalizedStatus = OrderStatus.Normalize(dto.Status);
        if (!OrderStatus.CanTransition(sellerOrder.Status, normalizedStatus))
        {
            return this.ApiBadRequest(
                $"Order status cannot change from {sellerOrder.Status} to {normalizedStatus}.");
        }

        sellerOrder.Status = normalizedStatus;
        if (sellerOrder.Order is not null)
        {
            sellerOrder.Order.Status = ResolveParentOrderStatus(sellerOrder.Order.SellerOrders);
        }

        await _context.SaveChangesAsync();

        return Ok(OrderDtoMapper.MapSellerOrderDto(sellerOrder));
    }

    private IQueryable<SellerOrder> BuildAccessibleSellerOrdersQuery(string sellerId)
    {
        var query = _context.SellerOrders
            .AsNoTracking()
            .Include(order => order.Order)
            .Include(order => order.Items)
            .AsQueryable();

        if (!IsAdmin())
        {
            query = query.Where(order => order.SellerId == sellerId);
        }

        return query;
    }

    private bool CanAccessSellerOrder(SellerOrder sellerOrder, string sellerId)
    {
        return IsAdmin() || sellerOrder.SellerId == sellerId;
    }

    private static string ResolveParentOrderStatus(IEnumerable<SellerOrder> sellerOrders)
    {
        var statuses = sellerOrders
            .Select(order => OrderStatus.Normalize(order.Status))
            .ToList();

        if (statuses.Count == 0 || statuses.All(status => status == OrderStatus.Pending))
        {
            return OrderStatus.Pending;
        }

        if (statuses.All(status => status == OrderStatus.Cancelled))
        {
            return OrderStatus.Cancelled;
        }

        if (statuses.All(status => status == OrderStatus.Delivered))
        {
            return OrderStatus.Delivered;
        }

        if (statuses.All(status => status is OrderStatus.Shipped or OrderStatus.Delivered))
        {
            return OrderStatus.Shipped;
        }

        return OrderStatus.Processing;
    }

    private bool IsAdmin()
    {
        return User.IsInRole(IdentitySeeder.AdminRole);
    }

    private string? GetCurrentUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier);
    }
}
