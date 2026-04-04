using System.ComponentModel.DataAnnotations;
using Ecommerce.Api.Models;

namespace Ecommerce.Api.Validation;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter)]
public sealed class AllowedOrderStatusAttribute : ValidationAttribute
{
    public bool AllowEmpty { get; init; }

    public AllowedOrderStatusAttribute()
    {
        ErrorMessage = "The order status value is invalid.";
    }

    public override bool IsValid(object? value)
    {
        if (value is null)
        {
            return AllowEmpty;
        }

        if (value is not string status)
        {
            return false;
        }

        if (string.IsNullOrWhiteSpace(status))
        {
            return AllowEmpty;
        }

        return OrderStatus.IsValid(status);
    }
}
