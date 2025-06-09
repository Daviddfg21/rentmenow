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

	// Manejar todas las rutas del frontend (excepto API y recursos estáticos)
	@GetMapping(value = { "/login", "/register", "/properties", "/properties/**", "/create-property", "/rentals",
			"/create-rental/**", "/admin", "/profile", "/profile/**" })
	public String forward() {
		return "forward:/index.html";
	}
}