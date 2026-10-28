package com.evocare.repository;

import com.evocare.entity.MedicalReport;
import com.evocare.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalReportRepository extends JpaRepository<MedicalReport, Long> {
    List<MedicalReport> findByPatientOrderByUploadedAtDesc(Patient patient);
    long count();
}
