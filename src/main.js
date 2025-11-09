import './style.css'
import { setupCounter } from './counter.js'
import { fetchBerlinWeather, fetchWeatherData, processTemperatureData } from './weather.js'

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Weather App</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <div class="weather-section">
      <h2>Berlin Weather Data</h2>
      <button id="fetch-weather" type="button">Fetch Weather Data</button>
      <div id="weather-result"></div>
    </div>
    <p class="read-the-docs">
      Click on the buttons to see the weather data or counter
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))

// Weather functionality
const fetchWeatherBtn = document.querySelector('#fetch-weather')
const weatherResult = document.querySelector('#weather-result')

fetchWeatherBtn.addEventListener('click', async () => {
  try {
    fetchWeatherBtn.textContent = 'Loading...'
    fetchWeatherBtn.disabled = true
    
    // Fetch Berlin weather data for January 1st, 2022
    const weatherData = await fetchBerlinWeather('2022-01-01')
    
    // Process the temperature data
    const tempStats = processTemperatureData(weatherData)
    
    // Display the results
    weatherResult.innerHTML = `
      <h3>Temperature Statistics for Berlin (2022-01-01)</h3>
      <ul>
        <li><strong>Minimum:</strong> ${tempStats.min}${tempStats.unit}</li>
        <li><strong>Maximum:</strong> ${tempStats.max}${tempStats.unit}</li>
        <li><strong>Average:</strong> ${tempStats.average}${tempStats.unit}</li>
        <li><strong>Data Points:</strong> ${tempStats.count}</li>
      </ul>
    `
    
    console.log('Weather data:', weatherData)
    console.log('Temperature statistics:', tempStats)
    
  } catch (error) {
    weatherResult.innerHTML = `
      <div style="color: red;">
        <strong>Error:</strong> ${error.message}
      </div>
    `
    console.error('Failed to fetch weather data:', error)
  } finally {
    fetchWeatherBtn.textContent = 'Fetch Weather Data'
    fetchWeatherBtn.disabled = false
  }
})
