package com.astrotrack.service;

import com.astrotrack.model.AstronomyData;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class AstronomyService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper; // Built-in Spring JSON parser

    public AstronomyService() {
        this.restClient = RestClient.builder()
                .baseUrl("https://api.open-meteo.com/v1")
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public AstronomyData getViewingConditions(double latitude, double longitude) {
        try {
            String response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/forecast")
                            .queryParam("latitude", latitude)
                            .queryParam("longitude", longitude)
                            .queryParam("daily", "sunrise,sunset")
                            .queryParam("timezone", "auto")
                            .build())
                    .retrieve()
                    .body(String.class);

            // Parse the raw JSON string into a searchable node tree
            JsonNode root = objectMapper.readTree(response);

            // Open-Meteo returns daily data inside arrays: daily.sunrise[0] and daily.sunset[0]
            String liveSunrise = root.path("daily").path("sunrise").get(0).asText();
            String liveSunset = root.path("daily").path("sunset").get(0).asText();

            AstronomyData data = new AstronomyData();
            data.setSunrise(liveSunrise); // Dynamic data from the live API!
            data.setSunset(liveSunset);   // Dynamic data from the live API!
            data.setConditions("Optimal Clear Skies for Tracking!");

            return data;

        } catch (Exception e) {
            // Fault Tolerance fallback remains intact
            AstronomyData fallbackData = new AstronomyData();
            fallbackData.setConditions("Weather data temporarily unavailable. System safe.");
            return fallbackData;
        }
    }
}