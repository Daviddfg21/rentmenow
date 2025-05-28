package com.rentmenow.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entidad Payment - Representa pagos realizados para estadísticas
 */
@Entity
@Table(name = "payments")
@EntityListeners(AuditingEntityListener.class)
public class Payment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "rental_id", nullable = false)
	@JsonBackReference("rental-payments")
	private Rental rental;

	@NotNull
	@DecimalMin(value = "0.0")
	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal amount;

	@NotNull
	@Column(nullable = false)
	private LocalDate paymentDate;

	@NotNull
	@Column(nullable = false)
	private LocalDate dueDate; // Fecha de vencimiento

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PaymentType type;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PaymentStatus status = PaymentStatus.PAID;

	@Column(columnDefinition = "TEXT")
	private String notes;

	@CreatedDate
	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@LastModifiedDate
	private LocalDateTime updatedAt;

	// Enums
	public enum PaymentType {
		RENT, // Alquiler mensual
		DEPOSIT, // Fianza
		UTILITIES, // Servicios
		OTHER // Otros
	}

	public enum PaymentStatus {
		PAID, // Pagado
		PENDING, // Pendiente
		OVERDUE, // Vencido
		CANCELLED // Cancelado
	}

	// Constructores
	public Payment() {
	}

	public Payment(Rental rental, BigDecimal amount, LocalDate paymentDate, LocalDate dueDate, PaymentType type) {
		this.rental = rental;
		this.amount = amount;
		this.paymentDate = paymentDate;
		this.dueDate = dueDate;
		this.type = type;
	}

	// Getters y Setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Rental getRental() {
		return rental;
	}

	public void setRental(Rental rental) {
		this.rental = rental;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public LocalDate getPaymentDate() {
		return paymentDate;
	}

	public void setPaymentDate(LocalDate paymentDate) {
		this.paymentDate = paymentDate;
	}

	public LocalDate getDueDate() {
		return dueDate;
	}

	public void setDueDate(LocalDate dueDate) {
		this.dueDate = dueDate;
	}

	public PaymentType getType() {
		return type;
	}

	public void setType(PaymentType type) {
		this.type = type;
	}

	public PaymentStatus getStatus() {
		return status;
	}

	public void setStatus(PaymentStatus status) {
		this.status = status;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	@Override
	public String toString() {
		return "Payment{" + "id=" + id + ", amount=" + amount + ", paymentDate=" + paymentDate + ", type=" + type
				+ ", status=" + status + '}';
	}
}