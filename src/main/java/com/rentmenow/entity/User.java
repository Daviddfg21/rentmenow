package com.rentmenow.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(unique = true, nullable = false)
	private String username;

	@Column(nullable = false)
	private String password;

	@Column(nullable = false)
	private String email;

	@Column(nullable = false)
	private String role = "USER"; // USER, ADMIN

	@Column(name = "first_name")
	private String firstName;

	@Column(name = "last_name")
	private String lastName;

	@Column(name = "phone")
	private String phone;

	@Column(columnDefinition = "TEXT")
	private String bio;

	@Column(name = "created_at")
	private LocalDateTime createdAt = LocalDateTime.now();

	@OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<Property> properties;

	@OneToMany(mappedBy = "tenant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<Rental> rentals;
}