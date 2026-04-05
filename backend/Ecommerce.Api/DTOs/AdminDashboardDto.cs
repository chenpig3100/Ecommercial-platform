namespace Ecommerce.Api.DTOs;

public class AdminDashboardDto
{
    public int TotalUsers { get; set; }
    public int BuyerCount { get; set; }
    public int SellerCount { get; set; }
    public int AdminCount { get; set; }
    public int TotalProducts { get; set; }
    public int ActiveProducts { get; set; }
    public int TotalOrders { get; set; }
    public int PendingSellerOrders { get; set; }
    public decimal GrossRevenue { get; set; }
}
