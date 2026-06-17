using Ttc.Model.Core;

namespace Ttc.WebApi.Utilities.Pipeline;

internal static class LoadSettings
{
    public static (TtcSettings, IConfigurationRoot) GetConfiguration()
    {
        var ttcSettings = new TtcSettings();
        var configuration = new ConfigurationBuilder()
            // .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")}.json", optional: true)
            // Lets per-tier overrides (e.g. TtcSettings__StartSyncJob=false on dev/PRs so they
            // don't burn the Frenoy API quota) take effect from the container environment.
            .AddEnvironmentVariables()
            .Build();

        configuration
            .GetSection("TtcSettings")
            .Bind(ttcSettings);

        string? mailkitPassword = Environment.GetEnvironmentVariable("MAILKIT_PASSWORD");
        if (!string.IsNullOrWhiteSpace(mailkitPassword))
        {
            ttcSettings.Email.Password = ttcSettings.Email.Password.Replace("{MAILKIT_PASSWORD}", mailkitPassword);
        }

        return (ttcSettings, configuration);
    }
}
