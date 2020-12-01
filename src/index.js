//STATE AND BASEURL
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather'
const key = config.SECRET_API_KEY

const andover = '4146039'
const syracuse = '5140405'

//DOM ELEMENTS
const weatherDiv = document.querySelector('#weather')
const submitForm = document.querySelector('#search-cities')
const sidebar = document.querySelector('#sidebar')
const currentCity = document.querySelector('#current-city')
const cloudsDiv = document.querySelector('#clouds')
const windDiv = document.querySelector('#wind')
const tempDiv = document.querySelector('#temperature')
const miscDiv = document.querySelector('#miscellaneous')


//EVENT LISTENERS
submitForm.addEventListener("submit", event => {
    event.preventDefault()
    
})

sidebar.addEventListener("click", event => {
    if(event.target.tagName === "DIV") {
        fetchCityWeather(event.target.dataset.id, key)
    }
})

//FETCH REQUESTS
const fetchCityWeather = (cityId,apiKey) => {
  fetch(`${baseUrl}?id=${cityId}&units=imperial&appid=${apiKey}`)
    .then(r => r.json())
    .then(cityWeather => {
        console.log(cityWeather)
        renderWeather(cityWeather)
    })
}

const fetchCityNames = userId => {
    fetch(`http://localhost:3000/users/${userId}`)
    .then(r => r.json())
    .then(userData => renderSideBar(userData))
}

const autocompleteCountries = () => {
    fetch('http://localhost:3000/cities')
    .then(r => r.json())
    .then()
}
// renderWeather(cityWeather)

//RENDER FUNCTIONS

const renderSideBar = userObj => {
    const div = document.createElement("div")
    userObj.cities.forEach(city => {
        div.className = city.name 
        div.dataset.id = city.search_id
        const h3 = document.createElement("h3")
        h3.textContent = city.name 
        div.append(h3)
        sidebar.append(div)
    })
}

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
    <p>${weather.wind.speed} MPH</p>
    `
    tempDiv.innerHTML= `
    <h3>Temperature</h3>
    <p>Feels Like: ${weather.main.feels_like}F</p>
    <p>Humidity: ${weather.main.humidity}%</p>
    <p>Temperature: ${weather.main.temp}F</p>
    <p>Max Temp: ${weather.main.temp_max}F</p>
    <p>Min Temp: ${weather.main.temp_min}F</p>
    `
    miscDiv.innerHTML = `
    <h3>Misc</h3>
    <p>Sunrise: ${weather.sys.sunrise} UTC</p>
    <p>Sunset: ${weather.sys.sunset} UTC</p>
    <p>Visibility: ${weather.visibility} meters</p>
    `
//   weatherDiv.textContent = `Current Weather: ${weather.weather[0].description}`
}

//INITIALIZE

const initialize = () => {
  fetchCityWeather(syracuse, key)
}

initialize()