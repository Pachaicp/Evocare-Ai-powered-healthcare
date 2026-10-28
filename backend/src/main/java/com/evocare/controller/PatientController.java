package com.evocare.controller;

import com.evocare.dto.ApiResponse;
import com.evocare.entity.Patient;
import com.evocare.entity.User;
import com.evocare.repository.UserRepository;
import com.evocare.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Patient management REST controller.
 */
@RestController
@RequestMapping("/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Patient>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success("Patients fetched",
            patientService.getAllPatients(PageRequest.of(page, size, Sort.by("fullName")))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Patient>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Patient fetched",
            patientService.getPatientById(id)));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<ApiResponse<Patient>> getByCode(@PathVariable String code) {
        return ResponseEntity.ok(ApiResponse.success("Patient fetched",
            patientService.getPatientByCode(code)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<Patient>>> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success("Search results",
            patientService.searchPatients(q, PageRequest.of(page, size))));
    }

    @GetMapping("/by-doctor/{doctorId}")
    public ResponseEntity<ApiResponse<List<Patient>>> getByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(ApiResponse.success("Patients fetched",
            patientService.getPatientsByDoctor(doctorId)));
    }

    @GetMapping("/by-caregiver/{caregiverId}")
    public ResponseEntity<ApiResponse<List<Patient>>> getByCaregiver(@PathVariable Long caregiverId) {
        return ResponseEntity.ok(ApiResponse.success("Patients fetched",
            patientService.getPatientsByCaregiver(caregiverId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Patient>> create(
            @RequestBody Patient patient,
            @AuthenticationPrincipal UserDetails userDetails) {
        User creator = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.success("Patient created",
            patientService.createPatient(patient, creator)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Patient>> update(
            @PathVariable Long id,
            @RequestBody Patient updates,
            @AuthenticationPrincipal UserDetails userDetails) {
        User updater = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.success("Patient updated",
            patientService.updatePatient(id, updates, updater)));
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<Patient>> assign(
            @PathVariable Long id,
            @RequestBody Map<String, Long> assignment,
            @AuthenticationPrincipal UserDetails userDetails) {
        User admin = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.success("Staff assigned",
            patientService.assignStaff(id, assignment.get("doctorId"), assignment.get("caregiverId"), admin)));
    }
}
