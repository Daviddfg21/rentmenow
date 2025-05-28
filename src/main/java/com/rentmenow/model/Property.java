package com.rentmenow.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad Propiedad - Representa las propiedades en alquiler
 */
@Entity
@Table(name = "properties")
@EntityListeners(AuditingEntityListener.class)
public class Property {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank
	@Size(max = 200)
	@Column(nullable = false)
	private String title;

	@Column(columnDefinition = "TEXT")
	private String description;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PropertyType type;

	@NotBlank
	@Column(nullable = false)
	private String address;

	@NotBlank
	@Column(nullable = false)
	private String city;

	@Column(length = 10)
	private String postalCode;

	@NotNull
	@DecimalMin(value = "0.0")
	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal price;

	@Column(nullable = false)
	private Integer bedrooms = 0;

	@Column(nullable = false)
	private Integer bathrooms = 0;

	@DecimalMin(value = "0.0")
	@Column(precision = 8, scale = 2)
	private BigDecimal area; // m²

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PropertyStatus status = PropertyStatus.AVAILABLE;

	@Column(nullable = false)
	private Boolean furnished = false;

	@Column(nullable = false)
	private Boolean petsAllowed = false;

	@Column(nullable = false)
	private Boolean hasGarage = false;

	@CreatedDate
	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@LastModifiedDate
	private LocalDateTime updatedAt;

	// Relaciones
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "owner_id", nullable = false)
	@JsonBackReference("user-properties")
	private User owner;

	@OneToMany(mappedBy = "property", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JsonManagedReference("property-images")
	private List<PropertyImage> images = new ArrayList<>();

	@OneToMany(mappedBy = "property", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JsonManagedReference("property-bookings")
	private List<Booking> bookings = new ArrayList<>();

	@OneToMany(mappedBy = "property", fetch = FetchType.LAZY)
	@JsonManagedReference("property-rentals")
	private List<Rental> rentals = new ArrayList<>();

	// Enums
	public enum PropertyType {
		APARTMENT, // Piso
		HOUSE, // Casa
		STUDIO, // Estudio
		ROOM, // Habitación
		OFFICE, // Oficina
		COMMERCIAL // Local comercial
	}

	public enum PropertyStatus {
		AVAILABLE, // Disponible
		RENTED, // Alquilado
		RESERVED, // Reservado
		MAINTENANCE, // En mantenimiento
		INACTIVE // Inactivo
	}

	// Constructores
	public Property() {
	}

	public Property(String title, String description, PropertyType type, String address, String city, BigDecimal price,
			User owner) {
		this.title = title;
		this.description = description;
		this.type = type;
		this.address = address;
		this.city = city;
		this.price = price;
		this.owner = owner;
	}

	// Getters y Setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public PropertyType getType() {
		return type;
	}

	public void setType(PropertyType type) {
		this.type = type;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getPostalCode() {
		return postalCode;
	}

	public void setPostalCode(String postalCode) {
		this.postalCode = postalCode;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public Integer getBedrooms() {
		return bedrooms;
	}

	public void setBedrooms(Integer bedrooms) {
		this.bedrooms = bedrooms;
	}

	public Integer getBathrooms() {
		return bathrooms;
	}

	public void setBathrooms(Integer bathrooms) {
		this.bathrooms = bathrooms;
	}

	public BigDecimal getArea() {
		return area;
	}

	public void setArea(BigDecimal area) {
		this.area = area;
	}

	public PropertyStatus getStatus() {
		return status;
	}

	public void setStatus(PropertyStatus status) {
		this.status = status;
	}

	public Boolean getFurnished() {
		return furnished;
	}

	public void setFurnished(Boolean furnished) {
		this.furnished = furnished;
	}

	public Boolean getPetsAllowed() {
		return petsAllowed;
	}

	public void setPetsAllowed(Boolean petsAllowed) {
		this.petsAllowed = petsAllowed;
	}

	public Boolean getHasGarage() {
		return hasGarage;
	}

	public void setHasGarage(Boolean hasGarage) {
		this.hasGarage = hasGarage;
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

	public User getOwner() {
		return owner;
	}

	public void setOwner(User owner) {
		this.owner = owner;
	}

	public List<PropertyImage> getImages() {
		return images;
	}

	public void setImages(List<PropertyImage> images) {
		this.images = images;
	}

	public List<Booking> getBookings() {
		return bookings;
	}

	public void setBookings(List<Booking> bookings) {
		this.bookings = bookings;
	}

	public List<Rental> getRentals() {
		return rentals;
	}

	public void setRentals(List<Rental> rentals) {
		this.rentals = rentals;
	}

	@Override
	public String toString() {
		return "Property{" + "id=" + id + ", title='" + title + '\'' + ", type=" + type + ", city='" + city + '\''
				+ ", price=" + price + ", status=" + status + '}';
	}
}