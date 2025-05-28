package com.rentmenow.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Controlador para servir el frontend React - VERSIÓN CORREGIDA
 */
@Controller
public class HomeController {

	// Servir la aplicación React SOLO en la raíz
	@GetMapping("/")
	public String home() {
		return "forward:/index.html";
	}

	// Para rutas específicas del frontend (evita conflictos con API)
	@GetMapping(value = { "/login", "/dashboard", "/properties", "/admin" })
	public String forwardToReact() {
		return "forward:/index.html";
	}

	// ELIMINAR ESTE MAPPING QUE CAUSA EL BUCLE:
	// NO usar: @GetMapping(value = "/{path:[^\\.]*}")
	// Ese mapping captura TODAS las rutas y causa el bucle infinito
}