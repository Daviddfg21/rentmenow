package com.rentmenow.controller;

import com.rentmenow.config.JwtUtil;
import com.rentmenow.dto.*;
import com.rentmenow.entity.User;
import com.rentmenow.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

	private final AuthenticationManager authenticationManager;
	private final UserService userService;
	private final JwtUtil jwtUtil;

	public AuthController(AuthenticationManager authenticationManager, UserService userService, JwtUtil jwtUtil) {
		this.authenticationManager = authenticationManager;
		this.userService = userService;
		this.jwtUtil = jwtUtil;
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
		try {
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
		} catch (BadCredentialsException e) {
			return ResponseEntity.badRequest().body("Credenciales inválidas");
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Error en el login: " + e.getMessage());
		}

		try {
			User user = userService.findByUsername(loginRequest.getUsername());
			String token = jwtUtil.generateToken(user.getUsername());

			UserDto userDto = new UserDto(user.getId(), user.getUsername(), user.getEmail(), user.getRole(),
					user.getFirstName(), user.getLastName(), user.getPhone(), user.getBio());

			return ResponseEntity.ok(new AuthResponse(token, userDto));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Error al generar token: " + e.getMessage());
		}
	}

	@PostMapping("/register")
	public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
		try {
			UserDto user = userService.createUser(registerRequest);
			return ResponseEntity.ok(user);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body("Error en el registro: " + e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Error inesperado: " + e.getMessage());
		}
	}
}