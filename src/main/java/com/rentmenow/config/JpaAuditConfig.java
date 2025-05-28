package com.rentmenow.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Configuración para habilitar JPA Auditing Necesario para que
 * funcionen @CreatedDate y @LastModifiedDate
 */
@Configuration
@EnableJpaAuditing
public class JpaAuditConfig {
	// Esta clase solo necesita las anotaciones
	// Spring Boot se encarga del resto automáticamente
}