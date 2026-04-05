using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Api.DTOs;

public class CheckoutCreateDto
{
    [Required]
    [MinLength(2)]
    [MaxLength(120)]
    public string RecipientName { get; set; } = string.Empty;

    [Required]
    [Phone]
    [MinLength(8)]
    [MaxLength(40)]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    [MinLength(10)]
    [MaxLength(300)]
    public string ShippingAddress { get; set; } = string.Empty;
}
