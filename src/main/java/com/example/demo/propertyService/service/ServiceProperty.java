package com.example.demo.propertyService.service;

import com.example.demo.database.DatabaseConnection;
import com.example.demo.database.DatabaseConnectionFactory;
import com.example.demo.database.MySQLConnectionFactory;

import java.sql.Connection;
import java.sql.SQLException;


public class ServiceProperty {

    public void testConnection(){
        DatabaseConnectionFactory factoryPropertyService = new MySQLConnectionFactory();
        DatabaseConnection connectionPropertyService = factoryPropertyService.createConnection();

        try (Connection conn = connectionPropertyService.getConnection()) {
            System.out.println("Conexión exitosa a la base de datos PropertyService");
        } catch (SQLException e) {
            System.out.println("Error al conectar a la base de datos PropertyService: " + e.getMessage());
        }
    }
}

