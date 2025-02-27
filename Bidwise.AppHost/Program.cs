var builder = DistributedApplication.CreateBuilder(args);

var kafka = builder.AddKafka("kafka")
                   .WithContainerRuntimeArgs("-p", "9200:9092")
                   .WithKafkaUI(kafkaUI => kafkaUI.WithHostPort(9100))
                   .WithDataVolume(isReadOnly: false);

builder.AddProject<Projects.Bidwise_ApiGateway>("api-gateway");

builder.AddProject<Projects.Bidwise_Identity>("identity-service")
    .WithReference(kafka)
    .WaitFor(kafka);

builder.AddProject<Projects.Bidwise_Catalog>("catalog-service")
    .WithReference(kafka)
    .WaitFor(kafka);

// Spring boot uses introspection endpoint of identity server
// keytool -import -alias itentityServer5001 -keystore "C:\Program Files\Java\jdk-23\lib\security\cacerts" -file localhost5001.crt
builder.AddSpringApp(
    "bids-service",
    workingDirectory: "../Bidwise.Bids",
    new JavaAppExecutableResourceOptions
    {
        ApplicationName = "build/libs/bids-0.0.1-SNAPSHOT.jar",
        Port = 5004,
        OtelAgentPath = "../agents"
    })
    .WithExternalHttpEndpoints()
    .WaitFor(kafka);

builder.AddSpringApp(
    "comments-service",
    workingDirectory: "../Bidwise.Comments",
    new JavaAppExecutableResourceOptions
    {
        ApplicationName = "build/libs/comments-0.0.1-SNAPSHOT.jar",
        Port = 5003,
        OtelAgentPath = "../agents"
    })
    .WithExternalHttpEndpoints()
    .WaitFor(kafka);

builder.AddProject<Projects.Bidwise_WebClient>("web-mvc");
builder.AddProject<Projects.Bidwise_React_Bff>("web-spa");

builder.Build().Run();
