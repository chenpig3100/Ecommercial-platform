namespace Ecommerce.Api.DTOs;

public class AdminUserDto
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public List<string> Roles { get; set; } = [];
    public int ProductCount { get; set; }
    public int CustomerOrderCount { get; set; }
    public int SellerOrderCount { get; set; }
}
