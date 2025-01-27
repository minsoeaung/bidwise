using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Net.Http;
using System.Text.Json;

namespace Bidwise.WebClient.Pages
{
    public class CallNetIntrospectionModel(IHttpClientFactory httpClientFactory) : PageModel
    {
        public string Message { get; private set; } = "initial";

        public async void OnGet()
        {
            var client = httpClientFactory.CreateClient("apiClient");
            var content = await client.GetStringAsync("bids/private");
            var parsed = JsonDocument.Parse(content);
            var formatted = JsonSerializer.Serialize(parsed, new JsonSerializerOptions { WriteIndented = true });
            Message = formatted;
        }
    }
}
