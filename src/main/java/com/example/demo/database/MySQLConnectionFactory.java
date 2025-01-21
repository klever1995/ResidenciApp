// Concrete factory for creating MySQL database connection objects.

package com.example.demo.database;

public class MySQLConnectionFactory implements DatabaseConnectionFactory {

    @Override
    public DatabaseConnection createConnection() {
        return new MySQLConnection();
    }
}
