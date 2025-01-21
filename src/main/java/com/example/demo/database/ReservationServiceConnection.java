package com.example.demo.database;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

@Component
public class ReservationServiceConnection implements DatabaseConnection {

    @Value("${spring.datasource.reservationService.url}")
    private String url;

    @Value("${spring.datasource.reservationService.username}")
    private String username;

    @Value("${spring.datasource.reservationService.password}")
    private String password;

    @Override
    public Connection getConnection() throws SQLException {
        try {
            return DriverManager.getConnection(url, username, password);
        } catch (SQLException e) {
            throw new SQLException("Error al conectar a la base de datos ReservationService", e);
        }
    }
}
