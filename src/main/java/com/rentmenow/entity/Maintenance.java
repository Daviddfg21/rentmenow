package com.rentmenow.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Maintenance {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "property_id", nullable = false)
	private Property property;

	@Column(nullable = false)
	private String title;

	@Column(columnDefinition = "TEXT")
	private String description;

	@Column(precision = 10, scale = 2)
	private BigDecimal cost;

	@Column(nullable = false)
	private String status = "PENDING"; // PENDING, IN_PROGRESS, COMPLETED

	@Column(name = "created_at")
	private LocalDateTime createdAt = LocalDateTime.now();
}