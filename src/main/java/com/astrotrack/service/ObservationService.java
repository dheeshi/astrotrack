package com.astrotrack.service;

import com.astrotrack.model.Observation;
import java.util.List;

public interface ObservationService {

    List<Observation> getAllObservations();

    List<Observation> getUserObservations(Long userId);

    List<Observation> getPublicObservations();

    Observation saveObservation(Observation observation);
}