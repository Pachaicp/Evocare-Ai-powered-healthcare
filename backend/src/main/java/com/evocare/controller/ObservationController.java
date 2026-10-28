package com.evocare.controller;

import com.evocare.dto.ApiResponse;
import com.evocare.dto.ObservationRequest;
import com.evocare.entity.Observation;
import com.evocare.entity.User;
import com.evocare.repository.UserRepository;
import com.evocare.service.ObservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/observations")
@RequiredArgsConstructor
public class ObservationController {

    private final ObservationService observationService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<Observation>> add(
            @Valid @RequestBody ObservationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User caregiver = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.success("Observation recorded",
            observationService.addObservation(request, caregiver)));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<Page<Observation>>> getByPatient(
            @PathVariable Long patientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success("Observations fetched",
            observationService.getObservationsByPatient(patientId, PageRequest.of(page, size))));
    }

    @GetMapping("/patient/{patientId}/all")
    public ResponseEntity<ApiResponse<List<Observation>>> getAllByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(ApiResponse.success("Observations fetched",
            observationService.getAllObservationsByPatient(patientId)));
    }

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<Observation>>> getRecent() {
        return ResponseEntity.ok(ApiResponse.success("Recent observations",
            observationService.getRecentObservations()));
    }
}
