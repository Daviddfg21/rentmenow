package com.rentmenow.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "rentals")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rental {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "property_id", nullable = false)
	private Property property;

	@ManyToOne
	@JoinColumn(name = "tenant_id", nullable = false)
	private User tenant;

	@Column(name = "start_date", nullable = false)
	private LocalDate startDate;

	@Column(name = "end_date", nullable = false)
	private LocalDate endDate;

	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal monthlyRent;

	@Column(nullable = false)
	private String status = "ACTIVE"; // ACTIVE, TERMINATED, PENDING

	@Column(name = "created_at")
	private LocalDateTime createdAt = LocalDateTime.now();

	@OneToMany(mappedBy = "rental", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<Payment> payments;
}