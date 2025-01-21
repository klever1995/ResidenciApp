// Interface for obtaining a database connection. Implementations handle connection logic for specific databases.

package com.example.demo.database;

import java.sql.Connection;
import java.sql.SQLException;

public interface DatabaseConnection {
    Connection getConnection() throws SQLException;
}
