var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.Bidwise_API>("api-gateway");
builder.AddProject<Projects.Bidwise_Identity>("identity-service");
builder.AddProject<Projects.Bidwise_WebClient>("web-mvc");
builder.AddProject<Projects.Bidwise_React_Bff>("web-spa");

builder.Build().Run();
