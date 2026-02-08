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

const   moreInfo = document.getElementById("moreInfo"),
        moreInfoText = document.querySelector("#moreInfo h5"),
        moreInfoImg = document.querySelector("#moreInfo img"),
        expand = "https://www.svgrepo.com/show/379885/collapse-down.svg",
        collapse = "https://www.svgrepo.com/show/379888/collapse-up.svg",
        expandInfo = document.getElementById("expandInfo"),
        feelsLike = document.getElementById("feelsLikeTemp"),
        tempMin = document.getElementById("minTemp"),
        tempMax = document.getElementById("maxTemp"),
        fpa = document.getElementById("pressure"),
        humid = document.getElementById("humidityValue"),
        windSpeed = document.getElementById("windSpeed"),
        windDeg = document.getElementById("windDeg"),
        windDir = document.getElementById("windDegDesc");

const fetchedData = {
    geo_data: null,
    weather_data: null,
    updateGeoData: function(data){this.geo_data = data},
    updateData: function(data){this.weather_data = data}
};

weatherData.addEventListener("submit", async (e) => {
    resetUI();
    resetData();
    e.preventDefault();     // Prevent page refresh on form submission
    const city = cityInput.value.trim();

    try{
        const simpleProcess = await selectionProcess(city);
        if (simpleProcess) {
            fetchedData.updateGeoData(fetchedData.geo_data[0]);     // Since only one location, directly use the first element
            fetchedData.updateData(await getWeather(fetchedData.geo_data));
            displayWeather();
        }

        else{
            addOptions();
        }
    }

    catch(error){
        displayError(error.message);
    }
});

showData.addEventListener("click", async (e) => {
    const option = e.target.closest(".options");
    if (!option) return;

    try {
        const lat = Number(option.dataset.lat);
        const lon = Number(option.dataset.lon);

        const selectedGeo = fetchedData.geo_data.find(geo =>
            geo.lat === lat && geo.lon === lon
        );

        if (!selectedGeo) {
            throw new Error("Selected location not found in geo data");     // Maybe coz of like some async and UI mismatches.
        }

        fetchedData.updateGeoData(selectedGeo);
        fetchedData.updateData(await getWeather(selectedGeo));
        displayWeather();

        showData.querySelectorAll(".options").forEach(el => el.remove());

    }
    
    catch (error) {
        console.error(error);
        displayError("Failed to fetch weather data for the selected location.");
    }
});

moreInfo.onclick = () => {
    if (expandInfo.style.display === "none"){
        expandInfo.style.display = "block";
        moreInfoText.textContent = "Less Info";
        moreInfoImg.src = collapse;
        displayMoreInfo();
    }

    else{
        moreInfoText.textContent = "More Info";
        moreInfoImg.src = expand;
        expandInfo.style.display = "none";
    }
}

async function getCoordinates(city){
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=7&appid=${API_KEY}`;
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
    fetchedData.updateGeoData(await getCoordinates(city));

    return fetchedData.geo_data.length === 1;     // Return true if only one location found, else false for multiple options
}

async function getWeather(geoData){
    const { lat, lon } = geoData;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const response = await fetch(weatherUrl);

    if (!response.ok){
        throw new Error("Failed to fetch weather data");
    }

    return await response.json();
}

function displayWeather(){
    const { name: city, 
            main: {temp, humidity}, 
            weather: [{description, id}]} = fetchedData.weather_data;

    err.style.display = "none";
    cityName.style.display = "block";
    temperature.style.display = "block";
    desc.style.display = "block";
    weatherIcon.style.display = "block";

    cityName.textContent = city;
    temperature.textContent = `${Math.round(temp - 273.15)}°C`;
    desc.textContent = description;
    weatherIcon.src = getWeatherIcon(id);
    moreInfo.style.display = "block";
}

function displayMoreInfo(){

    const {
        main: {feels_like, temp_min, temp_max, pressure, humidity},
        wind: {speed, deg}} = fetchedData.weather_data;

    feelsLike.textContent = `${Math.round(feels_like - 273.15)}°C`;
    tempMin.textContent = `${Math.round(temp_min - 273.15)}°C`;
    tempMax.textContent = `${Math.round(temp_max - 273.15)}°C`;
    fpa.textContent = `${pressure / 10} kPa`;
    humid.textContent = `${humidity}%`;
    windSpeed.textContent = `${Math.round(speed*3.6)} km/h`;
    windDeg.textContent = `${deg}°`;
    windDir.textContent = `Coming from ${getWindDirection(deg)}`;
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
    showData.querySelectorAll(".options").forEach(el => el.remove());           // Clear previous options
    err.style.display = "none";
    cityName.style.display = "none";
    temperature.style.display = "none";
    desc.style.display = "none";
    weatherIcon.style.display = "block";
    weatherIcon.src = "https://www.svgrepo.com/show/527853/question-square.svg";
    moreInfo.style.display = "none";
}

function resetData(){
    fetchedData.updateGeoData(null);
    fetchedData.updateData(null);
}

function addOptions(){
    
    showData.querySelectorAll(".options").forEach(el => el.remove());           // Clear previous options
    weatherIcon.style.display = "none";
    
    fetchedData.geo_data.forEach(({name, country, state, lat, lon}) => {
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
}

function getWindDirection(deg) {
    switch (true) {
        case (deg >= 348.75 || deg < 11.25):
            return "North";
        case (deg >= 11.25 && deg < 33.75):
            return "North-North-East";
        case (deg >= 33.75 && deg < 56.25):
            return "North-East";
        case (deg >= 56.25 && deg < 78.75):
            return "East-North-East";
        case (deg >= 78.75 && deg < 101.25):
            return "East";
        case (deg >= 101.25 && deg < 123.75):
            return "East-South-East";
        case (deg >= 123.75 && deg < 146.25):
            return "South-East";
        case (deg >= 146.25 && deg < 168.75):
            return "South-South-East";
        case (deg >= 168.75 && deg < 191.25):
            return "South";
        case (deg >= 191.25 && deg < 213.75):
            return "South-South-West";
        case (deg >= 213.75 && deg < 236.25):
            return "South-West";
        case (deg >= 236.25 && deg < 258.75):
            return "West-South-West";
        case (deg >= 258.75 && deg < 281.25):
            return "West";
        case (deg >= 281.25 && deg < 303.75):
            return "West-North-West";
        case (deg >= 303.75 && deg < 326.25):
            return "North-West";
        case (deg >= 326.25 && deg < 348.75):
            return "North-North-West";
        default:
            return "Unknown";
    }
}

