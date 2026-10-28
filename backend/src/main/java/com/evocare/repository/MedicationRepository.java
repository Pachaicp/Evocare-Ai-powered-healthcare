package com.evocare.repository;

import com.evocare.entity.Medication;
import com.evocare.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicationRepository extends JpaRepository<Medication, Long> {
    List<Medication> findByPatient(Patient patient);
    List<Medication> findByPatientOrderByStartDateDesc(Patient patient);
}
