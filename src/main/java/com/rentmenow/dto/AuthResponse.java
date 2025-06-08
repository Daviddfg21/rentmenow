package com.rentmenow.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
	private String token;
	private String type = "Bearer";
	private UserDto user;

	public AuthResponse(String token, UserDto user) {
		this.token = token;
		this.user = user;
	}
}