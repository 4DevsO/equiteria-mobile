import axios from 'axios';
import secrets from './secrets.json';

const api = axios.create({
  baseURL: secrets.baseURL,
  headers: {
    apikey: secrets.apikey,
  },
});

export const reverseGeoLocation = async ({latitude, longitude}) => {
  if (latitude && longitude) {
    const url = 'https://maps.googleapis.com/maps/api/geocode/json';
    try {
      const responseMaps = await axios.get(url, {
        params: {
          address: `${latitude},${longitude}`,
          key: secrets.gMapsAPIKey,
        },
      });
      if (responseMaps.data.results[1]) {
        return responseMaps.data.results[1].formatted_address;
      }
      return responseMaps.data.results[0].formatted_address;
    } catch (e) {
      console.log('<error>', e);
      return `${latitude} x ${longitude}`;
    }
  }
};

export default api;
