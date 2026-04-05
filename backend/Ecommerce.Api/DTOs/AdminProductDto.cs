namespace Ecommerce.Api.DTOs;

public class AdminProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public int Stock { get; set; }
    public bool IsActive { get; set; }
    public string? SellerId { get; set; }
    public string? SellerEmail { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}
