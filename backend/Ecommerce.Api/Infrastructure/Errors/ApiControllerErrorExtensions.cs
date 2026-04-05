using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Infrastructure.Errors;

public static class ApiControllerErrorExtensions
{
    public static ObjectResult ApiError(
        this ControllerBase controller,
        int status,
        string message,
        IReadOnlyDictionary<string, string[]>? errors = null)
    {
        return controller.StatusCode(
            status,
            ApiErrorResponseFactory.Create(controller.HttpContext, status, message, errors));
    }

    public static BadRequestObjectResult ApiBadRequest(
        this ControllerBase controller,
        string message,
        IReadOnlyDictionary<string, string[]>? errors = null)
    {
        return controller.BadRequest(
            ApiErrorResponseFactory.Create(
                controller.HttpContext,
                StatusCodes.Status400BadRequest,
                message,
                errors));
    }

    public static UnauthorizedObjectResult ApiUnauthorized(this ControllerBase controller, string message)
    {
        return controller.Unauthorized(
            ApiErrorResponseFactory.Create(
                controller.HttpContext,
                StatusCodes.Status401Unauthorized,
                message));
    }

    public static NotFoundObjectResult ApiNotFound(this ControllerBase controller, string message)
    {
        return controller.NotFound(
            ApiErrorResponseFactory.Create(
                controller.HttpContext,
                StatusCodes.Status404NotFound,
                message));
    }

    public static ObjectResult ApiForbidden(this ControllerBase controller, string message)
    {
        return controller.StatusCode(
            StatusCodes.Status403Forbidden,
            ApiErrorResponseFactory.Create(
                controller.HttpContext,
                StatusCodes.Status403Forbidden,
                message));
    }
}
