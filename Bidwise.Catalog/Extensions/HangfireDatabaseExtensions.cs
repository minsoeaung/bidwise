using Microsoft.Data.SqlClient;

namespace Bidwise.Catalog.Extensions;

public static class HangfireDatabaseExtensions
{
    public static void CreateHangfireDbIfNotExist(this IServiceCollection services, string connectionString)
    {
        var builder = new SqlConnectionStringBuilder(connectionString);
        var databaseName = builder.InitialCatalog; // Bidwise.Hangfire

        // Temporarily connect to 'master'
        builder.InitialCatalog = "master";

        using var connection = new SqlConnection(builder.ToString());
        connection.Open();

        using var command = connection.CreateCommand();
        command.CommandText = $"""
                                   IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'{databaseName}')
                                   BEGIN
                                       CREATE DATABASE [{databaseName}];
                                   END
                               """;
        command.ExecuteNonQuery();
    }
}