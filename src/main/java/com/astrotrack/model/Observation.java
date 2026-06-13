package com.astrotrack.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import jakarta.persistence.Column;

@Entity
@Table(name = "observations")
public class Observation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String celestialBody;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDateTime observedAt = LocalDateTime.now();

    private boolean isPublic = false;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDateTime getObservedAt() {
        return observedAt;
    }

    public void setObservedAt(LocalDateTime observedAt) {
        this.observedAt = observedAt;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean aPublic) {
        isPublic = aPublic;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}