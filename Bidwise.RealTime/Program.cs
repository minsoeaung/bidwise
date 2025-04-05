using Bidwise.RealTime.Hubs;
using Bidwise.RealTime.Kafka;
using Confluent.Kafka;

var builder = WebApplication.CreateBuilder(args);
builder.AddServiceDefaults();
builder.Services.AddSignalR();

builder.AddKafkaConsumer<string, string>("kafka", options =>
{
    options.Config.GroupId = "realtime-group";
    options.Config.AutoOffsetReset = AutoOffsetReset.Latest;
    options.Config.EnableAutoCommit = false;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "ReactClient",
                      policy =>
                      {
                          policy.WithOrigins("https://localhost:5173");
                          policy.AllowAnyHeader();
                          policy.AllowAnyMethod();
                          policy.AllowCredentials();
                      });
});

builder.Services.AddHostedService<WorkerService>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseCors("ReactClient");

app.MapHub<BidwiseHub>("/realtime");

app.Run();
