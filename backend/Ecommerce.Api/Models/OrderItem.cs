using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Api.Models;

public class OrderItem
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public Order? Order { get; set; }

    public int ProductId { get; set; }

    public Product? Product { get; set; }

    [MaxLength(120)]
    public string ProductName { get; set; } = string.Empty;

    [MaxLength(80)]
    public string Category { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }

    [Precision(10, 2)]
    [Range(0, 9999999.99)]
    public decimal UnitPrice { get; set; }

    [Precision(10, 2)]
    [Range(0, 9999999.99)]
    public decimal Subtotal { get; set; }
}
