package serverside.backends.weather.service;

import serverside.backends.weather.dto.GoogleWeatherResponse;
import serverside.backends.weather.dto.WeatherData;
import serverside.backends.weather.dto.WeatherData.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

import static java.lang.Double.NaN;

@Service
public class WeatherService {

    @Value("${google.weather.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public WeatherData getWeather(double lat, double lon) {

        String url = "https://weather.googleapis.com/v1/currentConditions:lookup"
                + "?key=" + apiKey
                + "&location.latitude=" + lat
                + "&location.longitude=" + lon;

        GoogleWeatherResponse response = restTemplate.getForObject(url, GoogleWeatherResponse.class);

        if (response == null) {
            throw new RuntimeException("Invalid response from Google Weather API");
        }

        double temp = response.temperature().degrees();
        double feelsLikeTemp = response.feelsLikeTemperature().degrees();
        String text = response.weatherCondition().description().text();
        String iconUri = response.weatherCondition().iconBaseUri();
        double degrees = response.wind().direction().degrees();
        String cardinal = response.wind().direction().cardinal();
        double speed = response.wind().speed().value();
        int humidity = response.relativeHumidity();
        double airPressure = response.airPressure().meanSeaLevelMillibars();
        double minTemp= response.currentConditionsHistory().minTemperature().degrees();
        double maxTemp= response.currentConditionsHistory().maxTemperature().degrees();
        int percent = response.precipitation().probability().percent();
        String type = response.precipitation().probability().type();

        return new WeatherData(
                temp,
                feelsLikeTemp,
                new WeatherCondition(text, iconUri),
                humidity,
                new Wind(speed, degrees, cardinal),
                airPressure,
                new CurrentConditionsHistory(minTemp, maxTemp),
                new Precipitation(percent, type)
        );
    }
}
