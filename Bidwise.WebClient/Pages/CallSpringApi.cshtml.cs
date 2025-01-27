using Microsoft.AspNetCore.Mvc.RazorPages;
namespace Bidwise.WebClient.Pages;

public class CallSpringApiModel(IHttpClientFactory httpClientFactory) : PageModel
{
    public string Message { get; private set; } = "Initial Message";

    public async Task OnGetAsync()
    {
        var client = httpClientFactory.CreateClient("apiClient");
        var content = await client.GetStringAsync("employees");
        //var parsed = JsonDocument.Parse(content);
        //var formatted = JsonSerializer.Serialize(parsed, new JsonSerializerOptions { WriteIndented = true });
        Message = content;

    }
}
