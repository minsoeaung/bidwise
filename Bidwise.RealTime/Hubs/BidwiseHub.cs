using Microsoft.AspNetCore.SignalR;

namespace Bidwise.RealTime.Hubs;

public class BidwiseHub : Hub
{
    public async Task JoinAuctionGroup(int auctionId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, auctionId.ToString());
    }

    public async Task LeaveAuctionGroup(int auctionId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, auctionId.ToString());
    }
}
