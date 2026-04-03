using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Api.Models;

public class CartItem
{
    public int Id { get; set; }

    public int CartId { get; set; }

    public Cart? Cart { get; set; }

    public int ProductId { get; set; }

    public Product? Product { get; set; }

    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }

    [Precision(10, 2)]
    [Range(0, 9999999.99)]
    public decimal UnitPrice { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
