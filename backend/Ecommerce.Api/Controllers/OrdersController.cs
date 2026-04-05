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
[Route("api/orders")]
[Authorize(Roles = IdentitySeeder.BuyerRole)]
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
            return this.ApiUnauthorized("User identity is missing.");
        }

        var cart = await _context.Carts
            .Include(cart => cart.Items)
            .ThenInclude(item => item.Product)
            .ThenInclude(product => product!.Seller)
            .FirstOrDefaultAsync(cart => cart.UserId == userId);

        if (cart is null || cart.Items.Count == 0)
        {
            return this.ApiBadRequest("Your cart is empty.");
        }

        var hasPriceChanged = false;

        foreach (var cartItem in cart.Items)
        {
            if (cartItem.Product is null || !cartItem.Product.IsActive)
            {
                return this.ApiBadRequest("One or more products are no longer available.");
            }

            if (cartItem.Product.Stock < cartItem.Quantity)
            {
                return this.ApiBadRequest(
                    "Some items are no longer available in the requested quantity. Please review your cart before checkout.");
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

            return Conflict(
                ApiErrorResponseFactory.Create(
                    HttpContext,
                    StatusCodes.Status409Conflict,
                    "Product price has changed. Please review your cart before checkout."));
        }

        using var transaction = await _context.Database.BeginTransactionAsync();

        var sellerGroups = cart.Items
            .GroupBy(item => item.Product!.SellerId)
            .ToList();

        if (sellerGroups.Any(group => string.IsNullOrWhiteSpace(group.Key)))
        {
            return this.ApiBadRequest(
                "One or more products are missing seller ownership and cannot be checked out.");
        }

        var order = new Order
        {
            UserId = userId,
            RecipientName = dto.RecipientName.Trim(),
            PhoneNumber = dto.PhoneNumber.Trim(),
            ShippingAddress = dto.ShippingAddress.Trim(),
            Status = OrderStatus.Pending,
            TotalAmount = cart.Items.Sum(item => item.UnitPrice * item.Quantity)
        };

        foreach (var sellerGroup in sellerGroups)
        {
            var sellerEmail = sellerGroup.First().Product?.Seller?.Email;
            var sellerOrder = new SellerOrder
            {
                SellerId = sellerGroup.Key!,
                Status = OrderStatus.Pending,
                TotalAmount = sellerGroup.Sum(item => item.UnitPrice * item.Quantity),
                Items = sellerGroup.Select(item => new OrderItem
                {
                    SellerId = sellerGroup.Key!,
                    SellerEmail = sellerEmail,
                    ProductId = item.ProductId,
                    ProductName = item.Product!.Name,
                    Category = item.Product.Category,
                    ImageUrl = item.Product.ImageUrl,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    Subtotal = item.UnitPrice * item.Quantity
                }).ToList()
            };

            order.SellerOrders.Add(sellerOrder);
        }

        order.Items = order.SellerOrders
            .SelectMany(sellerOrder => sellerOrder.Items)
            .ToList();

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
            .Include(order => order.SellerOrders)
            .ThenInclude(sellerOrder => sellerOrder.Items)
            .FirstAsync(saved => saved.Id == order.Id && saved.UserId == userId);

        return CreatedAtAction(nameof(GetOrderById), new { id = savedOrder.Id }, OrderDtoMapper.MapOrderDto(savedOrder));
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetMyOrders()
    {
        var userId = GetCurrentUserId();
        if (string.IsNullOrWhiteSpace(userId))
        {
            return this.ApiUnauthorized("User identity is missing.");
        }

        var orders = await _context.Orders
            .AsNoTracking()
            .Where(order => order.UserId == userId)
            .Include(order => order.Items)
            .Include(order => order.SellerOrders)
            .ThenInclude(sellerOrder => sellerOrder.Items)
            .OrderByDescending(order => order.CreatedAtUtc)
            .ToListAsync();

        return Ok(orders.Select(OrderDtoMapper.MapOrderDto));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderDto>> GetOrderById(int id)
    {
        var userId = GetCurrentUserId();
        if (string.IsNullOrWhiteSpace(userId))
        {
            return this.ApiUnauthorized("User identity is missing.");
        }

        var order = await _context.Orders
            .AsNoTracking()
            .Where(order => order.UserId == userId && order.Id == id)
            .Include(order => order.Items)
            .Include(order => order.SellerOrders)
            .ThenInclude(sellerOrder => sellerOrder.Items)
            .FirstOrDefaultAsync();

        if (order is null)
        {
            return this.ApiNotFound($"Order {id} was not found.");
        }

        return Ok(OrderDtoMapper.MapOrderDto(order));
    }

    private string? GetCurrentUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier);
    }
}
