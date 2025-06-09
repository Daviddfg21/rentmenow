package com.rentmenow.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SPAController {

	// Manejar TODAS las rutas no-API del frontend con un solo método
	@RequestMapping(value = { "/", "/login", "/register", "/properties", "/create-property", "/rentals", "/admin",
			"/profile" })
	public String forward() {
		return "forward:/index.html";
	}
}