package serverside.backends.weather.controller;

import serverside.backends.weather.dto.GeoLocation;
import serverside.backends.weather.service.GeocodingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/weather/geocode")
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
