export async function geocodeCity(city) {
    const GEOCODING_API_KEY = process.env.GOOGLE_GEOCODING_API_KEY;

    if (!city) {
    throw new Error("City name is required");
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${GEOCODING_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
    throw new Error("Failed to fetch geocoding data");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
    throw new Error("City not found");
    }

    return data.results.map(result => {
        const { lat, lng: lon } = result.geometry.location;
        const address = result.address_components;
        const cityComp = address.find(comp => comp.types.includes("locality"));
        const stateComp = address.find(comp => comp.types.includes("administrative_area_level_1"));
        const countryComp = address.find(comp => comp.types.includes("country"));

        return {
            name: cityComp?.long_name ?? city,
            state: stateComp?.long_name ?? "", 
            country: countryComp?.short_name ?? "", 
            lat, 
            lon };
    })
}
