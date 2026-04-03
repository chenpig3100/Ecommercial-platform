using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Api.DTOs;

public class CartUpdateItemDto
{
    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }
}
