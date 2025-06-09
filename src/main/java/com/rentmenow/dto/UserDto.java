package com.rentmenow.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
	private Long id;
	private String username;
	private String email;
	private String role;
	private String firstName;
	private String lastName;
	private String phone;
	private String bio;
}