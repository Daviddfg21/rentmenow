package com.rentmenow.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.time.LocalDateTime;

/**
 * Entidad Booking - Representa reservas/consultas iniciales sobre propiedades
 */
@Entity
@Table(name = "bookings")
@EntityListeners(AuditingEntityListener.class)
public class Booking {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "property_id", nullable = false)
	@JsonBackReference("property-bookings")
	private Property property;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = true) // Puede ser null si no está registrado
	@JsonBackReference("user-bookings")
	private User user;

	// Campos para usuarios no registrados
	@NotBlank
	@Size(max = 100)
	@Column(nullable = false)
	private String contactName;

	@NotBlank
	@Email
	@Column(nullable = false)
	private String contactEmail;

	@Column(length = 15)
	private String contactPhone;

	@Column(columnDefinition = "TEXT")
	private String message;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private BookingStatus status = BookingStatus.PENDING;

	@Column
	private LocalDateTime preferredVisitDate;

	@CreatedDate
	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@LastModifiedDate
	private LocalDateTime updatedAt;

	// Enum para estado de la reserva
	public enum BookingStatus {
		PENDING, // Pendiente
		CONFIRMED, // Confirmada
		CANCELLED, // Cancelada
		COMPLETED // Completada (visita realizada)
	}

	// Constructores
	public Booking() {
	}

	public Booking(Property property, String contactName, String contactEmail, String message) {
		this.property = property;
		this.contactName = contactName;
		this.contactEmail = contactEmail;
		this.message = message;
	}

	public Booking(Property property, User user, String message) {
		this.property = property;
		this.user = user;
		this.contactName = user.getFullName();
		this.contactEmail = user.getEmail();
		this.contactPhone = user.getPhone();
		this.message = message;
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

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getContactName() {
		return contactName;
	}

	public void setContactName(String contactName) {
		this.contactName = contactName;
	}

	public String getContactEmail() {
		return contactEmail;
	}

	public void setContactEmail(String contactEmail) {
		this.contactEmail = contactEmail;
	}

	public String getContactPhone() {
		return contactPhone;
	}

	public void setContactPhone(String contactPhone) {
		this.contactPhone = contactPhone;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public BookingStatus getStatus() {
		return status;
	}

	public void setStatus(BookingStatus status) {
		this.status = status;
	}

	public LocalDateTime getPreferredVisitDate() {
		return preferredVisitDate;
	}

	public void setPreferredVisitDate(LocalDateTime preferredVisitDate) {
		this.preferredVisitDate = preferredVisitDate;
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
		return "Booking{" + "id=" + id + ", contactName='" + contactName + '\'' + ", contactEmail='" + contactEmail
				+ '\'' + ", status=" + status + ", createdAt=" + createdAt + '}';
	}
}