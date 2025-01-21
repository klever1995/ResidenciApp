package com.example.demo;

import com.example.demo.service.DatabaseService;

public class Main {
    public static void main(String[] args) {
        DatabaseService databaseService = new DatabaseService();
        databaseService.testConnection();
    }
}
