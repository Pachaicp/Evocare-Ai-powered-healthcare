package com.evocare.config;

import com.evocare.entity.*;
import com.evocare.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

/**
 * Seeds the database with demo data on first startup.
 * Only runs if no users exist.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final ObservationRepository observationRepository;
    private final MedicationRepository medicationRepository;
    private final ClinicalNoteRepository clinicalNoteRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping.");
            return;
        }

        log.info("Seeding database with demo data...");

        // Create Admin
        User admin = userRepository.save(User.builder()
            .name("System Admin")
            .email("admin@evocare.com")
            .password(passwordEncoder.encode("Admin@123"))
            .role(User.Role.ROLE_ADMIN)
            .active(true)
            .build());

        // Create Doctor
        User doctor = userRepository.save(User.builder()
            .name("Dr. Priya Sharma")
            .email("doctor@evocare.com")
            .password(passwordEncoder.encode("Doctor@123"))
            .role(User.Role.ROLE_DOCTOR)
            .active(true)
            .build());

        // Create Caregiver
        User caregiver = userRepository.save(User.builder()
            .name("Ravi Caregiver")
            .email("caregiver@evocare.com")
            .password(passwordEncoder.encode("Care@123"))
            .role(User.Role.ROLE_CAREGIVER)
            .active(true)
            .build());

        // Create Patient User
        User patientUser = userRepository.save(User.builder()
            .name("Arjun Mehta")
            .email("patient@evocare.com")
            .password(passwordEncoder.encode("Patient@123"))
            .role(User.Role.ROLE_PATIENT)
            .active(true)
            .build());

        // Create Patient Record
        Patient patient = patientRepository.save(Patient.builder()
            .patientCode("PAT-DEMO001")
            .fullName("Arjun Mehta")
            .age(72)
            .gender("Male")
            .bloodGroup("O+")
            .address("42, Green Park, New Delhi, India - 110016")
            .emergencyContact("+91-9876543210")
            .medicalHistory("Hypertension (2018), Type 2 Diabetes (2020), Mild Arthritis (2022)")
            .user(patientUser)
            .doctor(doctor)
            .caregiver(caregiver)
            .build());

        // Second Patient
        Patient patient2 = patientRepository.save(Patient.builder()
            .patientCode("PAT-DEMO002")
            .fullName("Kamala Nair")
            .age(68)
            .gender("Female")
            .bloodGroup("A+")
            .address("15, MG Road, Bangalore, India - 560001")
            .emergencyContact("+91-9123456789")
            .medicalHistory("Osteoporosis (2019), Mild Cardiac Issues (2021)")
            .doctor(doctor)
            .caregiver(caregiver)
            .build());

        // Seed Observations
        observationRepository.saveAll(List.of(
            Observation.builder()
                .patient(patient)
                .caregiver(caregiver)
                .symptom("Elevated blood pressure")
                .severity(Observation.Severity.HIGH)
                .notes("BP reading: 160/95 mmHg. Patient complains of headache.")
                .build(),
            Observation.builder()
                .patient(patient)
                .caregiver(caregiver)
                .symptom("Mild fatigue")
                .severity(Observation.Severity.MEDIUM)
                .notes("Patient reports tiredness after morning walk. Resting helps.")
                .build(),
            Observation.builder()
                .patient(patient)
                .caregiver(caregiver)
                .symptom("Joint pain in knees")
                .severity(Observation.Severity.LOW)
                .notes("Patient has difficulty climbing stairs. No swelling observed.")
                .build(),
            Observation.builder()
                .patient(patient2)
                .caregiver(caregiver)
                .symptom("Dizziness on standing")
                .severity(Observation.Severity.MEDIUM)
                .notes("Orthostatic hypotension suspected. Encourage slow position changes.")
                .build()
        ));

        // Seed Medications
        medicationRepository.saveAll(List.of(
            Medication.builder()
                .patient(patient)
                .medicineName("Metformin")
                .dosage("500mg")
                .frequency("Twice daily with meals")
                .startDate(LocalDate.now().minusMonths(6))
                .prescribedBy(doctor)
                .instructions("Take with food. Monitor blood sugar regularly.")
                .build(),
            Medication.builder()
                .patient(patient)
                .medicineName("Amlodipine")
                .dosage("5mg")
                .frequency("Once daily in the morning")
                .startDate(LocalDate.now().minusMonths(3))
                .prescribedBy(doctor)
                .instructions("For blood pressure management.")
                .build(),
            Medication.builder()
                .patient(patient2)
                .medicineName("Calcium + Vitamin D3")
                .dosage("500mg + 400IU")
                .frequency("Once daily after lunch")
                .startDate(LocalDate.now().minusMonths(4))
                .prescribedBy(doctor)
                .instructions("For bone health. Take with milk if possible.")
                .build()
        ));

        // Seed Clinical Notes
        clinicalNoteRepository.saveAll(List.of(
            ClinicalNote.builder()
                .doctor(doctor)
                .patient(patient)
                .note("Patient presents with controlled diabetes but slightly elevated BP. " +
                      "Adjusting Amlodipine dosage. Recommending low-sodium diet and daily walks.")
                .visitType("Follow-up")
                .build(),
            ClinicalNote.builder()
                .doctor(doctor)
                .patient(patient)
                .note("Annual health review. HbA1c at 7.2% — acceptable range. " +
                      "Continue current medication. Schedule eye and kidney function tests.")
                .visitType("Annual Checkup")
                .build()
        ));

        log.info("✅ Database seeded successfully!");
        log.info("  → Admin: admin@evocare.com / Admin@123");
        log.info("  → Doctor: doctor@evocare.com / Doctor@123");
        log.info("  → Caregiver: caregiver@evocare.com / Care@123");
        log.info("  → Patient: patient@evocare.com / Patient@123");
    }
}
