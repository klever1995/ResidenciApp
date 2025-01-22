package com.example.demo.propertyService.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.demo.propertyService.dto.PropertyDTO;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Component
public class PropertyDAO {
    
    private final DataSource dataSource;

    @Autowired
    public PropertyDAO(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    // Method to get all properties
    public List<PropertyDTO> getAllProperties() {
        List<PropertyDTO> properties = new ArrayList<>();
        String query = "SELECT id, title, description, price, address, is_available, owernerId, updated_at FROM Properties";

        // We use the injected DataSource to obtain the connection
        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {

            while (resultSet.next()) {
                PropertyDTO property = new PropertyDTO();
                property.setId(resultSet.getInt("id"));
                property.setTitle(resultSet.getString("title"));
                property.setDescription(resultSet.getString("description"));
                property.setPrice(resultSet.getDouble("price"));
                property.setAddress(resultSet.getString("address"));
                property.setIsAvailable(resultSet.getString("is_avaible"));
                property.setOwnerId(resultSet.getInt("ownerId"));
                property.setCreatedAt(resultSet.getTimestamp("created_at"));
                property.setUpdatedAt(resultSet.getTimestamp("updated_at"));

                properties.add(property);
            }
        } catch (SQLException e) {
            System.out.println("Error al obtener usuarios: " + e.getMessage());
        }

        return properties;
    }
}
