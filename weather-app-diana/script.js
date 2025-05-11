document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const cityInput = document.getElementById('city-input')
    const searchBtn = document.getElementById('search-btn')
    const locationBtn = document.getElementById('location-btn')
    const cityName = document.getElementById('city-name')
    const currentDate = document.getElementById('current-date')
    const weatherIcon = document.getElementById('weather-icon')
    const currentTemp = document.getElementById('current-temp')
    const weatherDescription = document.getElementById('weather-description')
    const humidity = document.getElementById('humidity')
    const windSpeed = document.getElementById('wind-speed')
    const feelsLike = document.getElementById('feels-like')
    const forecastContainer = document.getElementById('forecast-container')
    const currentWeatherCard = document.querySelector('.current-weather')
  
    // Weather condition data
    const weatherConditions = [
      { type: 'sunny', description: 'Sunny', icon: '01d', tempRange: [20, 35] },
      { type: 'partly-cloudy', description: 'Partly Cloudy', icon: '02d', tempRange: [15, 25] },
      { type: 'cloudy', description: 'Cloudy', icon: '03d', tempRange: [10, 20] },
      { type: 'rainy', description: 'Rainy', icon: '09d', tempRange: [5, 15] },
      { type: 'thunderstorm', description: 'Thunderstorm', icon: '11d', tempRange: [5, 15] },
      { type: 'snowy', description: 'Snowy', icon: '13d', tempRange: [-10, 0] },
      { type: 'misty', description: 'Misty', icon: '50d', tempRange: [5, 15] },
    ]
  
    // Initialize with default city
    generateRandomWeather('Manila')
  
    // Event Listeners
    searchBtn.addEventListener('click', () => {
      const city = cityInput.value.trim()
      if (city) {
        generateRandomWeather(city)
      }
    })
  
    cityInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        const city = cityInput.value.trim()
        if (city) {
          generateRandomWeather(city)
        }
      }
    })
  
    locationBtn.addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords
            // Generate random weather for coordinates
            const randomCity = getRandomCity()
            generateRandomWeather(randomCity)
          },
          error => {
            alert('Unable to retrieve your location. Using random city instead.')
            const randomCity = getRandomCity()
            generateRandomWeather(randomCity)
          }
        )
      } else {
        alert('Geolocation not supported. Using random city instead.')
        const randomCity = getRandomCity()
        generateRandomWeather(randomCity)
      }
    })
  
    // Generate random weather data
    function generateRandomWeather(city) {
      // Random current weather
      const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)]
      const randomTemp = getRandomInt(randomCondition.tempRange[0], randomCondition.tempRange[1])
      const randomHumidity = getRandomInt(30, 95)
      const randomWindSpeed = getRandomInt(5, 40)
      const randomFeelsLike = randomTemp + getRandomInt(-3, 3)
  
      const currentData = {
        name: city,
        main: {
          temp: randomTemp,
          humidity: randomHumidity,
          feels_like: randomFeelsLike,
        },
        wind: { speed: randomWindSpeed / 3.6 }, // Convert to m/s for consistency
        weather: [
          {
            description: randomCondition.description,
            icon: randomCondition.icon,
            main: randomCondition.type,
          },
        ],
      }
  
      // Generate random forecast
      const forecastData = {
        list: Array.from({ length: 40 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() + Math.floor(i / 8))
  
          const dayCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)]
          const dayTempRange = dayCondition.tempRange
          const dayTemp = getRandomInt(dayTempRange[0], dayTempRange[1])
  
          return {
            dt: Math.floor(date.getTime() / 1000),
            main: {
              temp: dayTemp,
              temp_min: dayTemp - getRandomInt(1, 3),
              temp_max: dayTemp + getRandomInt(1, 3),
            },
            weather: [
              {
                icon: dayCondition.icon,
                main: dayCondition.type,
              },
            ],
          }
        }),
      }
  
      updateWeatherUI(currentData, forecastData)
    }
  
    // Update UI with weather data
    function updateWeatherUI(currentData, forecastData) {
      // Update current weather
      cityName.textContent = currentData.name
  
      const now = new Date()
      currentDate.textContent = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
  
      currentTemp.textContent = `${Math.round(currentData.main.temp)}°C`
      weatherDescription.textContent = currentData.weather[0].description
      humidity.textContent = `${currentData.main.humidity}%`
      windSpeed.textContent = `${Math.round(currentData.wind.speed * 3.6)} km/h`
      feelsLike.textContent = `${Math.round(currentData.main.feels_like)}°C`
      weatherIcon.src = `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`
      weatherIcon.alt = currentData.weather[0].main
  
      // Update background based on weather condition
      updateWeatherBackground(currentData.weather[0].main)
  
      // Update forecast
      updateForecastUI(forecastData)
  
      // Clear input
      cityInput.value = ''
    }
  
    // Update forecast cards
    function updateForecastUI(forecastData) {
      forecastContainer.innerHTML = ''
  
      // Filter to get one forecast per day
      const dailyForecasts = []
      const daysAdded = new Set()
  
      forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000)
        const day = date.toLocaleDateString('en-US', { weekday: 'short' })
  
        // Only add one forecast per day
        if (!daysAdded.has(day)) {
          daysAdded.add(day)
          dailyForecasts.push({
            day,
            temp: Math.round(item.main.temp),
            temp_min: Math.round(item.main.temp_min),
            temp_max: Math.round(item.main.temp_max),
            icon: item.weather[0].icon,
            description: item.weather[0].main,
          })
        }
  
        // Limit to 5 days
        if (dailyForecasts.length >= 5) return
      })
  
      // Create forecast cards
      dailyForecasts.forEach(day => {
        const forecastCard = document.createElement('div')
        forecastCard.className = 'forecast-card'
  
        forecastCard.innerHTML = `
                  <h4>${day.day}</h4>
                  <img src="https://openweathermap.org/img/wn/${day.icon}.png" alt="${day.description}">
                  <p class="temp-range">${day.temp_min}° / ${day.temp_max}°</p>
                  <p>${day.description}</p>
              `
  
        forecastContainer.appendChild(forecastCard)
      })
    }
  
    // Update background based on weather condition
    function updateWeatherBackground(condition) {
      // Remove all weather classes
      currentWeatherCard.classList.remove(
        'weather-sunny',
        'weather-cloudy',
        'weather-rainy',
        'weather-thunderstorm',
        'weather-snowy',
        'weather-misty'
      )
  
      // Add appropriate class
      switch (condition.toLowerCase()) {
        case 'sunny':
        case 'clear':
          currentWeatherCard.classList.add('weather-sunny')
          break
        case 'clouds':
        case 'partly-cloudy':
          currentWeatherCard.classList.add('weather-cloudy')
          break
        case 'rain':
        case 'drizzle':
          currentWeatherCard.classList.add('weather-rainy')
          break
        case 'thunderstorm':
          currentWeatherCard.classList.add('weather-thunderstorm')
          break
        case 'snow':
          currentWeatherCard.classList.add('weather-snowy')
          break
        case 'mist':
        case 'fog':
        case 'haze':
          currentWeatherCard.classList.add('weather-misty')
          break
        default:
          currentWeatherCard.style.background = 'linear-gradient(135deg, #4361ee 0%, #4cc9f0 100%)'
      }
    }
  
    // Helper functions
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }
  
    function getRandomCity() {
      const cities = [
        'New York',
        'London',
        'Tokyo',
        'Paris',
        'Sydney',
        'Berlin',
        'Rome',
        'Moscow',
        'Dubai',
        'Toronto',
        'Beijing',
        'Rio de Janeiro',
        'Cape Town',
        'Mumbai',
        'Bangkok',
      ]
      return cities[Math.floor(Math.random() * cities.length)]
    }
  })
  