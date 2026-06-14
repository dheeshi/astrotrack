package com.astrotrack.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ObservationRequest {

    private Long userId;

    @NotBlank
    private String celestialBody;

    @Size(max = 5000)
    private String notes;

    private boolean publicObservation;


    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getCelestialBody() {
        return celestialBody;
    }

    public void setCelestialBody(String celestialBody) {
        this.celestialBody = celestialBody;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }


    public boolean isPublicObservation() {
        return publicObservation;
    }

    public void setPublicObservation(boolean publicObservation) {
        this.publicObservation = publicObservation;
    }

}