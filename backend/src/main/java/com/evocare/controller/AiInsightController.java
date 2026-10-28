package com.evocare.controller;

import com.evocare.dto.ApiResponse;
import com.evocare.service.GeminiAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * AI Insights controller — invokes Gemini to generate health summaries.
 * Returns disclaimer with every response.
 */
@RestController
@RequestMapping("/ai-insights")
@RequiredArgsConstructor
public class AiInsightController {

    private final GeminiAiService geminiAiService;

    private static final String DISCLAIMER =
        "⚠️ DISCLAIMER: This information is AI-generated and should not replace " +
        "professional medical advice. Always consult a qualified healthcare provider. " +
        "AI assists. Doctors decide.";

    @PostMapping("/generate/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PATIENT')")
    public ResponseEntity<ApiResponse<Map<String, String>>> generate(@PathVariable Long patientId) {
        String insight = geminiAiService.generateHealthInsight(patientId);
        Map<String, String> response = Map.of(
            "insight", insight,
            "disclaimer", DISCLAIMER
        );
        return ResponseEntity.ok(ApiResponse.success("AI insight generated", response));
    }
}
