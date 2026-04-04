namespace Ecommerce.Api.Models;

public static class OrderStatus
{
    public const string Pending = "Pending";
    public const string Processing = "Processing";
    public const string Shipped = "Shipped";
    public const string Delivered = "Delivered";
    public const string Cancelled = "Cancelled";

    private static readonly HashSet<string> ValidStatuses = new(StringComparer.OrdinalIgnoreCase)
    {
        Pending,
        Processing,
        Shipped,
        Delivered,
        Cancelled
    };

    public static bool IsValid(string? status)
    {
        return !string.IsNullOrWhiteSpace(status) && ValidStatuses.Contains(status.Trim());
    }

    public static string Normalize(string status)
    {
        var trimmedStatus = status.Trim();

        if (trimmedStatus.Equals(Pending, StringComparison.OrdinalIgnoreCase))
        {
            return Pending;
        }

        if (trimmedStatus.Equals(Processing, StringComparison.OrdinalIgnoreCase))
        {
            return Processing;
        }

        if (trimmedStatus.Equals(Shipped, StringComparison.OrdinalIgnoreCase))
        {
            return Shipped;
        }

        if (trimmedStatus.Equals(Delivered, StringComparison.OrdinalIgnoreCase))
        {
            return Delivered;
        }

        if (trimmedStatus.Equals(Cancelled, StringComparison.OrdinalIgnoreCase))
        {
            return Cancelled;
        }

        throw new ArgumentException("Invalid order status.", nameof(status));
    }

    public static bool CanTransition(string currentStatus, string nextStatus)
    {
        var current = Normalize(currentStatus);
        var next = Normalize(nextStatus);

        if (current == next)
        {
            return true;
        }

        return current switch
        {
            Pending => next is Processing or Cancelled,
            Processing => next == Shipped,
            Shipped => next == Delivered,
            Delivered => false,
            Cancelled => false,
            _ => false
        };
    }
}
