package com.evocare.repository;

import com.evocare.entity.Observation;
import com.evocare.entity.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ObservationRepository extends JpaRepository<Observation, Long> {
    Page<Observation> findByPatientOrderByCreatedAtDesc(Patient patient, Pageable pageable);
    List<Observation> findByPatientOrderByCreatedAtDesc(Patient patient);

    @Query("SELECT COUNT(o) FROM Observation o WHERE o.createdAt >= :startOfMonth")
    long countObservationsThisMonth(LocalDateTime startOfMonth);

    List<Observation> findTop5ByOrderByCreatedAtDesc();
}
