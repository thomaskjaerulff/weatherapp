/**
 * Weather API module for fetching data from Open-Meteo
 */

const API_BASE_URL = 'https://archive-api.open-meteo.com/v1/archive';

/**
 * Fetches weather data from Open-Meteo API
 * @param {Object} params - API parameters
 * @param {number} params.latitude - Latitude coordinate
 * @param {number} params.longitude - Longitude coordinate
 * @param {string} params.startDate - Start date (YYYY-MM-DD format)
 * @param {string} params.endDate - End date (YYYY-MM-DD format)
 * @param {string} params.hourly - Hourly parameters (e.g., 'temperature_2m')
 * @returns {Promise<Object>} Weather data response
 */
export async function fetchWeatherData(params) {
  const {
    latitude,
    longitude,
    startDate,
    endDate,
    hourly
  } = params;

  // Build query parameters
  const queryParams = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    start_date: startDate,
    end_date: endDate,
    hourly: hourly
  });

  const url = `${API_BASE_URL}?${queryParams}`;

  try {
    console.log('Fetching weather data from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

/**
 * Fetches Berlin weather data for a specific date (convenience function)
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Weather data for Berlin
 */
export async function fetchBerlinWeather(date = '2022-01-01') {
  return fetchWeatherData({
    latitude: 52.52,
    longitude: 13.41,
    startDate: date,
    endDate: date,
    hourly: 'temperature_2m'
  });
}

/**
 * Processes weather data to get temperature statistics
 * @param {Object} weatherData - Raw weather data from API
 * @returns {Object} Temperature statistics
 */
export function processTemperatureData(weatherData) {
  if (!weatherData.hourly || !weatherData.hourly.temperature_2m) {
    throw new Error('Invalid weather data format');
  }

  const temperatures = weatherData.hourly.temperature_2m.filter(temp => temp !== null);
  
  if (temperatures.length === 0) {
    throw new Error('No temperature data available');
  }

  const min = Math.min(...temperatures);
  const max = Math.max(...temperatures);
  const avg = temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;

  return {
    min: parseFloat(min.toFixed(1)),
    max: parseFloat(max.toFixed(1)),
    average: parseFloat(avg.toFixed(1)),
    count: temperatures.length,
    unit: weatherData.hourly_units?.temperature_2m || '°C'
  };
}