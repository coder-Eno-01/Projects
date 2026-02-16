package com.enovick.weatherapp.dto;

/**
 * This represents ONLY the parts of Google's weather JSON
 * that we care about.
 *
 * Jackson will automatically map JSON fields
 * to these record fields by matching names.
 */
public record GoogleWeatherResponse(
        Temperature temperature,
        FeelsLikeTemperature feelsLikeTemperature,
        WeatherCondition weatherCondition,
        int relativeHumidity,
        Wind wind,
        AirPressure airPressure,
        CurrentConditionsHistory currentConditionsHistory,
        Precipitation precipitation
) {

    public record Temperature(double degrees) {}

    public record FeelsLikeTemperature(double degrees) {}

    public record WeatherCondition(
            Description description,
            String iconBaseUri
    ) {}

    public record Description(String text) {}

    public record Wind(
            Direction direction,
            Speed speed
    ){}

    public record Direction(double degrees, String cardinal){}

    public record Speed(double value){}

    public record AirPressure(double meanSeaLevelMillibars){}

    public record CurrentConditionsHistory(
            MinTemperature minTemperature,
            MaxTemperature maxTemperature
    ){}

    public record MinTemperature(double degrees){}

    public record MaxTemperature(double degrees){}

    public record Precipitation(
            Probability probability
    ){}

    public record Probability(int percent, String type){}
}
