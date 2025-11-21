namespace Scheduler.API;

internal static class HostingExtensions 
{
    public static WebApplication Configure(this WebApplicationBuilder builder)
    {
        return builder
            .ConfigureServices()
            .ConfigurePipeline();
    }
    
    private static WebApplication ConfigureServices( this WebApplicationBuilder builder )
    {
        builder.Services.AddRouting();
        return builder.Build();
    }

    private static WebApplication ConfigurePipeline( this WebApplication app )
    {
        app.UseRouting();
        app.UseAuthentication();
        app.UseAuthorization();

        return app;
    }
}