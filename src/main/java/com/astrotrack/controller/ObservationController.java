package com.astrotrack.controller;

import com.astrotrack.model.Observation;
import com.astrotrack.repository.ObservationRepository;
import com.astrotrack.dto.ObservationRequest;
import com.astrotrack.service.ObservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/observations")
@CrossOrigin(origins = "http://localhost:5173")
public class ObservationController {

    @Autowired
    private ObservationService observationService;

    // 1. GET ALL LOGS: Pulls everything out of PostgreSQL to show on the right-hand feed
    @GetMapping
    public List<Observation> getAllObservations() {
        return observationService.getAllObservations();
    }

    // 2. SAVE NEW LOG: Receives data using the dedicated Request model
    @PostMapping
    public ResponseEntity<?> createObservation(
            @Valid @RequestBody ObservationRequest request) {

        System.out.println("REQUEST RECEIVED");

        Observation observation = new Observation();
        observation.setCelestialBody(request.getCelestialBody());
        observation.setNotes(request.getNotes());

        Observation savedLog = observationService.saveObservation(observation);

        System.out.println("SAVED ID = " + savedLog.getId());

        return ResponseEntity.ok(savedLog);
    }
}