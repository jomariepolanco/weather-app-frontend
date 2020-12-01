//STATE AND BASEURL
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather'
const key = config.SECRET_API_KEY
let currentUser = 0


//DOM ELEMENTS
const weatherDiv = document.querySelector('#weather')
const submitForm = document.querySelector('#search-cities')
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

//EVENT LISTENERS

loginForm.addEventListener('submit', event => {
    event.preventDefault()
    const setUser = event.target.username.value
    fetchAllUsers(setUser)
    //not a great idea but should work
})

submitForm.addEventListener("submit", event => {
    event.preventDefault()
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
    contentDiv.style.visibility = "hidden"
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

// const fetchCityNames = userId => {
//     if (currentUser != 0) {
//     fetch(`http://localhost:3000/users/${userId}`)
//     .then(r => r.json())
//     .then(userData => {
//         console.log(userData)
//         renderSideBar(userData)
//     })}
// }

const fetchAllUsers = (setUser) => {
    return fetch(`http://localhost:3000/users/`)
    .then(r => r.json())
    .then(users => setCurrentUser(users, setUser))
}

const autocompleteCountries = () => {
    fetch('http://localhost:3000/cities')
    .then(r => r.json())
    .then()
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
    contentDiv.style.visibility = "visible"
    fetchCityWeather(setUserObj.cities[0].search_id,key)
    logBtn.textContent = "Log Out"
}



//INITIALIZE

// const initialize = () => {
// //   fetchCityWeather(syracuse, key)
//   fetchCityNames(currentUser)
// }

// initialize()