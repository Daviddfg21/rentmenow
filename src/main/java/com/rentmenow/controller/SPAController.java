package com.rentmenow.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SPAController {

    // Manejar todas las rutas del frontend y servir index.html
    @RequestMapping(value = {"/{path:[^\\.]*}", "/{path:^(?!api).*}/**"})
    public String forward() {
        return "forward:/index.html";
    }
}