package com.evocare.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Patient entity storing medical and personal information.
 */
@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 20)
    private String patientCode;

    @Column(nullable = false, length = 150)
    private String fullName;

    private Integer age;

    @Column(length = 10)
    private String gender;

    @Column(length = 5)
    private String bloodGroup;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 20)
    private String emergencyContact;

    @Column(columnDefinition = "TEXT")
    private String medicalHistory;

    /** The user account linked to this patient (ROLE_PATIENT) */
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    /** Assigned doctor */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id")
    private User doctor;

    /** Assigned caregiver */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "caregiver_id")
    private User caregiver;
}
