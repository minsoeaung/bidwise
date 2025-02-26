
using Bidwise.Identity.Models;
using Confluent.Kafka;
using System.Text.Json;

namespace Bidwise.Identity.Kafka;

public class KafkaConsumer(IConsumer<string, string> consumer) : BackgroundService
{
    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        return Task.Run(() =>
        {
            _ = ConsumeAsync("AuctionCreated", stoppingToken);
        }, stoppingToken);
    }

    public async Task ConsumeAsync(string topic, CancellationToken cancellationToken)
    {
        consumer.Subscribe(topic);

        while (!cancellationToken.IsCancellationRequested)
        {
            var consumeResult = consumer.Consume(cancellationToken);

            var item = JsonSerializer.Deserialize<ItemModel>(consumeResult.Message.Value);
            if (item == null)
                return;

            Console.WriteLine("--> Item Created Event");
            Console.WriteLine($"--> {item.Name}");
        }

        consumer.Close();
    }

    public async Task ConsumeBidPlacedAsync(string topic, CancellationToken cancellationToken)
    {
        consumer.Subscribe(topic);

        while (!cancellationToken.IsCancellationRequested)
        {
            var consumeResult = consumer.Consume(cancellationToken);

            var item = JsonSerializer.Deserialize<BidModel>(consumeResult.Message.Value);
            if (item == null)
                return;

            Console.WriteLine("--> BidPlaced Event");
            Console.WriteLine($"--> {item.BidderName}");
        }

        consumer.Close();
    }
}
