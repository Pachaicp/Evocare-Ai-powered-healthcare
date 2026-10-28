package com.evocare.controller;

import com.evocare.dto.ApiResponse;
import com.evocare.dto.ClinicalNoteRequest;
import com.evocare.entity.ClinicalNote;
import com.evocare.entity.User;
import com.evocare.repository.UserRepository;
import com.evocare.service.ClinicalNoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clinical-notes")
@RequiredArgsConstructor
public class ClinicalNoteController {

    private final ClinicalNoteService clinicalNoteService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<ClinicalNote>> add(
            @Valid @RequestBody ClinicalNoteRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User doctor = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.success("Clinical note added",
            clinicalNoteService.addNote(request, doctor)));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<ClinicalNote>>> getByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(ApiResponse.success("Notes fetched",
            clinicalNoteService.getNotesByPatient(patientId)));
    }
}
