using Bidwise.Catalog.Data;
using Bidwise.Common.Models.Kafka;
using Confluent.Kafka;
using System.Text.Json;

namespace Bidwise.Catalog.Kafka;

public class KafkaConsumer(IConsumer<string, string> consumer, IServiceScopeFactory serviceScope) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var consumeTasks = new List<Task>
        {
            ConsumeTopicAsync("BidPlaced", stoppingToken),
            ConsumeTopicAsync("BidUpdated", stoppingToken)
        };

        await Task.WhenAll(consumeTasks);
    }

    private async Task ConsumeTopicAsync(string topic, CancellationToken cancellationToken)
    {
        consumer.Subscribe(topic);

        try
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                try
                {
                    var consumeResult = consumer.Consume(cancellationToken);


                    var options = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    };
                    var bid = JsonSerializer.Deserialize<BidPlacedModel>(consumeResult.Message.Value, options);
                    if (bid == null)
                        continue;

                    await ProcessBidAsync(bid, cancellationToken);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error processing message from topic {topic}: {ex.Message}");
                }
            }
        }
        finally
        {
            consumer.Close();
        }
    }

    private async Task ProcessBidAsync(BidPlacedModel bid, CancellationToken cancellationToken)
    {
        using var scope = serviceScope.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<CatalogDbContext>();

        var item = await context.Items.FindAsync(bid.ItemId);
        if (item == null)
            return;

        if (item.CurrentHighestBid == null || item.CurrentHighestBid < bid.Amount)
        {
            item.CurrentHighestBid = bid.Amount;
            await context.SaveChangesAsync(cancellationToken);
        }
    }
}

