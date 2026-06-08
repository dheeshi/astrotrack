package com.astrotrack.controller;

import com.astrotrack.dto.AuthRequest;
import com.astrotrack.dto.AuthResponse;
import com.astrotrack.model.User;
import com.astrotrack.repository.UserRepository;
import com.astrotrack.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // 1. REGISTRATION ENDPOINT: Saves a new user with an encrypted password
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        // Securely hash the plain-text password using BCrypt before storing it in PostgreSQL
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    // 2. LOGIN ENDPOINT: Validates credentials and returns a secure cryptographic JWT
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody AuthRequest authRequest) {
        java.util.Optional<User> userOpt = userRepository.findByUsername(authRequest.getUsername());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Verify if the incoming raw password matches the encrypted hash in the database
            if (passwordEncoder.matches(authRequest.getPassword(), user.getPassword())) {
                String token = jwtUtil.generateToken(user.getUsername());
                return ResponseEntity.ok(new AuthResponse(token));
            }
        }

        return ResponseEntity.status(401).body("Error: Invalid username or password");
    }
}