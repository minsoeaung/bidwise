using Bidwise.Common;
using Confluent.Kafka;
using System.Text.Json;
using Bidwise.Catalog.Data;
using Bidwise.Common.Models.Spring;

namespace Bidwise.Catalog.Kafka;

public class BidPlacedListener(IConsumer<string, string> consumer, IServiceScopeFactory serviceScopeFactory) : BackgroundService
{
    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        return Task.Run(() =>
        {
            _ = ConsumeAsync(stoppingToken);
        }, stoppingToken);
    }

    private async Task ConsumeAsync(CancellationToken cancellationToken)
    {
        // Join a Group
        consumer.Subscribe(Topics.BidPlaced);

        // The Consume Loop
        while (!cancellationToken.IsCancellationRequested)
        {
            try
            {
                var consumeResult = consumer.Consume(cancellationToken);
                var bid = JsonSerializer.Deserialize<BidModel>(consumeResult.Message.Value, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (bid == null)
                    continue;

                await ProcessBidAsync(bid, cancellationToken);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"--> Error processing message from topic {Topics.BidPlaced}: {ex.Message}");
            }
        }

        consumer.Close();
    }

    private async Task ProcessBidAsync(BidModel bid, CancellationToken cancellationToken)
    {
        using var scope = serviceScopeFactory.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<CatalogDbContext>();

        var item = await context.Items.FindAsync(bid.ItemId);
        if (item == null)
            return;

        if (item.CurrentHighestBid == null || item.CurrentHighestBid < bid.Amount)
        {
            item.CurrentHighestBid = bid.Amount;
            item.CurrentHighestBidderId = bid.BidderId;
            await context.SaveChangesAsync(cancellationToken);
        }
    }
}
