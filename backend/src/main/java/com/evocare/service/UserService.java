package com.evocare.service;

import com.evocare.dto.DashboardStatsDto;
import com.evocare.entity.Patient;
import com.evocare.entity.User;
import com.evocare.exception.BadRequestException;
import com.evocare.exception.ResourceNotFoundException;
import com.evocare.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service for user management and admin dashboard statistics.
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final ObservationRepository observationRepository;
    private final MedicalReportRepository reportRepository;
    private final PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Page<User> getUsersPaged(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @Transactional
    public User toggleUserStatus(Long id) {
        User user = getUserById(id);
        user.setActive(!user.isActive());
        return userRepository.save(user);
    }

    @Transactional
    public User updateUserRole(Long id, User.Role role) {
        User user = getUserById(id);
        user.setRole(role);
        return userRepository.save(user);
    }

    public DashboardStatsDto getDashboardStats() {
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        return DashboardStatsDto.builder()
            .totalPatients(patientRepository.count())
            .totalDoctors(userRepository.countByRole(User.Role.ROLE_DOCTOR))
            .totalCaregivers(userRepository.countByRole(User.Role.ROLE_CAREGIVER))
            .totalUsers(userRepository.count())
            .observationsThisMonth(observationRepository.countObservationsThisMonth(startOfMonth))
            .totalReports(reportRepository.count())
            .build();
    }
}
