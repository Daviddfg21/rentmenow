package com.rentmenow.config;

import com.rentmenow.entity.User;
import com.rentmenow.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitialization implements CommandLineRunner {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public DataInitialization(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public void run(String... args) throws Exception {
		createAdminUser();
	}

	private void createAdminUser() {
		// Verificar si ya existe un admin
		if (!userRepository.existsByUsername("admin")) {
			User admin = new User();
			admin.setUsername("admin");
			admin.setPassword(passwordEncoder.encode("adminpssw")); // Cambiar por una contraseña segura
			admin.setEmail("admin@rentmenow.com");
			admin.setRole("ADMIN");
			admin.setFirstName("Administrador");
			admin.setLastName("RentMeNow");
			admin.setPhone("+34 600 000 000");
			admin.setBio("Usuario administrador del sistema RentMeNow");

			userRepository.save(admin);
			System.out.println("✅ Usuario ADMIN creado:");
			System.out.println("   Username: admin");
			System.out.println("   Password: admin123");
			System.out.println("   Email: admin@rentmenow.com");
		} else {
			System.out.println("ℹ️ Usuario ADMIN ya existe en la base de datos");
		}
	}
}