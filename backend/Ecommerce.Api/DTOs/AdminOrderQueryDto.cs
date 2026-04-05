using Ecommerce.Api.Validation;

namespace Ecommerce.Api.DTOs;

public class AdminOrderQueryDto
{
    [AllowedOrderStatus(AllowEmpty = true)]
    public string? Status { get; set; }

    public string? Search { get; set; }
}
