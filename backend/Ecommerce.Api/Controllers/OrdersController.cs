using System.Security.Claims;
using Ecommerce.Api.Data;
using Ecommerce.Api.DTOs;
using Ecommerce.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrdersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("checkout")]
    public async Task<ActionResult<OrderDto>> Checkout(CheckoutCreateDto dto)
    {
        var userId = GetCurrentUserId();
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(new { message = "User identity is missing." });
        }

        var cart = await _context.Carts
            .Include(cart => cart.Items)
            .ThenInclude(item => item.Product)
            .FirstOrDefaultAsync(cart => cart.UserId == userId);

        if (cart is null || cart.Items.Count == 0)
        {
            return BadRequest(new { message = "Your cart is empty." });
        }

        var hasPriceChanged = false;

        foreach (var cartItem in cart.Items)
        {
            if (cartItem.Product is null || !cartItem.Product.IsActive)
            {
                return BadRequest(new { message = "One or more products are no longer available." });
            }

            if (cartItem.Product.Stock < cartItem.Quantity)
            {
                return BadRequest(new
                {
                    message = "Some items are no longer available in the requested quantity. Please review your cart before checkout."
                });
            }

            if (cartItem.UnitPrice != cartItem.Product.Price)
            {
                cartItem.UnitPrice = cartItem.Product.Price;
                hasPriceChanged = true;
            }
        }

        if (hasPriceChanged)
        {
            cart.UpdatedAtUtc = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Conflict(new
            {
                message = "Product price has changed. Please review your cart before checkout."
            });
        }

        using var transaction = await _context.Database.BeginTransactionAsync();

        var order = new Order
        {
            UserId = userId,
            RecipientName = dto.RecipientName.Trim(),
            PhoneNumber = dto.PhoneNumber.Trim(),
            ShippingAddress = dto.ShippingAddress.Trim(),
            Status = "Pending",
            TotalAmount = cart.Items.Sum(item => item.UnitPrice * item.Quantity),
            Items = cart.Items.Select(item => new OrderItem
            {
                ProductId = item.ProductId,
                ProductName = item.Product!.Name,
                Category = item.Product.Category,
                ImageUrl = item.Product.ImageUrl,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                Subtotal = item.UnitPrice * item.Quantity
            }).ToList()
        };

        _context.Orders.Add(order);

        foreach (var cartItem in cart.Items)
        {
            cartItem.Product!.Stock -= cartItem.Quantity;
        }

        _context.CartItems.RemoveRange(cart.Items);
        cart.UpdatedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        var savedOrder = await _context.Orders
            .AsNoTracking()
            .Include(order => order.Items)
            .FirstAsync(saved => saved.Id == order.Id && saved.UserId == userId);

        return CreatedAtAction(nameof(GetOrderById), new { id = savedOrder.Id }, MapOrderDto(savedOrder));
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetMyOrders()
    {
        var userId = GetCurrentUserId();
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(new { message = "User identity is missing." });
        }

        var orders = await _context.Orders
            .AsNoTracking()
            .Where(order => order.UserId == userId)
            .Include(order => order.Items)
            .OrderByDescending(order => order.CreatedAtUtc)
            .ToListAsync();

        return Ok(orders.Select(MapOrderDto));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderDto>> GetOrderById(int id)
    {
        var userId = GetCurrentUserId();
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(new { message = "User identity is missing." });
        }

        var order = await _context.Orders
            .AsNoTracking()
            .Where(order => order.UserId == userId && order.Id == id)
            .Include(order => order.Items)
            .FirstOrDefaultAsync();

        if (order is null)
        {
            return NotFound(new { message = $"Order {id} was not found." });
        }

        return Ok(MapOrderDto(order));
    }

    private string? GetCurrentUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier);
    }

    private static OrderDto MapOrderDto(Order order)
    {
        var items = order.Items
            .OrderBy(item => item.Id)
            .Select(item => new OrderItemDto
            {
                Id = item.Id,
                ProductId = item.ProductId,
                ProductName = item.ProductName,
                Category = item.Category,
                ImageUrl = item.ImageUrl,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                Subtotal = item.Subtotal
            })
            .ToList();

        return new OrderDto
        {
            Id = order.Id,
            Status = order.Status,
            RecipientName = order.RecipientName,
            PhoneNumber = order.PhoneNumber,
            ShippingAddress = order.ShippingAddress,
            TotalAmount = order.TotalAmount,
            TotalItems = items.Sum(item => item.Quantity),
            CreatedAtUtc = order.CreatedAtUtc,
            Items = items
        };
    }
}
