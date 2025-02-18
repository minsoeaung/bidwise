var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.Bidwise_ApiGateway>("api-gateway");

// Event Bus
var kafka = builder.AddKafka("kafka")
                   .WithKafkaUI(kafkaUI => kafkaUI.WithHostPort(9100))
                   .WithDataVolume(isReadOnly: false);

// APIs
builder.AddProject<Projects.Bidwise_Identity>("identity-service")
    .WithReference(kafka);
builder.AddProject<Projects.Bidwise_Catalog>("catalog-service")
    .WithReference(kafka);

// Clients
builder.AddProject<Projects.Bidwise_WebClient>("web-mvc");
builder.AddProject<Projects.Bidwise_React_Bff>("web-spa");

builder.Build().Run();
