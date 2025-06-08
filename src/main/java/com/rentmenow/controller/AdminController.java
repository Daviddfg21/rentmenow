package com.rentmenow.controller;

import com.rentmenow.dto.ReportDto;
import com.rentmenow.dto.UserDto;
import com.rentmenow.entity.Category;
import com.rentmenow.service.ReportService;
import com.rentmenow.service.UserService;
import com.rentmenow.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

	private final UserService userService;
	private final CategoryService categoryService;
	private final ReportService reportService;

	public AdminController(UserService userService, CategoryService categoryService, ReportService reportService) {
		this.userService = userService;
		this.categoryService = categoryService;
		this.reportService = reportService;
	}

	// CRUD USUARIOS
	@GetMapping("/users")
	public ResponseEntity<List<UserDto>> getAllUsers() {
		return ResponseEntity.ok(userService.getAllUsers());
	}

	@GetMapping("/users/{id}")
	public ResponseEntity<?> getUserById(@PathVariable Long id) {
		try {
			UserDto user = userService.getUserById(id);
			return ResponseEntity.ok(user);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@PutMapping("/users/{id}")
	public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserDto userDto) {
		try {
			UserDto user = userService.updateUser(id, userDto);
			return ResponseEntity.ok(user);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@DeleteMapping("/users/{id}")
	public ResponseEntity<?> deleteUser(@PathVariable Long id) {
		try {
			userService.deleteUser(id);
			return ResponseEntity.ok("User deleted successfully");
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	// CRUD CATEGORÍAS
	@GetMapping("/categories")
	public ResponseEntity<List<Category>> getAllCategories() {
		return ResponseEntity.ok(categoryService.getAllCategories());
	}

	@PostMapping("/categories")
	public ResponseEntity<?> createCategory(@RequestBody Category category) {
		try {
			Category savedCategory = categoryService.createCategory(category);
			return ResponseEntity.ok(savedCategory);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@PutMapping("/categories/{id}")
	public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody Category category) {
		try {
			Category updatedCategory = categoryService.updateCategory(id, category);
			return ResponseEntity.ok(updatedCategory);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@DeleteMapping("/categories/{id}")
	public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
		try {
			categoryService.deleteCategory(id);
			return ResponseEntity.ok("Category deleted successfully");
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	// INFORME DE RESULTADOS
	@GetMapping("/reports/financial")
	public ResponseEntity<ReportDto> getFinancialReport() {
		return ResponseEntity.ok(reportService.generateFinancialReport());
	}
}