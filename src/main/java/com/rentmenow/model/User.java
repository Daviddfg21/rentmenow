package com.rentmenow.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad Usuario - Maneja propietarios, inquilinos y administradores
 */
@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank
	@Size(min = 3, max = 50)
	@Column(unique = true, nullable = false)
	private String username;

	@NotBlank
	@Email
	@Column(unique = true, nullable = false)
	private String email;

	@NotBlank
	@Size(min = 6)
	@Column(nullable = false)
	private String password;

	@NotBlank
	@Size(max = 100)
	@Column(nullable = false)
	private String fullName;

	@Column(length = 15)
	private String phone;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private UserRole role = UserRole.USER;

	@Column(nullable = false)
	private Boolean active = true;

	@CreatedDate
	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@LastModifiedDate
	private LocalDateTime updatedAt;

	// Relaciones
	@OneToMany(mappedBy = "owner", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JsonManagedReference("user-properties")
	private List<Property> ownedProperties = new ArrayList<>();

	@OneToMany(mappedBy = "tenant", fetch = FetchType.LAZY)
	@JsonManagedReference("tenant-rentals")
	private List<Rental> rentalsAsTenant = new ArrayList<>();

	@OneToMany(mappedBy = "landlord", fetch = FetchType.LAZY)
	@JsonManagedReference("landlord-rentals")
	private List<Rental> rentalsAsLandlord = new ArrayList<>();

	@OneToMany(mappedBy = "sender", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JsonManagedReference("sender-messages")
	private List<Message> sentMessages = new ArrayList<>();

	@OneToMany(mappedBy = "receiver", fetch = FetchType.LAZY)
	@JsonManagedReference("receiver-messages")
	private List<Message> receivedMessages = new ArrayList<>();

	// Enum para roles
	public enum UserRole {
		USER, // Usuario normal (puede ser propietario e inquilino)
		ADMIN // Administrador del sistema
	}

	// Constructores
	public User() {
	}

	public User(String username, String email, String password, String fullName) {
		this.username = username;
		this.email = email;
		this.password = password;
		this.fullName = fullName;
	}

	// Getters y Setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public UserRole getRole() {
		return role;
	}

	public void setRole(UserRole role) {
		this.role = role;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
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

	public List<Property> getOwnedProperties() {
		return ownedProperties;
	}

	public void setOwnedProperties(List<Property> ownedProperties) {
		this.ownedProperties = ownedProperties;
	}

	public List<Rental> getRentalsAsTenant() {
		return rentalsAsTenant;
	}

	public void setRentalsAsTenant(List<Rental> rentalsAsTenant) {
		this.rentalsAsTenant = rentalsAsTenant;
	}

	public List<Rental> getRentalsAsLandlord() {
		return rentalsAsLandlord;
	}

	public void setRentalsAsLandlord(List<Rental> rentalsAsLandlord) {
		this.rentalsAsLandlord = rentalsAsLandlord;
	}

	public List<Message> getSentMessages() {
		return sentMessages;
	}

	public void setSentMessages(List<Message> sentMessages) {
		this.sentMessages = sentMessages;
	}

	public List<Message> getReceivedMessages() {
		return receivedMessages;
	}

	public void setReceivedMessages(List<Message> receivedMessages) {
		this.receivedMessages = receivedMessages;
	}

	@Override
	public String toString() {
		return "User{" + "id=" + id + ", username='" + username + '\'' + ", email='" + email + '\'' + ", fullName='"
				+ fullName + '\'' + ", role=" + role + ", active=" + active + '}';
	}
}