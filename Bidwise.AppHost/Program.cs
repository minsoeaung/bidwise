var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.Bidwise_API>("api-gateway");
builder.AddProject<Projects.Bidwise_Identity>("identity-service");
builder.AddProject<Projects.Bidwise_WebClient>("web-client");

builder.Build().Run();
