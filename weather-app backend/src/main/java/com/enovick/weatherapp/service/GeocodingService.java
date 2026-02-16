package com.enovick.weatherapp.service;

import com.enovick.weatherapp.dto.GeoLocation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeocodingService {

    @Value("${google.geocoding.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public List<GeoLocation> geocodeCity(String city) {

        if (city == null || city.isBlank()) {
            throw new RuntimeException("City name is required");
        }

        String url = "https://maps.googleapis.com/maps/api/geocode/json?address="
                + city + "&key=" + apiKey;

        Map response = restTemplate.getForObject(url, Map.class);

        if (response == null || !response.containsKey("results")) {
            throw new RuntimeException("Invalid response from Google");
        }

        List<Map<String, Object>> results =
                (List<Map<String, Object>>) response.get("results");

        if (results.isEmpty()) {
            throw new RuntimeException("City not found");
        }

        List<GeoLocation> locations = new ArrayList<>();

        for (Map<String, Object> result : results) {

            Map geometry = (Map) result.get("geometry");
            Map location = (Map) geometry.get("location");

            double lat = ((Number) location.get("lat")).doubleValue();
            double lon = ((Number) location.get("lng")).doubleValue();

            List<Map<String, Object>> addressComponents =
                    (List<Map<String, Object>>) result.get("address_components");

            String name = city;
            String state = "";
            String country = "";

            for (Map<String, Object> comp : addressComponents) {

                List<String> types = (List<String>) comp.get("types");

                if (types.contains("locality")) {
                    name = (String) comp.get("long_name");
                }

                if (types.contains("administrative_area_level_1")) {
                    state = (String) comp.get("long_name");
                }

                if (types.contains("country")) {
                    country = (String) comp.get("short_name");
                }
            }

            locations.add(new GeoLocation(name, state, country, lat, lon));
        }

        return locations;
    }
}
