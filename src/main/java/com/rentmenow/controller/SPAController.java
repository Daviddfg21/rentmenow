package com.rentmenow.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SPAController {

    // Manejar TODAS las rutas no-API del frontend incluyendo rutas dinámicas
    @RequestMapping(value = { 
        "/", 
        "/login", 
        "/register", 
        "/properties", 
        "/properties/**",  // Esto maneja /properties/1, /properties/2, etc.
        "/create-property", 
        "/rentals", 
        "/create-rental/**",  // Esto maneja /create-rental/1, etc.
        "/admin", 
        "/dashboard",  // Nuevo dashboard de usuario
        "/profile",
        "/profile/**"  // Esto maneja /profile/username
    })
    public String forward() {
        return "forward:/index.html";
    }
}