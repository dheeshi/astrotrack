package com.astrotrack.repository;

import com.astrotrack.model.Observation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ObservationRepository extends JpaRepository<Observation, Long> {
    // Inherits all built-in methods like save(), findAll(), findById()
}