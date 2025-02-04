using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Bidwise.WebClient.Pages
{
    public class CallApiModel(IHttpClientFactory httpClientFactory) : PageModel
    {
        public string Message { get; private set; } = "Initial Message";

        public async Task OnGetAsync()
        {
            var client = httpClientFactory.CreateClient("apiClient");
            var content = await client.GetStringAsync("catalog?PageNum=0&PageSize=10&OrderByOptions=SimpleOrder&FilterBy=ByStatus&FilterValue=Expired");
            Console.WriteLine("--> CONTENT");
            Console.WriteLine(content);
            var parsed = JsonDocument.Parse(content);
            var formatted = JsonSerializer.Serialize(parsed, new JsonSerializerOptions { WriteIndented = true });
            Message = formatted;
        }
    }
}
