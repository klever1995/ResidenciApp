package com.example.demo.service;

import com.example.demo.database.DatabaseConnection;
import com.example.demo.database.DatabaseConnectionFactory;
import com.example.demo.database.MySQLConnectionFactory;

import java.sql.Connection;
import java.sql.SQLException;

public class DatabaseService {

    public void testConnection() {
        // Conexión a UserService
        DatabaseConnectionFactory factoryUserService = new MySQLConnectionFactory();
        DatabaseConnection connectionUserService = factoryUserService.createConnection();
        
        try (Connection conn = connectionUserService.getConnection()) {
            System.out.println("Conexión exitosa a la base de datos MySQL");
        } catch (SQLException e) {
            System.out.println("Error al conectar a la base de datos UserService: " + e.getMessage());
        }

        // Conexión a PropertyService
        DatabaseConnectionFactory factoryPropertyService = new MySQLConnectionFactory();
        DatabaseConnection connectionPropertyService = factoryPropertyService.createConnection();
        
        try (Connection conn = connectionPropertyService.getConnection()) {
            System.out.println("Conexión exitosa a la base de datos PropertyService");
        } catch (SQLException e) {
            System.out.println("Error al conectar a la base de datos PropertyService: " + e.getMessage());
        }

        // Conexión a ReservationService (Nuevo)
        DatabaseConnectionFactory factoryReservationService = new MySQLConnectionFactory(); // Usamos la misma fábrica aquí
        DatabaseConnection connectionReservationService = factoryReservationService.createConnection();
        
        try (Connection conn = connectionReservationService.getConnection()) {
            System.out.println("Conexión exitosa a la base de datos ReservationService");
        } catch (SQLException e) {
            System.out.println("Error al conectar a la base de datos ReservationService: " + e.getMessage());
        }
    }
}
