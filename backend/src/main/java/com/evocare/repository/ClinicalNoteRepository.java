package com.evocare.repository;

import com.evocare.entity.ClinicalNote;
import com.evocare.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClinicalNoteRepository extends JpaRepository<ClinicalNote, Long> {
    List<ClinicalNote> findByPatientOrderByCreatedAtDesc(Patient patient);
}
