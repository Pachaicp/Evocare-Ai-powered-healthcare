package com.evocare.service;

import com.evocare.dto.MedicationRequest;
import com.evocare.entity.Medication;
import com.evocare.entity.Patient;
import com.evocare.entity.User;
import com.evocare.exception.ResourceNotFoundException;
import com.evocare.repository.MedicationRepository;
import com.evocare.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicationService {

    private final MedicationRepository medicationRepository;
    private final PatientRepository patientRepository;

    @Transactional
    public Medication addMedication(MedicationRequest req, User prescribedBy) {
        Patient patient = patientRepository.findById(req.getPatientId())
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        Medication med = Medication.builder()
            .patient(patient)
            .medicineName(req.getMedicineName())
            .dosage(req.getDosage())
            .frequency(req.getFrequency())
            .startDate(req.getStartDate())
            .endDate(req.getEndDate())
            .instructions(req.getInstructions())
            .prescribedBy(prescribedBy)
            .build();

        return medicationRepository.save(med);
    }

    public List<Medication> getMedicationsByPatient(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        return medicationRepository.findByPatientOrderByStartDateDesc(patient);
    }

    @Transactional
    public void deleteMedication(Long id) {
        if (!medicationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Medication not found with id: " + id);
        }
        medicationRepository.deleteById(id);
    }
}
