namespace Ecommerce.Api.DTOs;

public class SellerOrderDto
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public string Status { get; set; } = string.Empty;

    public string RecipientName { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public string ShippingAddress { get; set; } = string.Empty;

    public decimal TotalAmount { get; set; }

    public int TotalItems { get; set; }

    public DateTime CreatedAtUtc { get; set; }

    public List<OrderItemDto> Items { get; set; } = [];
}
