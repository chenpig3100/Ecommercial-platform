using System.Security.Claims;
using Ecommerce.Api.Data;
using Ecommerce.Api.DTOs;
using Ecommerce.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/cart")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly AppDbContext _context;

    public CartController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<CartDto>> GetCart()
    {
        await SyncCartPricesAsync();
        var cart = await GetOrCreateCartAsync();
        return Ok(MapCartDto(cart));
    }

    [HttpPost("items")]
    public async Task<ActionResult<CartDto>> AddItem(CartAddItemDto dto)
    {
        var product = await _context.Products
            .AsNoTracking()
            .FirstOrDefaultAsync(product => product.Id == dto.ProductId);

        if (product is null || !product.IsActive)
        {
            return NotFound(new { message = $"Product {dto.ProductId} was not found." });
        }

        if (product.Stock < dto.Quantity)
        {
            return BadRequest(new { message = $"Only {product.Stock} item(s) are available in stock." });
        }

        var cart = await GetOrCreateCartAsync(trackForUpdate: true);
        var existingItem = cart.Items.FirstOrDefault(item => item.ProductId == dto.ProductId);

        if (existingItem is null)
        {
            cart.Items.Add(new CartItem
            {
                ProductId = product.Id,
                Quantity = dto.Quantity,
                UnitPrice = product.Price
            });
        }
        else
        {
            var newQuantity = existingItem.Quantity + dto.Quantity;
            if (product.Stock < newQuantity)
            {
                return BadRequest(new { message = $"Only {product.Stock} item(s) are available in stock." });
            }

            existingItem.Quantity = newQuantity;
            existingItem.UnitPrice = product.Price;
        }

        cart.UpdatedAtUtc = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        var refreshedCart = await GetOrCreateCartAsync();
        return Ok(MapCartDto(refreshedCart));
    }

    [HttpPut("items/{itemId:int}")]
    public async Task<ActionResult<CartDto>> UpdateItem(int itemId, CartUpdateItemDto dto)
    {
        var cart = await GetOrCreateCartAsync(trackForUpdate: true);
        var cartItem = cart.Items.FirstOrDefault(item => item.Id == itemId);

        if (cartItem is null)
        {
            return NotFound(new { message = $"Cart item {itemId} was not found." });
        }

        var product = await _context.Products
            .AsNoTracking()
            .FirstOrDefaultAsync(product => product.Id == cartItem.ProductId);

        if (product is null || !product.IsActive)
        {
            return BadRequest(new { message = "This product is no longer available." });
        }

        if (product.Stock < dto.Quantity)
        {
            return BadRequest(new { message = $"Only {product.Stock} item(s) are available in stock." });
        }

        cartItem.Quantity = dto.Quantity;
        cartItem.UnitPrice = product.Price;
        cart.UpdatedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var refreshedCart = await GetOrCreateCartAsync();
        return Ok(MapCartDto(refreshedCart));
    }

    [HttpDelete("items/{itemId:int}")]
    public async Task<ActionResult<CartDto>> RemoveItem(int itemId)
    {
        var cart = await GetOrCreateCartAsync(trackForUpdate: true);
        var cartItem = cart.Items.FirstOrDefault(item => item.Id == itemId);

        if (cartItem is null)
        {
            return NotFound(new { message = $"Cart item {itemId} was not found." });
        }

        _context.CartItems.Remove(cartItem);
        cart.UpdatedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var refreshedCart = await GetOrCreateCartAsync();
        return Ok(MapCartDto(refreshedCart));
    }

    [HttpDelete]
    public async Task<ActionResult<CartDto>> ClearCart()
    {
        var cart = await GetOrCreateCartAsync(trackForUpdate: true);

        if (cart.Items.Count > 0)
        {
            _context.CartItems.RemoveRange(cart.Items);
            cart.UpdatedAtUtc = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }

        var refreshedCart = await GetOrCreateCartAsync();
        return Ok(MapCartDto(refreshedCart));
    }

    private async Task<Cart> GetOrCreateCartAsync(bool trackForUpdate = false)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new InvalidOperationException("User identity is missing.");
        }

        var query = _context.Carts
            .Include(cart => cart.Items)
            .ThenInclude(item => item.Product)
            .Where(cart => cart.UserId == userId);

        if (!trackForUpdate)
        {
            query = query.AsNoTracking();
        }

        var cart = await query.FirstOrDefaultAsync();
        if (cart is not null)
        {
            return cart;
        }

        if (!trackForUpdate)
        {
            var createdCart = new Cart
            {
                UserId = userId
            };

            _context.Carts.Add(createdCart);
            await _context.SaveChangesAsync();

            return await GetOrCreateCartAsync();
        }

        cart = new Cart
        {
            UserId = userId
        };

        _context.Carts.Add(cart);
        await _context.SaveChangesAsync();

        return await GetOrCreateCartAsync(trackForUpdate: true);
    }

    private async Task SyncCartPricesAsync()
    {
        var cart = await GetOrCreateCartAsync(trackForUpdate: true);
        var hasChanges = false;

        foreach (var item in cart.Items)
        {
            if (item.Product is null || !item.Product.IsActive)
            {
                continue;
            }

            if (item.UnitPrice != item.Product.Price)
            {
                item.UnitPrice = item.Product.Price;
                hasChanges = true;
            }
        }

        if (!hasChanges)
        {
            return;
        }

        cart.UpdatedAtUtc = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    private static CartDto MapCartDto(Cart cart)
    {
        var items = cart.Items
            .OrderBy(item => item.Id)
            .Select(item => new CartItemDto
            {
                Id = item.Id,
                ProductId = item.ProductId,
                ProductName = item.Product?.Name ?? string.Empty,
                Category = item.Product?.Category ?? string.Empty,
                ImageUrl = item.Product?.ImageUrl,
                Quantity = item.Quantity,
                AvailableStock = item.Product?.Stock ?? 0,
                UnitPrice = item.UnitPrice,
                Subtotal = item.UnitPrice * item.Quantity
            })
            .ToList();

        return new CartDto
        {
            Id = cart.Id,
            UserId = cart.UserId,
            TotalItems = items.Sum(item => item.Quantity),
            TotalAmount = items.Sum(item => item.Subtotal),
            Items = items,
            UpdatedAtUtc = cart.UpdatedAtUtc
        };
    }
}
