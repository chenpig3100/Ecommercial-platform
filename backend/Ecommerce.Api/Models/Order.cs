using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Api.Models;

public class Order
{
    public int Id { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty;

    public ApplicationUser? User { get; set; }

    [MaxLength(120)]
    public string RecipientName { get; set; } = string.Empty;

    [MaxLength(40)]
    public string PhoneNumber { get; set; } = string.Empty;

    [MaxLength(300)]
    public string ShippingAddress { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Status { get; set; } = "Pending";

    [Precision(10, 2)]
    [Range(0, 9999999.99)]
    public decimal TotalAmount { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();

    public ICollection<SellerOrder> SellerOrders { get; set; } = new List<SellerOrder>();
}
