using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Api.DTOs;

public class ProductCreateUpdateDto
{
    [Required]
    [MinLength(2)]
    [MaxLength(120)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MinLength(10)]
    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [MinLength(2)]
    [MaxLength(80)]
    public string Category { get; set; } = string.Empty;

    [Range(0, 9999999.99)]
    public decimal Price { get; set; }

    [Url]
    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    [Range(0, int.MaxValue)]
    public int Stock { get; set; }

    public bool IsActive { get; set; } = true;
}
