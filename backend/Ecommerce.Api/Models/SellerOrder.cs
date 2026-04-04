using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Api.Models;

public class SellerOrder
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public Order? Order { get; set; }

    [Required]
    public string SellerId { get; set; } = string.Empty;

    public ApplicationUser? Seller { get; set; }

    [MaxLength(50)]
    public string Status { get; set; } = OrderStatus.Pending;

    [Precision(10, 2)]
    [Range(0, 9999999.99)]
    public decimal TotalAmount { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
