package com.evocare.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Enables async support for audit logging and other background tasks.
 */
@Configuration
@EnableAsync
public class AsyncConfig {
}
