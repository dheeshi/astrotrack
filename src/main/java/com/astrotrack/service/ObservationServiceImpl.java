package com.astrotrack.service;

import com.astrotrack.model.Observation;
import com.astrotrack.repository.ObservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ObservationServiceImpl implements ObservationService {

    @Autowired
    private ObservationRepository observationRepository;

    @Override
    public List<Observation> getAllObservations() {
        return observationRepository.findAll();
    }

    @Override
    public Observation saveObservation(Observation observation) {
        return observationRepository.save(observation);
    }
}