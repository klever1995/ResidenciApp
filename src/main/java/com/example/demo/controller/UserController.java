package com.example.demo.controller;

import com.example.demo.dao.UserDAO;
import com.example.demo.dto.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController {

    // Inyección automática del DAO
    @Autowired
    private UserDAO userDAO;

    // Ruta para obtener todos los usuarios
    @GetMapping("/users")
    public List<User> getUsers() {
        // Retorna la lista de usuarios en formato JSON automáticamente
        return userDAO.getAllUsers();
    }
}
