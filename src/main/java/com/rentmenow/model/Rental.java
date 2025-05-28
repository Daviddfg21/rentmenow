package com.rentmenow.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad Rental - Representa contratos de alquiler activos
 */
@Entity
@Table(name = "rentals")
@EntityListeners(AuditingEntityListener.class)
public class Rental {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "property_id", nullable = false)
	@JsonBackReference("property-rentals")
	private Property property;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "tenant_id", nullable = false)
	@JsonBackReference("tenant-rentals")
	private User tenant;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "landlord_id", nullable = false)
	@JsonBackReference("landlord-rentals")
	private User landlord;

	@NotNull
	@Column(nullable = false)
	private LocalDate startDate;

	@NotNull
	@Column(nullable = false)
	private LocalDate endDate;

	@NotNull
	@DecimalMin(value = "0.0")
	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal monthlyRent;

	@DecimalMin(value = "0.0")
	@Column(precision = 10, scale = 2)
	private BigDecimal deposit;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private RentalStatus status = RentalStatus.ACTIVE;

	@Column(columnDefinition = "TEXT")
	private String terms; // Condiciones del contrato

	@CreatedDate
	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@LastModifiedDate
	private LocalDateTime updatedAt;

	// Relaciones
	@OneToMany(mappedBy = "rental", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JsonManagedReference("rental-payments")
	private List<Payment> payments = new ArrayList<>();

	// Enum para estado del contrato
	public enum RentalStatus {
		ACTIVE, // Activo
		EXPIRED, // Expirado
		TERMINATED, // Terminado anticipadamente
		PENDING // Pendiente de activación
	}

	// Constructores
	public Rental() {
	}

	public Rental(Property property, User tenant, User landlord, LocalDate startDate, LocalDate endDate,
			BigDecimal monthlyRent) {
		this.property = property;
		this.tenant = tenant;
		this.landlord = landlord;
		this.startDate = startDate;
		this.endDate = endDate;
		this.monthlyRent = monthlyRent;
	}

	// Getters y Setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Property getProperty() {
		return property;
	}

	public void setProperty(Property property) {
		this.property = property;
	}

	public User getTenant() {
		return tenant;
	}

	public void setTenant(User tenant) {
		this.tenant = tenant;
	}

	public User getLandlord() {
		return landlord;
	}

	public void setLandlord(User landlord) {
		this.landlord = landlord;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}

	public BigDecimal getMonthlyRent() {
		return monthlyRent;
	}

	public void setMonthlyRent(BigDecimal monthlyRent) {
		this.monthlyRent = monthlyRent;
	}

	public BigDecimal getDeposit() {
		return deposit;
	}

	public void setDeposit(BigDecimal deposit) {
		this.deposit = deposit;
	}

	public RentalStatus getStatus() {
		return status;
	}

	public void setStatus(RentalStatus status) {
		this.status = status;
	}

	public String getTerms() {
		return terms;
	}

	public void setTerms(String terms) {
		this.terms = terms;
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

	public List<Payment> getPayments() {
		return payments;
	}

	public void setPayments(List<Payment> payments) {
		this.payments = payments;
	}

	@Override
	public String toString() {
		return "Rental{" + "id=" + id + ", startDate=" + startDate + ", endDate=" + endDate + ", monthlyRent="
				+ monthlyRent + ", status=" + status + '}';
	}
}