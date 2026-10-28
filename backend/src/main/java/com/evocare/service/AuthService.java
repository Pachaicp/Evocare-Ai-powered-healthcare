package com.evocare.service;

import com.evocare.dto.AuthResponse;
import com.evocare.dto.LoginRequest;
import com.evocare.dto.RegisterRequest;
import com.evocare.entity.User;
import com.evocare.exception.BadRequestException;
import com.evocare.repository.UserRepository;
import com.evocare.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Handles user registration, login, and JWT token management.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final com.evocare.repository.PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final AuditLogService auditLogService;

    /**
     * Registers a new user account.
     * @return JWT token pair + user info
     */
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        User.Role role = (request.getRole() != null) ? request.getRole() : User.Role.ROLE_PATIENT;

        User user = User.builder()
            .name(request.getName())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(role)
            .active(true)
            .build();

        User saved = userRepository.save(user);

        if (role == User.Role.ROLE_PATIENT) {
            com.evocare.entity.Patient patient = com.evocare.entity.Patient.builder()
                .user(saved)
                .fullName(saved.getName())
                .patientCode("PAT-" + (1000 + (saved.getId() != null ? saved.getId() : System.currentTimeMillis() % 9000)))
                .age(65)
                .gender("Unspecified")
                .medicalHistory("Registered user profile")
                .build();
            patientRepository.save(patient);
        }

        auditLogService.log(saved, "USER_REGISTERED", "User", saved.getId(), "New user registered");

        UserDetails userDetails = userDetailsService.loadUserByUsername(saved.getEmail());
        return buildAuthResponse(saved, userDetails);
    }

    /**
     * Authenticates user credentials and returns JWT tokens.
     */
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new BadRequestException("User not found"));
        auditLogService.log(user, "USER_LOGIN", "User", user.getId(), "User logged in");

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        return buildAuthResponse(user, userDetails);
    }

    /**
     * Generates a new access token from a valid refresh token.
     */
    public AuthResponse refreshToken(String refreshToken) {
        String email = jwtUtil.extractUsername(refreshToken);
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new BadRequestException("User not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        if (!jwtUtil.isTokenValid(refreshToken, userDetails)) {
            throw new BadRequestException("Invalid or expired refresh token");
        }

        return buildAuthResponse(user, userDetails);
    }

    private AuthResponse buildAuthResponse(User user, UserDetails userDetails) {
        return AuthResponse.builder()
            .accessToken(jwtUtil.generateToken(userDetails))
            .refreshToken(jwtUtil.generateRefreshToken(userDetails))
            .tokenType("Bearer")
            .userId(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .role(user.getRole())
            .build();
    }
}
