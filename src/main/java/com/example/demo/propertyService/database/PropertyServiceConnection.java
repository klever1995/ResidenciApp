package com.example.demo.propertyService.database;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

@Component
public class PropertyServiceConnection implements DatabaseConnection {

    @Value("${spring.datasource.propertyService.url}")
    private String url;

    @Value("${spring.datasource.propertyService.username}")
    private String username;

    @Value("${spring.datasource.propertyService.password}")
    private String password;

    @Override
    public Connection getConnection() throws SQLException {
        try {
            return DriverManager.getConnection(url, username, password);
        } catch (SQLException e) {
            throw new SQLException("Error connecting to PropertyService database", e);
        }
    }
}
