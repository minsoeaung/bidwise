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

// If spring boot use an https endpoint to communicate to outside
// keytool -import -alias itentityServer5001 -keystore "C:\Program Files\Java\jdk-23\lib\security\cacerts" -file localhost5001.crt

// Also might need to "./gradlew build" to these two spring app...
builder.AddSpringApp(
    "bids-service",
   workingDirectory: "../Bidwise.Bids",
    new JavaAppExecutableResourceOptions
    {
        ApplicationName = "build/libs/bids-0.0.1.jar",
        Port = 5004,
        OtelAgentPath = "../agents"
    })
    .WaitFor(kafka);

builder.AddSpringApp(
    "comments-service",
    workingDirectory: "../Bidwise.Comments",
    new JavaAppExecutableResourceOptions
    {
        ApplicationName = "build/libs/comments-0.0.1.jar",
        Port = 5003,
        OtelAgentPath = "../agents"
    })
    .WaitFor(kafka);

builder.AddProject<Projects.Bidwise_React_Bff>("web-spa");

builder.AddProject<Projects.Bidwise_RealTime>("realtime-service")
    .WithReference(kafka)
    .WaitFor(kafka);

builder.Build().Run();
