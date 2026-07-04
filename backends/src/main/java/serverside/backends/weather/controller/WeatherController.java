package serverside.backends.weather.controller;

import serverside.backends.weather.dto.WeatherData;
import serverside.backends.weather.service.WeatherService;
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
