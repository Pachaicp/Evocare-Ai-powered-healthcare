package com.evocare.service;

import com.evocare.dto.ClinicalNoteRequest;
import com.evocare.entity.ClinicalNote;
import com.evocare.entity.Patient;
import com.evocare.entity.User;
import com.evocare.exception.ResourceNotFoundException;
import com.evocare.repository.ClinicalNoteRepository;
import com.evocare.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClinicalNoteService {

    private final ClinicalNoteRepository clinicalNoteRepository;
    private final PatientRepository patientRepository;

    @Transactional
    public ClinicalNote addNote(ClinicalNoteRequest req, User doctor) {
        Patient patient = patientRepository.findById(req.getPatientId())
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        ClinicalNote note = ClinicalNote.builder()
            .doctor(doctor)
            .patient(patient)
            .note(req.getNote())
            .visitType(req.getVisitType())
            .build();

        return clinicalNoteRepository.save(note);
    }

    public List<ClinicalNote> getNotesByPatient(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        return clinicalNoteRepository.findByPatientOrderByCreatedAtDesc(patient);
    }
}
