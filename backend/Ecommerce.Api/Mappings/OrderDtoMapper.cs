using Ecommerce.Api.DTOs;
using Ecommerce.Api.Models;

namespace Ecommerce.Api.Mappings;

public static class OrderDtoMapper
{
    public static OrderDto MapOrderDto(Order order)
    {
        var items = order.Items
            .OrderBy(item => item.Id)
            .Select(MapOrderItemDto)
            .ToList();

        var sellerOrders = order.SellerOrders
            .OrderBy(sellerOrder => sellerOrder.Id)
            .Select(MapSellerOrderDto)
            .ToList();

        return new OrderDto
        {
            Id = order.Id,
            Status = order.Status,
            RecipientName = order.RecipientName,
            PhoneNumber = order.PhoneNumber,
            ShippingAddress = order.ShippingAddress,
            TotalAmount = order.TotalAmount,
            TotalItems = items.Sum(item => item.Quantity),
            CreatedAtUtc = order.CreatedAtUtc,
            Items = items,
            SellerOrders = sellerOrders
        };
    }

    public static SellerOrderDto MapSellerOrderDto(SellerOrder sellerOrder)
    {
        var items = sellerOrder.Items
            .OrderBy(item => item.Id)
            .Select(MapOrderItemDto)
            .ToList();

        return new SellerOrderDto
        {
            Id = sellerOrder.Id,
            OrderId = sellerOrder.OrderId,
            Status = sellerOrder.Status,
            RecipientName = sellerOrder.Order?.RecipientName ?? string.Empty,
            PhoneNumber = sellerOrder.Order?.PhoneNumber ?? string.Empty,
            ShippingAddress = sellerOrder.Order?.ShippingAddress ?? string.Empty,
            TotalAmount = sellerOrder.TotalAmount,
            TotalItems = items.Sum(item => item.Quantity),
            CreatedAtUtc = sellerOrder.CreatedAtUtc,
            Items = items
        };
    }

    private static OrderItemDto MapOrderItemDto(OrderItem item)
    {
        return new OrderItemDto
        {
            Id = item.Id,
            ProductId = item.ProductId,
            ProductName = item.ProductName,
            Category = item.Category,
            ImageUrl = item.ImageUrl,
            SellerEmail = item.SellerEmail,
            Quantity = item.Quantity,
            UnitPrice = item.UnitPrice,
            Subtotal = item.Subtotal
        };
    }
}
