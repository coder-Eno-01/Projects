const BACKEND_BASE_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8080"               // If running locally
        : "https://weather-app-enovative-tech-12110bd1.koyeb.app",
        cityInput = document.querySelector(".weatherData input"),
        cityName = document.getElementById("cityName"),
        temperature = document.getElementById("temp"),
        desc = document.getElementById("description"),
        weatherIcon = document.getElementById("icon"),
        err = document.getElementById("error"),
        weatherData = document.querySelector(".weatherData"),
        searchButton = document.querySelector(".weatherData button"),
        showData = document.querySelector("#showData"),
        locaxn = document.getElementById("location");

const   moreInfo = document.getElementById("moreInfo"),
        moreInfoText = document.querySelector("#moreInfo h5"),
        moreInfoImg = document.querySelector("#moreInfo img"),
        expand = "https://www.svgrepo.com/show/379885/collapse-down.svg",
        collapse = "https://www.svgrepo.com/show/379888/collapse-up.svg",
        feelsLike = document.getElementById("feelsLikeTemp"),
        tempMin = document.getElementById("minTemp"),
        tempMax = document.getElementById("maxTemp"),
        fpa = document.getElementById("pressure"),
        humid = document.getElementById("humidityValue"),
        windSpeed = document.getElementById("windSpeed"),
        windDeg = document.getElementById("windDeg"),
        windDir = document.getElementById("windDegDesc"),
        percnt = document.getElementById("percent"),
        typ = document.getElementById("type"),
        excessInfo = document.querySelectorAll(".card2");

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
    excessInfo.forEach(element => element.classList.toggle("excessInfo"))

    const hidden = excessInfo[0].classList.contains("excessInfo");

    moreInfoText.textContent = (!hidden) ? "Less Info" : "More Info";
    moreInfoImg.src = (!hidden) ? collapse : expand;
    if (!hidden) displayMoreInfo()
}

locaxn.onclick = () => {
    if (!navigator.geolocation) {
        displayError("Geolocation not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude: lat, longitude: lon } = position.coords;

            try {
                fetchedData.updateGeoData({ name: "Your Current Location" , lat: lat, lon: lon});
                const weather = await getWeather(fetchedData.geo_data);
                fetchedData.updateData(weather);
                displayWeather();
            } catch (err) {
                displayError("Failed to fetch weather for your location.");
            }
        },
        (error) => {
            console.error(error);
            console.log(error.code)
            switch(error.code){
                case 1:
                    displayError("Location permission denied.\nPlease type it in using the search function");
                    break;
                    
                default:
                    displayError("Failed to fetch weather for your location!\nPlease type it in using the search function")
            }
        }
    );
}

async function getCoordinates(city){
    const geoUrl = `${BACKEND_BASE_URL}/geocode?city=${encodeURIComponent(city)}`;
    const response = await fetch(geoUrl);

    if (!response.ok){
        throw new Error("Failed to fetch coordinates");
    }

    const data = await response.json();
    console.log(data)

    if (!data || data.length === 0){
        throw new Error("City not found");
    }

    return data;
}

async function selectionProcess(city){
    const data = await getCoordinates(city);
    fetchedData.updateGeoData(data);

    return fetchedData.geo_data.length === 1;     // Return true if only one location found, else false for multiple options
}

async function getWeather(geoData){
    const { lat, lon } = geoData;

    const weatherUrl = `${BACKEND_BASE_URL}/weather?lat=${lat}&lon=${lon}`;
    const response = await fetch(weatherUrl);

    if (!response.ok){
        throw new Error("Failed to fetch weather data");
    }

    const data = await response.json();
    return data;
}

function displayWeather(){
    const { name: city, country: nation, state: province } = fetchedData.geo_data;
    const { temperature: temp, 
            weatherCondition: {text, iconBaseUri}
        } = fetchedData.weather_data;

    err.style.display = "none";
    cityName.style.display = "block";
    temperature.style.display = "block";
    desc.style.display = "block";
    weatherIcon.style.display = "block";

    cityName.textContent = `${city} (${nation})\n${province}`;
    temperature.textContent = `${Math.round(temp)}°C`;
    desc.textContent = text;
    weatherIcon.src = `${iconBaseUri}.png`;
    moreInfo.style.display = "block";
}

function displayMoreInfo(){
    const {
        currentConditions: {
            minTemperature: temp_min, 
            maxTemperature: temp_max
        },
        feelsLikeTemperature: feels_like,
        airPressure: pressure,
        wind: {
            degrees: deg, 
            cardinal: dir,
            speed:  wind_speed
        },
        relativeHumidity: humidity,
        precipitation: {percent, type}
    } = fetchedData.weather_data;

    feelsLike.textContent = `${Math.round(feels_like)}°C`;
    tempMin.textContent = `${Math.round(temp_min)}°C`;
    tempMax.textContent = `${Math.round(temp_max)}°C`;
    fpa.textContent = `${(pressure / 10).toFixed(1)} kPa`;
    humid.textContent = `${humidity}%`;
    windDeg.textContent = `${deg}°`;
    windSpeed.textContent = `${wind_speed} km/h`;
    windDir.textContent = `Coming from ${dir}`;
    percnt.textContent = `${percent}%`;
    typ.textContent = `${type.toUpperCase()}`
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
    resetData();
    excessInfo.forEach(element => element.classList.add("excessInfo"));
    moreInfoText.textContent = "More Info";
    moreInfoImg.src = expand;
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

async function wakeBackend() {
    try {
        err.textContent = "Waking up the backend"
        const response = await fetch(`${BACKEND_BASE_URL}/health`);

        if (!response.ok) {
            switch (response.status) {
                case 500:
                case 502:
                case 503:
                    displayError("The server is currently unavailable.\nPlease try again in a moment.");
                    break;

                case 404:
                    displayError(
                        "Service endpoint not found.\n" +
                        "Please contact fragmentsdeveloper@gmail.com\n" +
                        "Subject: Weather App (Backend error 404)");
                    break;

                default:
                    displayError("Unexpected server response.\nPlease try again later.");
            }

            throw new Error(`Health check failed with status ${response.status}`);
        }

    } catch (err) {
        console.error("Backend wake failed:", err);
        displayError("Unable to reach the server. Please check your internet connection and try again.");
        throw err;
    }
}

async function startServer(){
    try{
    await wakeBackend()
    document.getElementById("loader").style.display = "none";
    error.style.display = "none";
    weatherIcon.style.display = "block";
    }

    catch(error){
        console.error(error);
        displayError("Please reload page") 
    }
}

startServer();

