package com.astrotrack.repository;

import com.astrotrack.model.Observation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ObservationRepository extends JpaRepository<Observation, Long> {

    List<Observation> findByUserId(Long userId);

    List<Observation> findByIsPublicTrue();

    Page<Observation> findByIsPublicTrueOrderByObservedAtDesc(
            Pageable pageable
    );
}