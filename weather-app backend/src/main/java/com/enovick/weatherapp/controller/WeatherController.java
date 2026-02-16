package com.enovick.weatherapp.controller;

import com.enovick.weatherapp.dto.WeatherData;
import com.enovick.weatherapp.service.WeatherService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/weather")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping
    public WeatherData getWeather(
            @RequestParam double lat,
            @RequestParam double lon) {

        return weatherService.getWeather(lat, lon);
    }
}
