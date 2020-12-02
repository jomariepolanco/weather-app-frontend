//STATE AND BASEURL
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather'
const key = config.SECRET_API_KEY
let currentUser = 0


//DOM ELEMENTS
const weatherDiv = document.querySelector('#weather')
const sidebar = document.querySelector('#sidebar')
const currentCity = document.querySelector('#current-city')
const cloudsDiv = document.querySelector('#clouds')
const windDiv = document.querySelector('#wind')
const tempDiv = document.querySelector('#temperature')
const miscDiv = document.querySelector('#miscellaneous')
const logBtn = document.querySelector('#log-btn')
const contentDiv = document.querySelector('#content')
const loginForm = document.querySelector('#login-form')
const sandbox = document.querySelector('#sandbox')
const searchForm = document.querySelector('#search-cities')


//EVENT LISTENERS

searchForm.addEventListener('submit', event => {
    event.preventDefault()
    const city = event.target.city.value
    fetchOneCity(city)
    searchForm.reset()
})

loginForm.addEventListener('submit', event => {
    event.preventDefault()
    const setUser = event.target.username.value
    fetchAllUsers(setUser)
    //not a great idea but should work
})

sidebar.addEventListener("click", event => {
    // console.log(event.target.dataset.id)
    if(event.target.tagName === "H3") {
        fetchCityWeather(event.target.dataset.id, key)
    }
})

logBtn.addEventListener("click", (event) => {
    currentUser = 0
    sidebar.style.display = "none"
    contentDiv.style.display = "none"
    loginForm.style.display = ""
    alert("You have successfully logged out.")
    loginForm.reset()
})

//FETCH REQUESTS

const fetchCityWeather = (cityId,apiKey) => {
  fetch(`${baseUrl}?id=${cityId}&units=imperial&appid=${apiKey}`)
    .then(r => r.json())
    .then(cityWeather => renderWeather(cityWeather))
}

const fetchAllUsers = (setUser) => {
    return fetch(`http://localhost:3000/users/`)
    .then(r => r.json())
    .then(users => setCurrentUser(users, setUser))
}

const fetchAllCities = () => {
    fetch('http://localhost:3000/cities')
    .then(r => r.json())
    .then(cities => console.log("hi"))
}

const fetchOneCity = (city) => {
    return fetch(`http://localhost:3000/search/${city}`)
    .then(r => r.json())
    .then(cities => {
        if (cities.length > 1) {
            renderChooseCorrectCity(cities)
        } else {
            fetchCityWeather(cities[0].search_id, key)
        }
    })
}

//RENDER FUNCTIONS

const renderSideBar = userObj => {
    userObj.cities.forEach(city => {
        const div = document.createElement("div")
        div.className = city.name 
        const h3 = document.createElement("h3")
        h3.dataset.id = city.search_id
        h3.textContent = city.name 
        div.append(h3)
        sidebar.append(div)
        /*renderWeather(userObj.home) create migration for
        home city for user so that it can be used to populate
        the content. creates a faux login, but allows us to
        swap users */
    })
}

const renderWeather = (weather) => {
    contentDiv.style.display = ""

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
}

const setCurrentUser = (users, setUser) => {
    const setUserObj = users.find(user => user.username === setUser)
    currentUser = setUserObj

    sidebar.style.display = ""
    renderSideBar(setUserObj)
    loginForm.style.display = "none"
    contentDiv.style.display = ""
    fetchCityWeather(setUserObj.cities[0].search_id,key)
    logBtn.textContent = "Log Out"
}

const renderChooseCorrectCity = (cities) => {
    /* this should be made into a modal instead */
    // contentDiv.style.display = "none"

    const modal = document.querySelector('#modal')
    modal.style.display = "block"
    const chooseCityForm = document.querySelector('#choose-city-form')

    const h1 = document.createElement('h1')
    h1.textContent = "Did you mean..."
    chooseCityForm.append(h1)
    
    cities.forEach(city => {
        const div = document.createElement('div')
        div.dataset.search_id = city.search_id
        div.textContent = `City: ${city.name}, State: ${city.state}, Country: ${city.country}`
        chooseCityForm.append(div)
    })

    chooseCityForm.addEventListener('click', ({target}) => {
        if (target.tagName === 'DIV') {
            fetchCityWeather(target.dataset.search_id, key)
            chooseCityForm.innerHTML = ""
            modal.style.display = "none"
        }
    })
}
