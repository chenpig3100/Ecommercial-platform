namespace Ecommerce.Api.DTOs;

public class CartDto
{
    public int Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public int TotalItems { get; set; }

    public decimal TotalAmount { get; set; }

    public List<CartItemDto> Items { get; set; } = [];

    public DateTime UpdatedAtUtc { get; set; }
}
