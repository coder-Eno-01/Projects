package com.enovick.weatherapp.dto;

public class GeoLocation {

    private String name;
    private String state;
    private String country;
    private double lat;
    private double lon;

    public GeoLocation(String name, String state, String country, double lat, double lon) {
        this.name = name;
        this.state = state;
        this.country = country;
        this.lat = lat;
        this.lon = lon;
    }

    public String getName() { return name; }
    public String getState() { return state; }
    public String getCountry() { return country; }
    public double getLat() { return lat; }
    public double getLon() { return lon; }
}
