package com.enovick.weatherapp.dto;

public record WeatherData(double temperature, double feelsLikeTemperature,
            WeatherCondition weatherCondition,
            int relativeHumidity,
            Wind wind,
            double airPressure,
            CurrentConditionsHistory currentConditions,
            Precipitation precipitation
)
    {
        /**
         * This record class is a shorthand way of representing DTO (Data Transfer Object) classes.
         * This automatically generates a constructor, getters, toString(), equals(), hashcode().
         * The getter method names are the same as the actual parameter name e.g. speed() is getSpeed.
         *
         * @param speed
         * @param degrees
         * @param cardinal
         */
        public record Wind(double speed, double degrees, String cardinal) {
        }

        public record WeatherCondition(String text, String iconBaseUri){}

        public record CurrentConditionsHistory(double minTemperature, double maxTemperature){}

        public record Precipitation(int percent, String type){}
    }