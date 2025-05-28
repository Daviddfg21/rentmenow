package com.rentmenow.service;

import com.rentmenow.model.User;
import com.rentmenow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Servicio para gestión de usuarios
 */
@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	// Obtener todos los usuarios
	public List<User> getAllUsers() {
		return userRepository.findAll();
	}

	// Obtener usuario por ID
	public Optional<User> getUserById(Long id) {
		return userRepository.findById(id);
	}

	// Obtener usuario por username
	public Optional<User> getUserByUsername(String username) {
		return userRepository.findByUsername(username);
	}

	// Obtener usuario por email
	public Optional<User> getUserByEmail(String email) {
		return userRepository.findByEmail(email);
	}

	// Crear nuevo usuario
	public User createUser(User user) {
		// Verificar que no exista el username
		if (userRepository.existsByUsername(user.getUsername())) {
			throw new RuntimeException("El username ya existe");
		}

		// Verificar que no exista el email
		if (userRepository.existsByEmail(user.getEmail())) {
			throw new RuntimeException("El email ya existe");
		}

		// Encriptar contraseña
		user.setPassword(passwordEncoder.encode(user.getPassword()));

		return userRepository.save(user);
	}

	// Actualizar usuario
	public User updateUser(Long id, User updatedUser) {
		return userRepository.findById(id).map(user -> {
			user.setFullName(updatedUser.getFullName());
			user.setPhone(updatedUser.getPhone());
			user.setEmail(updatedUser.getEmail());

			// Solo actualizar contraseña si se proporciona una nueva
			if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
				user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
			}

			return userRepository.save(user);
		}).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
	}

	// Eliminar usuario
	public void deleteUser(Long id) {
		if (!userRepository.existsById(id)) {
			throw new RuntimeException("Usuario no encontrado");
		}
		userRepository.deleteById(id);
	}

	// Buscar usuarios activos
	public List<User> getActiveUsers() {
		return userRepository.findByActiveTrue();
	}

	// Buscar usuarios por rol
	public List<User> getUsersByRole(User.UserRole role) {
		return userRepository.findByRole(role);
	}

	// Activar/desactivar usuario
	public User toggleUserStatus(Long id) {
		return userRepository.findById(id).map(user -> {
			user.setActive(!user.getActive());
			return userRepository.save(user);
		}).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
	}

	// Contar usuarios por rol
	public long countUsersByRole(User.UserRole role) {
		return userRepository.countByRoleAndActiveTrue(role);
	}
}