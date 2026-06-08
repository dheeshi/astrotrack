package com.astrotrack.controller;

import com.astrotrack.model.AstronomyData;
import com.astrotrack.service.AstronomyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    @Autowired
    private AstronomyService astronomyService;

    @GetMapping("/dashboard")
    public AstronomyData getDashboardData(
            @RequestParam double lat,
            @RequestParam double lon) {

        return astronomyService.getViewingConditions(lat, lon);
    }
}