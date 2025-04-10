package com.bidwise.bids.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class DataSourceConfig {

    @Value("${ConnectionStrings__BidsDb}")
    private String rawConnectionString;

    @Bean
    public DataSource dataSource() throws SQLException {
        String url = extractJdbcUrl(rawConnectionString);
        String username = extractUsername(rawConnectionString);
        String password = extractPassword(rawConnectionString);

        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
        dataSource.setUrl(url);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        return dataSource;
    }

    private String extractJdbcUrl(String conn) {
        // Shape of "conn" provided by .NET Aspire
        // Server=127.0.0.1,35285;User ID=___;Password=___;TrustServerCertificate=true;Database=Bidwise.Bids

        Map<String, String> pairs = new HashMap<>();

        for (String pair : conn.split(";")) {
            if (pair.contains("=")) {
                String[] kv = pair.split("=", 2);
                if (kv.length == 2)
                    pairs.put(kv[0].trim(), kv[1].trim());
            }
        }

        String host = pairs.getOrDefault("Server", "localhost").replace(',', ':');
        String dbName = pairs.getOrDefault("Database", "defaultdb");

        return String.format("jdbc:sqlserver://%s;databaseName=%s;TrustServerCertificate=true", host, dbName);
    }

    private String extractUsername(String conn) {
        return extractConnectionProperty(conn, "User ID");
    }

    private String extractPassword(String conn) {
        return extractConnectionProperty(conn, "Password");
    }

    private String extractConnectionProperty(String conn, String property) {
        for (String pair : conn.split(";")) {
            if (pair.contains("=")) {
                String[] kv = pair.split("=", 2);
                if (kv.length == 2 && kv[0].trim().equalsIgnoreCase(property)) {
                    return kv[1].trim();
                }
            }
        }
        return null;
    }
}
