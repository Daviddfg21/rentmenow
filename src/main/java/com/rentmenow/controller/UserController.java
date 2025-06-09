package com.rentmenow.controller;

import com.rentmenow.dto.UserDto;
import com.rentmenow.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping("/{username}")
	public ResponseEntity<?> getUserByUsername(@PathVariable String username) {
		try {
			UserDto user = userService.getUserByUsername(username);
			return ResponseEntity.ok(user);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@GetMapping("/profile")
	public ResponseEntity<?> getCurrentUserProfile(Authentication authentication) {
		try {
			UserDto user = userService.getUserByUsername(authentication.getName());
			return ResponseEntity.ok(user);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@PutMapping("/profile")
	public ResponseEntity<?> updateCurrentUserProfile(@RequestBody UserDto userDto, Authentication authentication) {
		try {
			UserDto currentUser = userService.getUserByUsername(authentication.getName());
			UserDto updatedUser = userService.updateUser(currentUser.getId(), userDto);
			return ResponseEntity.ok(updatedUser);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
}