export async function getWeatherByCoords(lat, lon) {
    const WEATHER_API_KEY = process.env.GOOGLE_WEATHER_API_KEY;

    if (lat == null || lon == null) {
        throw new Error("Latitude and longitude are required");
    }

    const url =`https://weather.googleapis.com/v1/currentConditions:lookup?key=${WEATHER_API_KEY}&location.latitude=${lat}&location.longitude=${lon}`;

    const response = await fetch(url);

    if (!response.ok) {
        const text = await response.text();
        console.error("Google Weather error:", response.status, text);
        throw new Error("Failed to fetch weather data");
    }

    const data = await response.json();

    const {
        temperature: tmp,
        feelsLikeTemperature: fL_tmp,
        weatherCondition: weatherCon,
        relativeHumidity,
        wind: wnd,
        airPressure: airP,
        currentConditionsHistory: cCHistory,
        precipitation: precip
    } = data;

    return {
        temperature: {
            degrees: tmp?.degrees
        },
        feelsLikeTemperature: {
            degrees: fL_tmp?.degrees
        },
        weatherCondition: {
            description: {
                text: weatherCon?.description?.text,
                iconBaseUri: weatherCon?.iconBaseUri ?? ""
            }
        },
        relativeHumidity,
        wind: {
            direction: {
                degrees: wnd?.direction?.degrees,
                cardinal: wnd?.direction?.cardinal
            },
            speed: {
                value: wnd?.speed?.value
            },
        },
        airPressure: {
            meanSeaLevelMillibars: airP?.meanSeaLevelMillibars
        },
        currentConditionsHistory: {
            minTemperature: cCHistory?.minTemperature?.degrees,
            maxTemperature: cCHistory?.maxTemperature?.degrees
        },
        precipitation: {
            probability: {
                percent: precip?.probability?.percent,
                type: precip?.probability?.type
            }
        }
    };
}
