using Ecommerce.Api.Validation;

namespace Ecommerce.Api.DTOs;

public class SellerOrderQueryDto
{
    [AllowedOrderStatus(AllowEmpty = true)]
    public string? Status { get; set; }
}
