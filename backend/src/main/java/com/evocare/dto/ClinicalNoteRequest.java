package com.evocare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/** DTO for creating a clinical note */
@Data
public class ClinicalNoteRequest {
    @NotNull(message = "Patient ID is required")
    private Long patientId;

    @NotBlank(message = "Note content is required")
    private String note;

    private String visitType;
}
