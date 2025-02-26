using Aspire.Hosting;

var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.Bidwise_ApiGateway>("api-gateway");

// Event bus
var kafka = builder.AddKafka("kafka")
                   .WithContainerRuntimeArgs("-p", "9200:9092")
                   .WithKafkaUI(kafkaUI => kafkaUI.WithHostPort(9100))
                   .WithDataVolume(isReadOnly: false);

// APIs
builder.AddProject<Projects.Bidwise_Identity>("identity-service")
    .WithReference(kafka)
    .WaitFor(kafka);

builder.AddProject<Projects.Bidwise_Catalog>("catalog-service")
    .WithReference(kafka)
    .WaitFor(kafka);

//var containerapp = builder.AddSpringApp(
//    "bids-service",
//    new JavaAppContainerResourceOptions
//    {
//        ContainerImageName = "<repository>/<image>",
//        OtelAgentPath = "../agents"
//    });

// comments api in spring
// bids api in spring

// Clients
builder.AddProject<Projects.Bidwise_WebClient>("web-mvc");
builder.AddProject<Projects.Bidwise_React_Bff>("web-spa");

builder.Build().Run();
