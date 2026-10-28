package com.evocare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Stats DTO for admin dashboard */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    private long totalPatients;
    private long totalDoctors;
    private long totalCaregivers;
    private long totalUsers;
    private long observationsThisMonth;
    private long totalReports;
}
