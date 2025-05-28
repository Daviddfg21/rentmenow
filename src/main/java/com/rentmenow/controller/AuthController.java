package com.rentmenow.controller;

import com.rentmenow.model.User;
import com.rentmenow.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Controlador de Autenticación SIMPLE
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
public class AuthController {

	@Autowired
	private UserService userService;

	@Autowired
	private PasswordEncoder passwordEncoder;

	// POST /api/auth/register - Registro de usuario
	@PostMapping("/register")
	public ResponseEntity<?> register(@Valid @RequestBody User user) {
		try {
			// Crear usuario (validaciones en UserService)
			User newUser = userService.createUser(user);

			// Respuesta simple
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "Usuario registrado exitosamente");
			response.put("user", Map.of("id", newUser.getId(), "username", newUser.getUsername(), "fullName",
					newUser.getFullName(), "email", newUser.getEmail(), "role", newUser.getRole()));

			return ResponseEntity.ok(response);

		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
		}
	}

	// POST /api/auth/login - Login de usuario
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
		try {
			String username = credentials.get("username");
			String password = credentials.get("password");

			// Validar campos
			if (username == null || password == null || username.trim().isEmpty() || password.trim().isEmpty()) {
				return ResponseEntity.badRequest()
						.body(Map.of("success", false, "error", "Username y password son requeridos"));
			}

			// Buscar usuario
			Optional<User> userOpt = userService.getUserByUsername(username.trim());
			if (userOpt.isEmpty()) {
				return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Usuario no encontrado"));
			}

			User user = userOpt.get();

			// Verificar contraseña
			if (!passwordEncoder.matches(password, user.getPassword())) {
				return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Contraseña incorrecta"));
			}

			// Verificar que esté activo
			if (!user.getActive()) {
				return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Usuario desactivado"));
			}

			// Respuesta exitosa
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "Login exitoso");
			response.put("user", Map.of("id", user.getId(), "username", user.getUsername(), "fullName",
					user.getFullName(), "email", user.getEmail(), "role", user.getRole()));

			return ResponseEntity.ok(response);

		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
		}
	}

	// POST /api/auth/logout - Logout
	@PostMapping("/logout")
	public ResponseEntity<?> logout() {
		return ResponseEntity.ok(Map.of("success", true, "message", "Logout exitoso"));
	}
}