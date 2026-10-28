package com.evocare.controller;

import com.evocare.dto.ApiResponse;
import com.evocare.entity.MedicalReport;
import com.evocare.entity.User;
import com.evocare.repository.UserRepository;
import com.evocare.service.MedicalReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class MedicalReportController {

    private final MedicalReportService reportService;
    private final UserRepository userRepository;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<MedicalReport>> upload(
            @RequestParam Long patientId,
            @RequestParam MultipartFile file,
            @RequestParam(required = false) String reportType,
            @RequestParam(required = false) String description,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        User uploader = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.success("Report uploaded",
            reportService.uploadReport(patientId, file, reportType, description, uploader)));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<MedicalReport>>> getByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(ApiResponse.success("Reports fetched",
            reportService.getReportsByPatient(patientId)));
    }
}
