package com.evocare.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Clinical note written by a Doctor for a Patient visit.
 */
@Entity
@Table(name = "clinical_notes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClinicalNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private User doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String note;

    @Column(length = 100)
    private String visitType;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
