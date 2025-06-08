package com.rentmenow.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "rental_id", nullable = false)
	private Rental rental;

	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal amount;

	@Column(name = "payment_date", nullable = false)
	private LocalDate paymentDate;

	@Column(nullable = false)
	private String status = "PENDING"; // PENDING, PAID, OVERDUE

	@Column(name = "created_at")
	private LocalDateTime createdAt = LocalDateTime.now();
}