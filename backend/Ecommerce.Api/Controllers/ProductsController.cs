using Ecommerce.Api.Data;
using Ecommerce.Api.DTOs;
using Ecommerce.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts([FromQuery] ProductQueryDto query)
    {
        var productsQuery = ApplyProductFilters(
            _context.Products
                .AsNoTracking()
                .Where(product => product.IsActive),
            query);

        var products = await productsQuery
            .OrderByDescending(product => product.CreatedAtUtc)
            .ThenBy(product => product.Name)
            .ToListAsync();

        return Ok(products);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetProductById(int id)
    {
        var product = await _context.Products
            .AsNoTracking()
            .FirstOrDefaultAsync(product => product.Id == id && product.IsActive);

        if (product is null)
        {
            return NotFound(new { message = $"Product {id} was not found." });
        }

        return Ok(product);
    }

    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<string>>> GetCategories()
    {
        var categories = await _context.Products
            .AsNoTracking()
            .Where(product => product.IsActive)
            .Select(product => product.Category)
            .Where(category => !string.IsNullOrWhiteSpace(category))
            .Distinct()
            .OrderBy(category => category)
            .ToListAsync();

        return Ok(categories);
    }

    [Authorize(Roles = $"{IdentitySeeder.SellerRole},{IdentitySeeder.AdminRole}")]
    [HttpGet("manage")]
    public async Task<ActionResult<IEnumerable<Product>>> GetManagedProducts([FromQuery] ProductQueryDto query)
    {
        var userId = GetCurrentUserId();
        if (userId is null)
        {
            return Unauthorized(new { message = "User identity is missing." });
        }

        var productsQuery = ApplyProductFilters(
            _context.Products.AsNoTracking(),
            query);

        if (!IsAdmin())
        {
            productsQuery = productsQuery.Where(product => product.SellerId == userId);
        }

        var products = await productsQuery
            .OrderByDescending(product => product.CreatedAtUtc)
            .ThenBy(product => product.Name)
            .ToListAsync();

        return Ok(products);
    }

    [Authorize(Roles = $"{IdentitySeeder.SellerRole},{IdentitySeeder.AdminRole}")]
    [HttpGet("manage/{id:int}")]
    public async Task<ActionResult<Product>> GetManagedProductById(int id)
    {
        var product = await _context.Products.AsNoTracking().FirstOrDefaultAsync(product => product.Id == id);

        if (product is null)
        {
            return NotFound(new { message = $"Product {id} was not found." });
        }

        if (!CanManageProduct(product))
        {
            return Forbid();
        }

        return Ok(product);
    }

    [Authorize(Roles = $"{IdentitySeeder.SellerRole},{IdentitySeeder.AdminRole}")]
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(ProductCreateUpdateDto dto)
    {
        var userId = GetCurrentUserId();
        if (userId is null)
        {
            return Unauthorized(new { message = "User identity is missing." });
        }

        var product = new Product
        {
            Name = dto.Name.Trim(),
            Description = dto.Description.Trim(),
            Category = dto.Category.Trim(),
            Price = dto.Price,
            ImageUrl = string.IsNullOrWhiteSpace(dto.ImageUrl) ? null : dto.ImageUrl.Trim(),
            Stock = dto.Stock,
            IsActive = dto.IsActive,
            SellerId = userId
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetManagedProductById), new { id = product.Id }, product);
    }

    [Authorize(Roles = $"{IdentitySeeder.SellerRole},{IdentitySeeder.AdminRole}")]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<Product>> UpdateProduct(int id, ProductCreateUpdateDto dto)
    {
        var product = await _context.Products.FirstOrDefaultAsync(product => product.Id == id);

        if (product is null)
        {
            return NotFound(new { message = $"Product {id} was not found." });
        }

        if (!CanManageProduct(product))
        {
            return Forbid();
        }

        product.Name = dto.Name.Trim();
        product.Description = dto.Description.Trim();
        product.Category = dto.Category.Trim();
        product.Price = dto.Price;
        product.ImageUrl = string.IsNullOrWhiteSpace(dto.ImageUrl) ? null : dto.ImageUrl.Trim();
        product.Stock = dto.Stock;
        product.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();
        return Ok(product);
    }

    [Authorize(Roles = $"{IdentitySeeder.SellerRole},{IdentitySeeder.AdminRole}")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FirstOrDefaultAsync(product => product.Id == id);

        if (product is null)
        {
            return NotFound(new { message = $"Product {id} was not found." });
        }

        if (!CanManageProduct(product))
        {
            return Forbid();
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private IQueryable<Product> ApplyProductFilters(IQueryable<Product> productsQuery, ProductQueryDto query)
    {
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim().ToLower();
            productsQuery = productsQuery.Where(product =>
                product.Name.ToLower().Contains(search) ||
                product.Description.ToLower().Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(query.Category))
        {
            var category = query.Category.Trim().ToLower();
            productsQuery = productsQuery.Where(product => product.Category.ToLower() == category);
        }

        return productsQuery;
    }

    private bool CanManageProduct(Product product)
    {
        return IsAdmin() || product.SellerId == GetCurrentUserId();
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
