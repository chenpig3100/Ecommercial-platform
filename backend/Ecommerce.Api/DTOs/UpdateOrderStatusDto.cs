using System.ComponentModel.DataAnnotations;
using Ecommerce.Api.Validation;

namespace Ecommerce.Api.DTOs;

public class UpdateOrderStatusDto
{
    [Required]
    [AllowedOrderStatus]
    public string Status { get; set; } = string.Empty;
}
