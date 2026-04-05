namespace Ecommerce.Api.DTOs;

public class AdminProductQueryDto
{
    public string? Search { get; set; }
    public string? Category { get; set; }
    public string? SellerEmail { get; set; }
    public bool? IsActive { get; set; }
}
