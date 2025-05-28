package com.rentmenow.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.time.LocalDateTime;

/**
 * Entidad PropertyImage - Representa imágenes de las propiedades
 */
@Entity
@Table(name = "property_images")
@EntityListeners(AuditingEntityListener.class)
public class PropertyImage {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "property_id", nullable = false)
	@JsonBackReference("property-images")
	private Property property;

	@NotBlank
	@Column(nullable = false)
	private String imageUrl;

	@Column(length = 100)
	private String altText;

	@Column(nullable = false)
	private Boolean isPrimary = false; // Imagen principal

	@Column(nullable = false)
	private Integer orderIndex = 0; // Orden de visualización

	@CreatedDate
	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;

	// Constructores
	public PropertyImage() {
	}

	public PropertyImage(Property property, String imageUrl, String altText) {
		this.property = property;
		this.imageUrl = imageUrl;
		this.altText = altText;
	}

	public PropertyImage(Property property, String imageUrl, String altText, Boolean isPrimary) {
		this.property = property;
		this.imageUrl = imageUrl;
		this.altText = altText;
		this.isPrimary = isPrimary;
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

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public String getAltText() {
		return altText;
	}

	public void setAltText(String altText) {
		this.altText = altText;
	}

	public Boolean getIsPrimary() {
		return isPrimary;
	}

	public void setIsPrimary(Boolean isPrimary) {
		this.isPrimary = isPrimary;
	}

	public Integer getOrderIndex() {
		return orderIndex;
	}

	public void setOrderIndex(Integer orderIndex) {
		this.orderIndex = orderIndex;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	@Override
	public String toString() {
		return "PropertyImage{" + "id=" + id + ", imageUrl='" + imageUrl + '\'' + ", altText='" + altText + '\''
				+ ", isPrimary=" + isPrimary + ", orderIndex=" + orderIndex + '}';
	}
}