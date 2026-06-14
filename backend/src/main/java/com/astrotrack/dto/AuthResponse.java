package com.astrotrack.dto;

public class AuthResponse {

    private String jwt;
    private Long userId;
    private String username;

    public AuthResponse(String jwt, Long userId, String username) {
        this.jwt = jwt;
        this.userId = userId;
        this.username = username;
    }

    public String getJwt() {
        return jwt;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }
}