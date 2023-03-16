package com.example.springresourceserver;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping(path = "/api")
public class DemoRestController {

    @GetMapping(path = "/about", produces = "text/plain")
    public String publicEndpoint() {
        return "Hello !";
    }

    @GetMapping(path = "/hello", produces = "application/json")
    public Greeting securedEndpoint(Principal principal){
        String name = principal != null ? principal.getName() : "NO USER NAME !!";
        return new Greeting(name, "Salut !");
    }

    public static record Greeting(
            String name,
            String greeting
    ){}
}
