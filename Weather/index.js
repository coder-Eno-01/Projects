const   API_KEY = "172f7543b9f3837cb362c160b64ea376",
        cityInput = document.querySelector(".weatherData input"),
        cityName = document.getElementById("cityName"),
        temperature = document.getElementById("temp"),
        desc = document.getElementById("description"),
        weatherIcon = document.getElementById("icon"),
        err = document.getElementById("error"),
        weatherData = document.querySelector(".weatherData"),
        searchButton = document.querySelector(".weatherData button");

weatherData.addEventListener("submit", async (e) => {
    e.preventDefault();     // Prevent page refresh on form submission
    const city = cityInput.value.trim();

    try{
        const data = await getWeather(city);
        displayWeather(data);
    }

    catch(error){
        console.error(error);
        displayError(error.message);
    }
});

async function getCoordinates(city){
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`;
    const response = await fetch(geoUrl);
    const data = await response.json();

    if (!response.ok){
        throw new Error("Failed to fetch coordinates");
    }

    else if (data.length === 0){
        throw new Error("City not found");
    }

    return{
        lat: data[0].lat,
        lon: data[0].lon
    }
}

async function getWeather(city){
    const { lat, lon } = await getCoordinates(city);
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const response = await fetch(weatherUrl);
    return await response.json();
}

function displayWeather(data){
    err.style.display = "none";
    cityName.style.display = "block";
    temperature.style.display = "block";
    desc.style.display = "block";
    weatherIcon.style.display = "block";

    const { name: city, 
            main: {temp, humidity}, 
            weather: [{description, id}]} = data;

    cityName.textContent = city;
    temperature.textContent = `${Math.round(temp - 273.15)}°C`;
    desc.textContent = description;
    weatherIcon.src = getWeatherIcon(id);
}

function getWeatherIcon(weatherId){
    switch(true){
        case weatherId >= 200 && weatherId < 300:
            return "https://www.svgrepo.com/show/47960/thunderstorm-clouds.svg";
        case weatherId >= 300 && weatherId < 500:
            return "https://www.svgrepo.com/show/78889/drizzle.svg";
        case weatherId >= 500 && weatherId < 600:
            return "https://www.svgrepo.com/show/465969/rain.svg";
        case weatherId >= 600 && weatherId < 700:
            return "https://www.svgrepo.com/show/532065/snow-alt-1.svg";
        case weatherId >= 700 && weatherId < 800:
            return "https://www.svgrepo.com/show/474591/fog.svg";
        case weatherId >= 800 && weatherId < 810:
            return "https://www.svgrepo.com/show/526341/sun.svg"

        default:
            return "https://www.svgrepo.com/show/527853/question-square.svg";
    }
}

function displayError(message){
    err.style.display = "block";
    err.textContent = message;
    cityName.style.display = "none";
    temp.style.display = "none";
    desc.style.display = "none";
    icon.style.display = "none";
}