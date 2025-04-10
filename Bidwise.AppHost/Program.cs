using System.Data;
using Microsoft.Data.SqlClient;
using Projects;

var builder = DistributedApplication.CreateBuilder(args);

var kafka = builder.AddKafka("kafka")
    .WithContainerRuntimeArgs("-p", "9200:9092")
    .WithKafkaUI(kafkaUi => kafkaUi
        .WithHostPort(9100)
        .WithContainerName("kafka-ui"))
    .WithLifetime(ContainerLifetime.Persistent)
    .WithContainerName("kafka")
    .WithDataVolume(isReadOnly: false);

var sqlServerPassword = builder.AddParameter("SqlServerPassword", secret: true);

var sqlServer = builder.AddSqlServer("sql", sqlServerPassword)
    .WithImageTag("2022-CU16-ubuntu-22.04")
    .WithLifetime(ContainerLifetime.Persistent)
    .WithContainerName("sql-server")
    .WithDataVolume(isReadOnly: false);

string? connectionString = null;

builder.Eventing.Subscribe<ConnectionStringAvailableEvent>(sqlServer.Resource, async (@event, ct) =>
{
    connectionString = await sqlServer.Resource.GetConnectionStringAsync(ct).ConfigureAwait(false);

    if (connectionString == null)
        throw new DistributedApplicationException(
            $"ConnectionStringAvailableEvent was published for the '{sqlServer.Resource.Name}' resource but the connection string was null.");
});

// These are only for connection string. They do not create databases.
// https://github.com/dotnet/aspire/issues/1170
var catalogDb = sqlServer
    .AddDatabase("CatalogDb", databaseName: "Bidwise_Catalog");
var hangfireDb = sqlServer
    .AddDatabase("HangfireDb", databaseName: "Bidwise_Hangfire");
var identityDb = sqlServer
    .AddDatabase("IdentityDb", databaseName: "Bidwise_Identity");
var commentsDb = sqlServer
    .AddDatabase("CommentsDb", databaseName: "Bidwise_Comments");
var bidsDb = sqlServer
    .AddDatabase("BidsDb", databaseName: "Bidwise_Bids");

builder.Eventing.Subscribe<ResourceReadyEvent>(sqlServer.Resource, async (@event, ct) =>
{
    if (connectionString is null)
        throw new DistributedApplicationException(
            $"ResourceReadyEvent was published for the '{sqlServer.Resource.Name}' resource but the connection string was null.");

    await using var sqlConnection = new SqlConnection(connectionString);
    await sqlConnection.OpenAsync(ct).ConfigureAwait(false);

    if (sqlConnection.State != ConnectionState.Open)
        throw new InvalidOperationException($"Could not open connection to '{sqlServer.Resource.Name}'");

    foreach (var sqlDatabase in sqlServer.Resource.Databases)
    {
        var quotedDatabaseIdentifier = new SqlCommandBuilder().QuoteIdentifier(sqlDatabase.Value);
        await using var command = sqlConnection.CreateCommand();
        command.CommandText = $"""
                               IF NOT EXISTS (SELECT 1 FROM sys.databases WHERE name = @DatabaseName)
                               BEGIN
                                   CREATE DATABASE {quotedDatabaseIdentifier};
                               END
                               """;
        command.Parameters.Add(new SqlParameter("@DatabaseName", sqlDatabase.Value));
        await command.ExecuteNonQueryAsync(ct).ConfigureAwait(false);
    }
});

var identityService = builder.AddProject<Bidwise_Identity>("identity-service")
    .WithReference(kafka)
    .WithReference(identityDb)
    .WaitFor(kafka)
    .WaitFor(identityDb);

var catalogService = builder.AddProject<Bidwise_Catalog>("catalog-service")
    .WithReference(kafka)
    .WithReference(catalogDb)
    .WithReference(hangfireDb)
    .WaitFor(kafka)
    .WaitFor(catalogDb)
    .WaitFor(hangfireDb);

var bidsService = builder.AddSpringApp(
        "bids-service",
        workingDirectory: "../Bidwise.Bids",
        new JavaAppExecutableResourceOptions
        {
            ApplicationName = "target/bids-service-0.0.1.jar",
            Port = 5004,
            OtelAgentPath = "../agents"
        })
    .WithMavenBuild()
    .WaitFor(kafka)
    .WithReference(bidsDb)
    .WaitFor(bidsDb);

var commentsService = builder.AddSpringApp(
        "comments-service",
        workingDirectory: "../Bidwise.Comments",
        new JavaAppExecutableResourceOptions
        {
            ApplicationName = "target/comments-service-0.0.1.jar",
            Port = 5003,
            OtelAgentPath = "../agents"
        })
    .WithMavenBuild()
    .WaitFor(kafka)
    .WithReference(commentsDb)
    .WaitFor(commentsDb);

var realtimeService = builder.AddProject<Bidwise_RealTime>("realtime-service")
    .WithReference(kafka)
    .WaitFor(kafka);

var apiGateway = builder.AddProject<Bidwise_ApiGateway>("api-gateway")
    .WaitFor(identityService)
    .WaitFor(catalogService)
    .WaitFor(bidsService)
    .WaitFor(commentsService)
    .WaitFor(realtimeService);

builder.AddProject<Bidwise_React_Bff>("react-app")
    .WaitFor(apiGateway);

builder.Build().Run();