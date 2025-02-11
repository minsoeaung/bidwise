var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.Bidwise_ApiGateway>("api-gateway");

// APIs
builder.AddProject<Projects.Bidwise_Identity>("identity-service");
builder.AddProject<Projects.Bidwise_Catalog>("catalog-service");

// bids-service in spring
// comments-service in spring

// Clients
builder.AddProject<Projects.Bidwise_WebClient>("web-mvc");
builder.AddProject<Projects.Bidwise_React_Bff>("web-spa");

// TODO: Add the following projects
// kafka
// spring boot

builder.Build().Run();
