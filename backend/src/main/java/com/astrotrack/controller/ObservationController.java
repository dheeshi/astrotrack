package com.astrotrack.controller;

import com.astrotrack.dto.ObservationRequest;
import com.astrotrack.model.Observation;
import com.astrotrack.model.User;
import com.astrotrack.repository.ObservationRepository;
import com.astrotrack.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/observations")
@CrossOrigin(origins = "http://localhost:5173")
public class ObservationController {

    @Autowired
    private ObservationRepository observationRepository;

    @Autowired
    private UserRepository userRepository;

    // PRIVATE DASHBOARD
    @GetMapping("/user/{userId}")
    public List<Observation> getUserObservations(
            @PathVariable Long userId) {

        return observationRepository.findByUserId(userId);
    }

    // PUBLIC FEED
    @GetMapping("/public")
    public Page<Observation> getPublicObservations(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "5")
            int size
    ) {

        return observationRepository
                .findByIsPublicTrueOrderByObservedAtDesc(
                        PageRequest.of(page, size)
                );
    }

    @PostMapping
    public ResponseEntity<?> createObservation(
            @Valid @RequestBody ObservationRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Observation observation = new Observation();

        observation.setCelestialBody(request.getCelestialBody());
        observation.setNotes(request.getNotes());
        observation.setUser(user);

        System.out.println("PUBLIC = " +
                request.isPublicObservation());

        observation.setPublic(
                request.isPublicObservation()
        );

        return ResponseEntity.ok(
                observationRepository.save(observation)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteObservation(
            @PathVariable Long id) {

        observationRepository.deleteById(id);

        return ResponseEntity.ok("Deleted");
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateObservation(
            @PathVariable Long id,
            @RequestBody ObservationRequest request) {

        Observation observation =
                observationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Observation not found"));

        observation.setCelestialBody(
                request.getCelestialBody());

        observation.setNotes(
                request.getNotes());

        observation.setPublic(
                request.isPublicObservation());

        return ResponseEntity.ok(
                observationRepository.save(observation)
        );
    }

}