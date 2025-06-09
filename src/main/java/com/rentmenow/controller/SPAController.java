package com.rentmenow.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SPAController {

	// Manejar la ruta raíz
	@GetMapping("/")
	public String index() {
		return "forward:/index.html";
	}

	// Manejar rutas específicas del frontend SIN wildcards problemáticos
	@GetMapping("/login")
	public String login() {
		return "forward:/index.html";
	}

	@GetMapping("/register")
	public String register() {
		return "forward:/index.html";
	}

	@GetMapping("/properties")
	public String properties() {
		return "forward:/index.html";
	}

	@GetMapping("/create-property")
	public String createProperty() {
		return "forward:/index.html";
	}

	@GetMapping("/rentals")
	public String rentals() {
		return "forward:/index.html";
	}

	@GetMapping("/admin")
	public String admin() {
		return "forward:/index.html";
	}

	@GetMapping("/profile")
	public String profile() {
		return "forward:/index.html";
	}

	// Manejar rutas con parámetros específicos - UNA POR UNA
	@GetMapping("/properties/{id}")
	public String propertyDetail() {
		return "forward:/index.html";
	}

	@GetMapping("/create-rental/{id}")
	public String createRental() {
		return "forward:/index.html";
	}

	@GetMapping("/profile/{username}")
	public String userProfile() {
		return "forward:/index.html";
	}
}