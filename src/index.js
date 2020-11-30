//STATE AND BASEURL
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather'
const andover = '4146039'
const syracuse = '5140405'

//DOM ELEMENTS
const weatherDiv = document.querySelector('#weather')
const submitForm = document.querySelector('#search-cities')
const currentCity = document.querySelector('#current-city')
const cloudsDiv = document.querySelector('#clouds')
const windDiv = document.querySelector('#wind')
const tempDiv = document.querySelector('#temperature')
const miscDiv = document.querySelector('#miscellaneous')


//EVENT LISTENERS
submitForm.addEventListener("submit", event => {
    event.preventDefault()
    
})

//FETCH REQUESTS
const fetchCityWeather = (cityId,apiKey) => {
  fetch(`${baseUrl}?id=${cityId}&appid=${apiKey}`)
    .then(r => r.json())
    .then(cityWeather => {
        console.log(cityWeather)
        renderWeather(cityWeather)
    })
}

const autocompleteCountries = () => {
    fetch('http://localhost:3000/cities')
    .then(r => r.json())
    .then()
}
// renderWeather(cityWeather)

//RENDER FUNCTIONS

const renderWeather = (weather) => {
    currentCity.innerHTML = `
        <h3>${weather.name}</h3>
        <p>${weather.sys.country}</p>
    `
    cloudsDiv.innerHTML = `
    <h3>${weather.weather[0].description}</h3>
    <img src='http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png'>
    `
    windDiv.innerHTML = `
    <h3>Wind</h3>
    <p>${weather.wind.deg} Degrees</p>
    <p>${weather.wind.speed} meters per second</p>
    `
    tempDiv.innerHTML= `
    <h3>Temperature</h3>
    <p>Feels Like: ${weather.main.feels_like}K</p>
    <p>Humidity: ${weather.main.humidity}</p>
    <p>Temperature: ${weather.main.temp}K</p>
    <p>Max Temp: ${weather.main.temp_max}K</p>
    <p>Min Temp: ${weather.main.temp_min}K</p>
    `
    miscDiv.innerHTML = `
    <h3>
    `
//   weatherDiv.textContent = `Current Weather: ${weather.weather[0].description}`
}

//INITIALIZE

const initialize = () => {
  fetchCityWeather(syracuse,'c8c7e5d5fe8413c8c85426305dcc87e0')
}

initialize()