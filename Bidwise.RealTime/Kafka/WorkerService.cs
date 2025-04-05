
using Bidwise.Common;
using Bidwise.Common.Models.Kafka;
using Bidwise.RealTime.Hubs;
using Confluent.Kafka;
using Microsoft.AspNetCore.SignalR;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Bidwise.RealTime.Kafka;

public class WorkerService(IConsumer<string, string> consumer, IHubContext<BidwiseHub> bidwiseHub) : BackgroundService
{
    private readonly JsonSerializerOptions jsonSerializerOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true,
    };

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        return Task.Run(() =>
        {
            _ = ConsumeAsync(stoppingToken);
        }, stoppingToken);
    }

    private async Task ConsumeAsync(CancellationToken cancellationToken)
    {
        consumer.Subscribe([Topics.BidPlaced, Topics.CommentUpdated, Topics.CommentCreated, Topics.AuctionEnded]);

        while (!cancellationToken.IsCancellationRequested)
        {
            try
            {
                var consumeResult = consumer.Consume(cancellationToken);

                switch (consumeResult.Topic)
                {
                    case Topics.BidPlaced:
                        var bid = JsonSerializer.Deserialize<BidModel>(consumeResult.Message.Value, jsonSerializerOptions);
                        if (bid == null) continue;

                        Console.WriteLine($"--> SignalR invoked {Topics.BidPlaced}.");

                        await bidwiseHub.Clients.Group(bid.ItemId.ToString())
                            .SendAsync(Topics.BidPlaced, consumeResult.Message.Value, cancellationToken: cancellationToken);

                        break;
                    case Topics.CommentCreated:
                        var createdComment = JsonSerializer.Deserialize<CommentModel>(consumeResult.Message.Value, jsonSerializerOptions);
                        if (createdComment == null) continue;

                        Console.WriteLine($"--> SignalR invoked {Topics.CommentCreated}.");

                        await bidwiseHub.Clients.Group(createdComment.ItemId.ToString())
                            .SendAsync(Topics.CommentCreated, consumeResult.Message.Value, cancellationToken: cancellationToken);

                        break;
                    case Topics.CommentUpdated:
                        var updatedComment = JsonSerializer.Deserialize<CommentModel>(consumeResult.Message.Value, jsonSerializerOptions);
                        if (updatedComment == null) continue;

                        Console.WriteLine($"--> SignalR invoked {Topics.CommentUpdated}.");

                        await bidwiseHub.Clients.Group(updatedComment.ItemId.ToString())
                            .SendAsync(Topics.CommentUpdated, consumeResult.Message.Value, cancellationToken: cancellationToken);

                        break;
                    case Topics.AuctionEnded:
                        var auctionedItem = JsonSerializer.Deserialize<ItemModel>(consumeResult.Message.Value, jsonSerializerOptions);
                        if (auctionedItem == null) continue;

                        Console.WriteLine($"--> SignalR invoked {Topics.AuctionEnded}.");

                        await bidwiseHub.Clients.Group(auctionedItem.Id.ToString())
                            .SendAsync(Topics.AuctionEnded, JsonSerializer.Serialize(auctionedItem, jsonSerializerOptions), cancellationToken: cancellationToken);

                        break;
                    default:
                        Console.WriteLine($"Received message from unknown topic: {consumeResult.Topic}");
                        break;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"--> Error processing message, {ex.Message}");
            }
        }

        consumer.Close();
    }
}
