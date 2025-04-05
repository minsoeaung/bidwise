
using Bidwise.Common;
using Bidwise.Common.Models.Spring;
using Bidwise.RealTime.Hubs;
using Confluent.Kafka;
using Microsoft.AspNetCore.SignalR;
using System.Text.Json;

namespace Bidwise.RealTime.Kafka;

public class WorkerService(IConsumer<string, string> consumer, IHubContext<BidwiseHub> bidwiseHub) : BackgroundService
{
    private readonly JsonSerializerOptions jsonSerializerOptions = new()
    {
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
        consumer.Subscribe([Topics.BidPlaced, Topics.CommentUpdated, Topics.CommentCreated]);

        while (!cancellationToken.IsCancellationRequested)
        {
            try
            {
                var consumeResult = consumer.Consume(cancellationToken);

                switch (consumeResult.Topic)
                {
                    case Topics.BidPlaced:
                        Console.WriteLine($"--> Received message from {Topics.BidPlaced}: {consumeResult.Message.Value}");

                        var bid = JsonSerializer.Deserialize<BidModel>(consumeResult.Message.Value, jsonSerializerOptions);

                        if (bid == null)
                            continue;

                        Console.WriteLine($"--> SignalR invoked {Topics.BidPlaced}.");

                        await bidwiseHub.Clients.Group(bid.ItemId.ToString())
                            .SendAsync(Topics.BidPlaced, consumeResult.Message.Value, cancellationToken: cancellationToken);

                        break;
                    case Topics.CommentCreated:
                        Console.WriteLine($"--> Received message from {Topics.CommentCreated}: {consumeResult.Message.Value}");

                        var createdComment = JsonSerializer.Deserialize<CommentModel>(consumeResult.Message.Value, jsonSerializerOptions);

                        if (createdComment == null)
                            continue;

                        Console.WriteLine($"--> SignalR invoked {Topics.CommentCreated}.");

                        await bidwiseHub.Clients.Group(createdComment.ItemId.ToString())
                            .SendAsync(Topics.CommentCreated, consumeResult.Message.Value, cancellationToken: cancellationToken);

                        break;
                    case Topics.CommentUpdated:
                        Console.WriteLine($"--> Received message from {Topics.CommentUpdated}: {consumeResult.Message.Value}");

                        var updatedComment = JsonSerializer.Deserialize<CommentModel>(consumeResult.Message.Value, jsonSerializerOptions);

                        if (updatedComment == null)
                            continue;

                        Console.WriteLine($"--> SignalR invoked {Topics.CommentUpdated}.");

                        await bidwiseHub.Clients.Group(updatedComment.ItemId.ToString())
                            .SendAsync(Topics.CommentUpdated, consumeResult.Message.Value, cancellationToken: cancellationToken);

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
