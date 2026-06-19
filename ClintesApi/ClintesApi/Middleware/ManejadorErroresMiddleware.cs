using System.Net;
using System.Text.Json;

namespace ClientesApi.Middleware;

public class ManejadorErroresMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ManejadorErroresMiddleware> _logger;

    public ManejadorErroresMiddleware(RequestDelegate next, ILogger<ManejadorErroresMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error no controlado");
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var respuesta = JsonSerializer.Serialize(new
            {
                mensaje = "Ocurrió un error inesperado en el servidor."
            });

            await context.Response.WriteAsync(respuesta);
        }
    }
}