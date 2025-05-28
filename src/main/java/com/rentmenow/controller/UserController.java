package com.rentmenow.controller;

import com.rentmenow.model.User;
import com.rentmenow.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

/**
 * Controlador REST para gestión de usuarios
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
public class UserController {

	@Autowired
	private UserService userService;

	// GET /api/users - Obtener todos los usuarios
	@GetMapping
	public ResponseEntity<List<User>> getAllUsers() {
		List<User> users = userService.getAllUsers();
		return ResponseEntity.ok(users);
	}

	// GET /api/users/{id} - Obtener usuario por ID
	@GetMapping("/{id}")
	public ResponseEntity<User> getUserById(@PathVariable Long id) {
		return userService.getUserById(id).map(user -> ResponseEntity.ok(user))
				.orElse(ResponseEntity.notFound().build());
	}

	// GET /api/users/username/{username} - Obtener usuario por username
	@GetMapping("/username/{username}")
	public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
		return userService.getUserByUsername(username).map(user -> ResponseEntity.ok(user))
				.orElse(ResponseEntity.notFound().build());
	}

	// GET /api/users/email/{email} - Obtener usuario por email
	@GetMapping("/email/{email}")
	public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
		return userService.getUserByEmail(email).map(user -> ResponseEntity.ok(user))
				.orElse(ResponseEntity.notFound().build());
	}

	// POST /api/users - Crear nuevo usuario
	@PostMapping
	public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
		try {
			User createdUser = userService.createUser(user);
			// No devolver la contraseña en la respuesta
			createdUser.setPassword(null);
			return ResponseEntity.ok(createdUser);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().build();
		}
	}

	// PUT /api/users/{id} - Actualizar usuario
	@PutMapping("/{id}")
	public ResponseEntity<User> updateUser(@PathVariable Long id, @Valid @RequestBody User user) {
		try {
			User updatedUser = userService.updateUser(id, user);
			// No devolver la contraseña en la respuesta
			updatedUser.setPassword(null);
			return ResponseEntity.ok(updatedUser);
		} catch (RuntimeException e) {
			return ResponseEntity.notFound().build();
		}
	}

	// DELETE /api/users/{id} - Eliminar usuario
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
		try {
			userService.deleteUser(id);
			return ResponseEntity.ok().build();
		} catch (RuntimeException e) {
			return ResponseEntity.notFound().build();
		}
	}

	// GET /api/users/active - Obtener usuarios activos
	@GetMapping("/active")
	public ResponseEntity<List<User>> getActiveUsers() {
		List<User> users = userService.getActiveUsers();
		return ResponseEntity.ok(users);
	}

	// GET /api/users/role/{role} - Obtener usuarios por rol
	@GetMapping("/role/{role}")
	public ResponseEntity<List<User>> getUsersByRole(@PathVariable User.UserRole role) {
		List<User> users = userService.getUsersByRole(role);
		return ResponseEntity.ok(users);
	}

	// PUT /api/users/{id}/toggle-status - Activar/desactivar usuario
	@PutMapping("/{id}/toggle-status")
	public ResponseEntity<User> toggleUserStatus(@PathVariable Long id) {
		try {
			User updatedUser = userService.toggleUserStatus(id);
			updatedUser.setPassword(null);
			return ResponseEntity.ok(updatedUser);
		} catch (RuntimeException e) {
			return ResponseEntity.notFound().build();
		}
	}

	// GET /api/users/stats/count-by-role - Estadísticas por rol
	@GetMapping("/stats/count-by-role")
	public ResponseEntity<Map<String, Long>> getUserCountByRole() {
		Map<String, Long> stats = Map.of("USER", userService.countUsersByRole(User.UserRole.USER), "ADMIN",
				userService.countUsersByRole(User.UserRole.ADMIN));

		return ResponseEntity.ok(stats);
	}
}