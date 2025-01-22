package com.example.demo.propertyService;

import com.example.demo.propertyService.service.ServiceProperty;

public class main {

    public static void main(String[] args) {
        ServiceProperty databaseService = new ServiceProperty();
        databaseService.testConnection();
    }
    
}
