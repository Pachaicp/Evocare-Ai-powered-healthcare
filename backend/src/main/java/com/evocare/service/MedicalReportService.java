package com.evocare.service;

import com.evocare.entity.MedicalReport;
import com.evocare.entity.Patient;
import com.evocare.entity.User;
import com.evocare.exception.ResourceNotFoundException;
import com.evocare.repository.MedicalReportRepository;
import com.evocare.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

/**
 * Handles file upload and medical report tracking.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MedicalReportService {

    private final MedicalReportRepository reportRepository;
    private final PatientRepository patientRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Transactional
    public MedicalReport uploadReport(
            Long patientId,
            MultipartFile file,
            String reportType,
            String description,
            User uploadedBy
    ) throws IOException {
        Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        // Create upload directory if needed
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Save file with unique name
        String originalName = file.getOriginalFilename();
        String extension = (originalName != null && originalName.contains("."))
            ? originalName.substring(originalName.lastIndexOf(".")) : "";
        String uniqueName = UUID.randomUUID().toString() + extension;
        Path filePath = uploadPath.resolve(uniqueName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        MedicalReport report = MedicalReport.builder()
            .patient(patient)
            .fileName(originalName)
            .fileUrl("/uploads/" + uniqueName)
            .reportType(reportType)
            .description(description)
            .uploadedBy(uploadedBy)
            .build();

        return reportRepository.save(report);
    }

    public List<MedicalReport> getReportsByPatient(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        return reportRepository.findByPatientOrderByUploadedAtDesc(patient);
    }
}
