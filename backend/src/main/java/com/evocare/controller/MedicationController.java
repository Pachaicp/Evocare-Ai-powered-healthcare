package com.evocare.controller;

import com.evocare.dto.ApiResponse;
import com.evocare.dto.MedicationRequest;
import com.evocare.entity.Medication;
import com.evocare.entity.User;
import com.evocare.repository.UserRepository;
import com.evocare.service.MedicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medications")
@RequiredArgsConstructor
public class MedicationController {

    private final MedicationService medicationService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<Medication>> add(
            @Valid @RequestBody MedicationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User prescribedBy = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.success("Medication added",
            medicationService.addMedication(request, prescribedBy)));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<Medication>>> getByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(ApiResponse.success("Medications fetched",
            medicationService.getMedicationsByPatient(patientId)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        medicationService.deleteMedication(id);
        return ResponseEntity.ok(ApiResponse.success("Medication deleted", null));
    }
}
