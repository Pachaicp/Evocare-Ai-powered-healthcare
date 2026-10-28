package com.evocare.service;

import com.evocare.dto.ObservationRequest;
import com.evocare.entity.Observation;
import com.evocare.entity.Patient;
import com.evocare.entity.User;
import com.evocare.exception.ResourceNotFoundException;
import com.evocare.repository.ObservationRepository;
import com.evocare.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ObservationService {

    private final ObservationRepository observationRepository;
    private final PatientRepository patientRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public Observation addObservation(ObservationRequest req, User caregiver) {
        Patient patient = patientRepository.findById(req.getPatientId())
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        Observation obs = Observation.builder()
            .patient(patient)
            .caregiver(caregiver)
            .symptom(req.getSymptom())
            .severity(req.getSeverity())
            .notes(req.getNotes())
            .build();

        Observation saved = observationRepository.save(obs);
        auditLogService.log(caregiver, "OBSERVATION_ADDED", "Observation", saved.getId(),
            "Observation added for patient: " + patient.getPatientCode());
        return saved;
    }

    public Page<Observation> getObservationsByPatient(Long patientId, Pageable pageable) {
        Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        return observationRepository.findByPatientOrderByCreatedAtDesc(patient, pageable);
    }

    public List<Observation> getAllObservationsByPatient(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        return observationRepository.findByPatientOrderByCreatedAtDesc(patient);
    }

    public List<Observation> getRecentObservations() {
        return observationRepository.findTop5ByOrderByCreatedAtDesc();
    }
}
