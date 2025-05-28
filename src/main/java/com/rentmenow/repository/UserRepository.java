package com.rentmenow.repository;

import com.rentmenow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad User
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	// Buscar por username
	Optional<User> findByUsername(String username);

	// Buscar por email
	Optional<User> findByEmail(String email);

	// Verificar si existe username
	boolean existsByUsername(String username);

	// Verificar si existe email
	boolean existsByEmail(String email);

	// Buscar usuarios activos
	List<User> findByActiveTrue();

	// Buscar por rol
	List<User> findByRole(User.UserRole role);

	// Buscar por nombre completo (contiene)
	List<User> findByFullNameContainingIgnoreCase(String fullName);

	// Contar usuarios por rol
	@Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.active = true")
	long countByRoleAndActiveTrue(@Param("role") User.UserRole role);
}