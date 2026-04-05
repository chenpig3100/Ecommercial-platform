using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Ecommerce.Api.Infrastructure.Errors;

public static class ApiErrorResponseFactory
{
    public static ApiErrorResponse Create(
        HttpContext httpContext,
        int status,
        string message,
        IReadOnlyDictionary<string, string[]>? errors = null)
    {
        return new ApiErrorResponse
        {
            Message = message,
            Status = status,
            TraceId = httpContext.TraceIdentifier,
            Errors = errors is { Count: > 0 } ? errors : null
        };
    }

    public static ApiErrorResponse FromModelState(
        HttpContext httpContext,
        ModelStateDictionary modelState,
        string message = "One or more validation errors occurred.")
    {
        var errors = modelState
            .Where(entry => entry.Value?.Errors.Count > 0)
            .ToDictionary(
                entry => ToCamelCasePath(entry.Key),
                entry => entry.Value!.Errors
                    .Select(error => string.IsNullOrWhiteSpace(error.ErrorMessage)
                        ? "The provided value is invalid."
                        : error.ErrorMessage)
                    .Distinct()
                    .ToArray());

        return Create(httpContext, StatusCodes.Status400BadRequest, message, errors);
    }

    private static string ToCamelCasePath(string key)
    {
        if (string.IsNullOrWhiteSpace(key))
        {
            return string.Empty;
        }

        var parts = key.Split('.', StringSplitOptions.RemoveEmptyEntries);

        for (var index = 0; index < parts.Length; index++)
        {
            var part = parts[index];
            if (string.IsNullOrWhiteSpace(part))
            {
                continue;
            }

            parts[index] = char.ToLowerInvariant(part[0]) + part[1..];
        }

        return string.Join(".", parts);
    }
}
