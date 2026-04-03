using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Api.DTOs;

public class CheckoutCreateDto
{
    [Required]
    [MaxLength(120)]
    public string RecipientName { get; set; } = string.Empty;

    [Required]
    [MaxLength(40)]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    [MaxLength(300)]
    public string ShippingAddress { get; set; } = string.Empty;
}
