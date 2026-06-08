package com.astrotrack.service;

import com.astrotrack.model.Observation;
import java.util.List;

public interface ObservationService {

    List<Observation> getAllObservations();

    Observation saveObservation(Observation observation);
}