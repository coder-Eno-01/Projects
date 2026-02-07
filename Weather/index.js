const   API_KEY = "172f7543b9f3837cb362c160b64ea376",
        cityInput = document.querySelector(".weatherData input"),
        cityName = document.getElementById("cityName"),
        temperature = document.getElementById("temp"),
        desc = document.getElementById("description"),
        weatherIcon = document.getElementById("icon"),
        err = document.getElementById("error"),
        weatherData = document.querySelector(".weatherData"),
        searchButton = document.querySelector(".weatherData button"),
        showData = document.querySelector("#showData");

weatherData.addEventListener("submit", async (e) => {
    resetUI();
    e.preventDefault();     // Prevent page refresh on form submission
    const city = cityInput.value.trim();

    try{
        const simpleProcess = await selectionProcess(city);
        if (simpleProcess[0]) displayWeather(simpleProcess[1]);
    }

    catch(error){
        console.error(error);
        displayError(error.message);
    }
});

showData.addEventListener("click", async (e) => {
    const option = e.target.closest(".options");
    if (!option) return;     // Ignore clicks outside options

    try{
        const weatherData = await getWeather(option.dataset);
        displayWeather(weatherData);
        showData.querySelectorAll(".options").forEach(el => el.remove());           // Clear options after selection
    }

    catch(error){
        console.error(error);
        displayError("Failed to fetch weather data for the selected location.");
    }
});

async function getCoordinates(city){
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=5&appid=${API_KEY}`;
    const response = await fetch(geoUrl);

    if (!response.ok){
        throw new Error("Failed to fetch coordinates");
    }

    const data = await response.json();

    if (data.length === 0){
        throw new Error("City not found");
    }

    const geoData = data.map(({name, lat, lon, country, state}) => ({name, lat, lon, country, state}));
    return geoData;
}

async function selectionProcess(city){
    const geoData = await getCoordinates(city);

    if (geoData.length === 1) {
        return [true, await getWeather(geoData[0])];
    }

    else{
        showData.querySelectorAll(".options").forEach(el => el.remove());           // Clear previous options
        weatherIcon.style.display = "none";
        
        geoData.forEach(({name, country, state, lat, lon}) => {
            const option = document.createElement("div");
            option.classList.add("options");
            option.dataset.lat = lat;
            option.dataset.lon = lon;
            const city_name = document.createElement("h2");
            const state_country = document.createElement("h4");
            showData.appendChild(option);
            option.appendChild(city_name);
            option.appendChild(state_country);

            city_name.textContent = name;
            if (state){
                state_country.textContent = `${state} (${country})`;
            }

            else{
                state_country.textContent = country;
            }
        });

        return [false, null];
    }
}

async function getWeather(geoData){
    const { lat, lon } = geoData;
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
    temperature.style.display = "none";
    desc.style.display = "none";
    weatherIcon.style.display = "none";
}

function resetUI(){
    err.style.display = "none";
    cityName.style.display = "none";
    temperature.style.display = "none";
    desc.style.display = "none";
    weatherIcon.style.display = "block";
    weatherIcon.src = "https://www.svgrepo.com/show/527853/question-square.svg";
}