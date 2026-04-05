namespace Ecommerce.Api.Infrastructure.Errors;

public sealed class ApiErrorResponse
{
    public string Message { get; init; } = string.Empty;
    public int Status { get; init; }
    public string TraceId { get; init; } = string.Empty;
    public IReadOnlyDictionary<string, string[]>? Errors { get; init; }
}
