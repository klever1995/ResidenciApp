// Interface for creating database connection objects. Implementations will create connections for specific databases.

package com.example.demo.database;

public interface DatabaseConnectionFactory {
    DatabaseConnection createConnection();
    
}
