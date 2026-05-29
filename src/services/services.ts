export async function reverseGeolocation(lat: number, lon: number) {
    try {
        const response = await fetch(
            `https://api.tomtom.com/search/2/reverseGeocode/${lat},${lon}.json?key=${import.meta.env.VITE_MAPS_API_KEY}&radius=100&language=pt-BR`
        );

        if(!response.ok)
            throw(`A requisição retornou ${response.status}-${response.statusText}`);

        const json = await response.json();

        const local =
            json.addresses[0]?.address?.freeformAddress ||
            `Latitude: ${lat} Longitude: ${lon}`;

        return {
            latitude: lat,
            longitude: lon,
            formated: local
        }
    } catch(e: unknown) {
        if (e instanceof Error) {
            console.error(
                `Ocorreu um erro na geolocalização: ${e.message}`
            );
        } else {
            console.error(
                "Ocorreu um erro desconhecido na geolocalização"
            );
        }
    }
    
    return {
        latitude: lat,
        longitude: lon,
        formated: `Latitude: ${lat} Longitude: ${lon}`
    }
}

