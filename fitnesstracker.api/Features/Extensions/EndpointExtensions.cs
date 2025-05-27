using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.OpenApi.Models;

namespace FitnessTracker.Api.Features.Extensions;

public static class EndpointExtensions
{
    public static RouteHandlerBuilder WithTag(this RouteHandlerBuilder builder, string tag)
    {
        return builder.WithOpenApi(operation =>
        {
            operation.Tags = new List<OpenApiTag> { new OpenApiTag { Name = tag } };
            return operation;
        });
    }
}