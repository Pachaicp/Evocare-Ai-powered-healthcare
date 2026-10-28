package com.evocare.dto;

import com.evocare.entity.Observation;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/** DTO for creating a new observation */
@Data
public class ObservationRequest {
    @NotNull(message = "Patient ID is required")
    private Long patientId;

    @NotBlank(message = "Symptom is required")
    private String symptom;

    @NotNull(message = "Severity is required")
    private Observation.Severity severity;

    private String notes;
}
