package com.enovick.weatherapp.controller;

import com.enovick.weatherapp.dto.GeoLocation;
import com.enovick.weatherapp.service.GeocodingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/geocode")
public class GeocodeController {

    private final GeocodingService geocodingService;

    public GeocodeController(GeocodingService geocodingService) {
        this.geocodingService = geocodingService;
    }

    @GetMapping
    public List<GeoLocation> geocode(@RequestParam String city) {
        return geocodingService.geocodeCity(city);
    }
}
