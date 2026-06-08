package com.astrotrack.dto;

import jakarta.validation.constraints.NotBlank;

public class ObservationRequest {

   // @NotNull(message = "User ID cannot be null")
    private Long userId;

    @NotBlank(message = "Celestial body name cannot be blank")
    private String celestialBody;

    private String notes;

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getCelestialBody() { return celestialBody; }
    public void setCelestialBody(String celestialBody) { this.celestialBody = celestialBody; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}