package com.rentmenow.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "properties")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Property {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String title;

	@Column(columnDefinition = "TEXT")
	private String description;

	@Column(nullable = false)
	private String address;

	@Column(nullable = false)
	private String city;

	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal price;

	@Column(nullable = false)
	private Integer bedrooms;

	@Column(nullable = false)
	private Integer bathrooms;

	@Column(nullable = false)
	private Boolean available = true;

	@ManyToOne
	@JoinColumn(name = "category_id")
	private Category category;

	@Column(name = "created_at")
	private LocalDateTime createdAt = LocalDateTime.now();

	@ManyToOne
	@JoinColumn(name = "owner_id", nullable = false)
	private User owner;

	@OneToMany(mappedBy = "property", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<Rental> rentals = new ArrayList<>();

	@OneToMany(mappedBy = "property", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<Maintenance> maintenances = new ArrayList<>();

	@ElementCollection
	@CollectionTable(name = "property_images", joinColumns = @JoinColumn(name = "property_id"))
	@Column(name = "image_url")
	private List<String> images = new ArrayList<>();

	@Column(name = "occupied_until")
	private LocalDateTime occupiedUntil;
}