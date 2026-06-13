package com.astrotrack.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/nasa")
@CrossOrigin(origins = "http://localhost:5173")
public class NasaController {

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/apod")
    public Object getApod() {

        String url =
                "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY";

        return restTemplate.getForObject(
                url,
                Object.class
        );
    }
}