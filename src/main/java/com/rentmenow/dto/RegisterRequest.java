package com.rentmenow.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
	@NotBlank(message = "Username is required")
	private String username;

	@NotBlank(message = "Password is required")
	private String password;

	@Email(message = "Invalid email format")
	@NotBlank(message = "Email is required")
	private String email;

	@NotBlank(message = "Role is required")
	private String role;
}