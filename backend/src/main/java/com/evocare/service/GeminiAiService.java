package com.evocare.service;

import com.evocare.entity.*;
import com.evocare.exception.ResourceNotFoundException;
import com.evocare.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

/**
 * Gemini AI integration for generating health insights from patient data.
 * 
 * IMPORTANT: This service generates summaries and recommendations only.
 * It does NOT generate diagnoses. Always displays medical disclaimer.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiAiService {

    private final PatientRepository patientRepository;
    private final ObservationRepository observationRepository;
    private final MedicationRepository medicationRepository;
    private final ClinicalNoteRepository clinicalNoteRepository;

    @Value("${app.gemini.api-key}")
    private String apiKey;

    @Value("${app.gemini.base-url}")
    private String baseUrl;

    private final WebClient webClient = WebClient.builder().build();

    /**
     * Generates an AI health insight for a given patient by aggregating
     * their observations, medications, and clinical notes.
     * 
     * @param patientId the patient to analyze
     * @return structured AI-generated health summary with disclaimer
     */
    public String generateHealthInsight(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        List<Observation> observations = observationRepository.findByPatientOrderByCreatedAtDesc(patient);
        List<Medication> medications = medicationRepository.findByPatient(patient);
        List<ClinicalNote> notes = clinicalNoteRepository.findByPatientOrderByCreatedAtDesc(patient);

        String prompt = buildPrompt(patient, observations, medications, notes);
        return callGeminiApi(prompt);
    }

    /**
     * Constructs a structured prompt for Gemini with patient context.
     */
    private String buildPrompt(Patient patient, List<Observation> observations,
                                List<Medication> medications, List<ClinicalNote> notes) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are an AI health assistant for a healthcare management platform. ");
        sb.append("IMPORTANT: You must NOT provide diagnoses. Only provide observations, ");
        sb.append("risk indicators, and recommended follow-up questions.\n\n");

        sb.append("=== PATIENT INFORMATION ===\n");
        sb.append("Name: ").append(patient.getFullName()).append("\n");
        sb.append("Age: ").append(patient.getAge()).append("\n");
        sb.append("Gender: ").append(patient.getGender()).append("\n");
        sb.append("Blood Group: ").append(patient.getBloodGroup()).append("\n");
        if (patient.getMedicalHistory() != null) {
            sb.append("Medical History: ").append(patient.getMedicalHistory()).append("\n");
        }

        sb.append("\n=== RECENT OBSERVATIONS (from caregivers) ===\n");
        if (observations.isEmpty()) {
            sb.append("No observations recorded.\n");
        } else {
            observations.stream().limit(10).forEach(obs -> {
                sb.append("- [").append(obs.getSeverity()).append("] ")
                  .append(obs.getSymptom());
                if (obs.getNotes() != null) sb.append(": ").append(obs.getNotes());
                sb.append(" (").append(obs.getCreatedAt().toLocalDate()).append(")\n");
            });
        }

        sb.append("\n=== CURRENT MEDICATIONS ===\n");
        if (medications.isEmpty()) {
            sb.append("No medications recorded.\n");
        } else {
            medications.forEach(med -> {
                sb.append("- ").append(med.getMedicineName())
                  .append(" | Dosage: ").append(med.getDosage())
                  .append(" | Frequency: ").append(med.getFrequency()).append("\n");
            });
        }

        sb.append("\n=== CLINICAL NOTES (from doctors) ===\n");
        if (notes.isEmpty()) {
            sb.append("No clinical notes recorded.\n");
        } else {
            notes.stream().limit(5).forEach(note -> {
                sb.append("- ").append(note.getNote())
                  .append(" (").append(note.getCreatedAt().toLocalDate()).append(")\n");
            });
        }

        sb.append("\n=== REQUIRED OUTPUT FORMAT ===\n");
        sb.append("Please provide a structured health summary in the following format:\n\n");
        sb.append("**HEALTH SUMMARY**\n");
        sb.append("A brief 3-4 sentence summary of the patient's current health status based on available data.\n\n");
        sb.append("**OBSERVED RISK INDICATORS**\n");
        sb.append("List any patterns or risk factors observed (NOT diagnoses).\n\n");
        sb.append("**MISSING INFORMATION**\n");
        sb.append("List any important health data that appears to be missing.\n\n");
        sb.append("**RECOMMENDED FOLLOW-UP QUESTIONS**\n");
        sb.append("List 3-5 questions healthcare providers should consider asking.\n\n");
        sb.append("**MEDICATION NOTES**\n");
        sb.append("Any observations about the current medication regimen.\n\n");
        sb.append("Remember: Do NOT provide diagnoses. Use phrases like 'may indicate', 'worth investigating', etc.");

        return sb.toString();
    }

    /**
     * Calls the Gemini API via WebClient (reactive HTTP).
     */
    private String callGeminiApi(String prompt) {
        try {
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(
                        Map.of("text", prompt)
                    ))
                ),
                "generationConfig", Map.of(
                    "temperature", 0.3,
                    "maxOutputTokens", 1500
                )
            );

            Map<?, ?> response = webClient.post()
                .uri(baseUrl + "?key=" + apiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

            if (response != null) {
                List<?> candidates = (List<?>) response.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<?, ?> candidate = (Map<?, ?>) candidates.get(0);
                    Map<?, ?> content = (Map<?, ?>) candidate.get("content");
                    List<?> parts = (List<?>) content.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        Map<?, ?> part = (Map<?, ?>) parts.get(0);
                        return (String) part.get("text");
                    }
                }
            }
            return "Unable to generate insights at this time. Please try again later.";
        } catch (Exception e) {
            log.error("Gemini API call failed: {}", e.getMessage());
            return "AI service is temporarily unavailable. Please configure your Gemini API key.\n\n" +
                   "Error: " + e.getMessage();
        }
    }
}
