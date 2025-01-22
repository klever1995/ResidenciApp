package com.example.demo.controller;

import com.example.demo.dao.UserDAO;
import com.example.demo.dto.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController {

    // Automatic DAO injection
    @Autowired
    private UserDAO userDAO;

    // Path to get all users
    @GetMapping("/users")
    public List<User> getUsers() {
        // Returns the list of users in JSON format automatically
        return userDAO.getAllUsers();
    }
}
