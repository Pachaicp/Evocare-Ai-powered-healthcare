package com.evocare.service;

import com.evocare.entity.Patient;
import com.evocare.entity.User;
import com.evocare.exception.BadRequestException;
import com.evocare.exception.ResourceNotFoundException;
import com.evocare.repository.PatientRepository;
import com.evocare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service for patient record management, search, and assignment.
 */
@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public Page<Patient> getAllPatients(Pageable pageable) {
        return patientRepository.findAll(pageable);
    }

    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
    }

    public Patient getPatientByCode(String code) {
        return patientRepository.findByPatientCode(code)
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found with code: " + code));
    }

    public List<Patient> getPatientsByDoctor(Long doctorId) {
        User doctor = userRepository.findById(doctorId)
            .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        return patientRepository.findByDoctor(doctor);
    }

    public List<Patient> getPatientsByCaregiver(Long caregiverId) {
        User caregiver = userRepository.findById(caregiverId)
            .orElseThrow(() -> new ResourceNotFoundException("Caregiver not found"));
        return patientRepository.findByCaregiver(caregiver);
    }

    public Patient getPatientByUser(User user) {
        return patientRepository.findByUser(user)
            .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found for this user"));
    }

    public Page<Patient> searchPatients(String query, Pageable pageable) {
        return patientRepository.searchPatients(query, pageable);
    }

    @Transactional
    public Patient createPatient(Patient patient, User createdBy) {
        // Generate sequential patient code PAT-100X
        long count = patientRepository.count() + 1001;
        patient.setPatientCode("PAT-" + count);
        Patient saved = patientRepository.save(patient);
        auditLogService.log(createdBy, "PATIENT_CREATED", "Patient", saved.getId(), "Patient record created");
        return saved;
    }

    @Transactional
    public Patient updatePatient(Long id, Patient updates, User updatedBy) {
        Patient patient = getPatientById(id);
        if (updates.getFullName() != null) patient.setFullName(updates.getFullName());
        if (updates.getAge() != null) patient.setAge(updates.getAge());
        if (updates.getGender() != null) patient.setGender(updates.getGender());
        if (updates.getBloodGroup() != null) patient.setBloodGroup(updates.getBloodGroup());
        if (updates.getAddress() != null) patient.setAddress(updates.getAddress());
        if (updates.getEmergencyContact() != null) patient.setEmergencyContact(updates.getEmergencyContact());
        if (updates.getMedicalHistory() != null) patient.setMedicalHistory(updates.getMedicalHistory());

        Patient saved = patientRepository.save(patient);
        auditLogService.log(updatedBy, "PATIENT_UPDATED", "Patient", saved.getId(), "Patient record updated");
        return saved;
    }

    @Transactional
    public Patient assignStaff(Long patientId, Long doctorId, Long caregiverId, User admin) {
        Patient patient = getPatientById(patientId);
        if (doctorId != null) {
            User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
            patient.setDoctor(doctor);
        }
        if (caregiverId != null) {
            User caregiver = userRepository.findById(caregiverId)
                .orElseThrow(() -> new ResourceNotFoundException("Caregiver not found"));
            patient.setCaregiver(caregiver);
        }
        Patient saved = patientRepository.save(patient);
        auditLogService.log(admin, "PATIENT_ASSIGNED", "Patient", saved.getId(), "Staff assigned to patient");
        return saved;
    }
}
