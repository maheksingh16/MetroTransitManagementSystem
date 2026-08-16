package com.example.metrobookingsystem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return authService.register(user);
    }
    @PostMapping("/login")
    public String login(
            @RequestParam String email,
            @RequestParam String password) {

        return authService.login(email, password);
    }
}