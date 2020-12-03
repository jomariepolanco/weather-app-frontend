//STATE AND BASEURL
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather'
const key = config.SECRET_API_KEY

let currentUser = 0
let holdACity;

const setCurrentUser = (users, setUser) => {
    /* should be refactored as a login method that calls setCurrentUser the way that
    setHoldACity works since half of this function has nothing to do with setting
    the currentUser global variable */

    const setUserObj = users.find(user => user.username === setUser)
    
    currentUser = setUserObj
    setHoldACity(setUserObj.cities[0].id)

    renderSideBar(setUserObj)
    fetchCityWeather(setUserObj.cities[0].search_id, key)

    loginForm.style.display = "none"
    contentDiv.style.display = ""
    sidebar.style.display = ""
    logBtn.textContent = "Log Out"
}

const setHoldACity = (cityId) => {
    fetchCityById(cityId)
        .then(cityObj => holdACity = cityObj)
}

//DOM ELEMENTS
const weatherDiv = document.querySelector('#weather-container')
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
const signup = document.querySelector('#signup')
const cityBtn = document.querySelector(".add-city")


//EVENT LISTENERS

cityBtn.addEventListener("click", (event) => {
    if (cityBtn.textContent == "Delete City") {
        // fetchUserCities()
        //     .then(userCityData => {
        //         const ucArr = userCityData.filter(uc => uc.user_id == currentUser.id)
        //         const ucObj = ucArr.find(uc => uc.city_id == holdACity[0].id)
        //         debugger
        //         // deleteUserCity(ucObj.id)
        //         // document.querySelector(`[data-id='${event.target.dataset.id}']`).remove()
        //         // console.log("successfully deleted")
        //     })
        const userCityData = `${currentUser.id},${holdACity.id}`
        deleteUserCity(userCityData)
    } else if (cityBtn.textContent == "Add City") {
        const newUserCityObj = {
            user_id: currentUser.id,
            city_id: holdACity[0].id,
            want_texts: false,
        }
        createNewUserCity(newUserCityObj)
    }
})

signup.addEventListener('click', () => {
    loginForm['submit-btn'].value = "Sign Up"
    loginForm.addEventListener('submit', event => {
        const newUserObj = {
            username: event.target.username.value,
            name: event.target.name.value,
            phone_number: event.target['phone-number'].value
        }
        createNewUserPost(newUserObj)
    })
})

loginForm.addEventListener('submit', event => {
    event.preventDefault()
    const setUser = event.target.username.value
    fetchAllUsers(setUser)
    //not a great idea but should work
})

searchForm.addEventListener('submit', event => {
    event.preventDefault()
    const cityName = event.target.city.value
    fetchCityByName(cityName)
    searchForm.reset()
})


// sidebar.addEventListener("click", ({target}) => {
//     if(target.tagName === "H3") {
//         const cityObj = fetchCityById(target.dataset.id)
//         cityObj.then(city => setHoldACity(city))
//         fetchCityWeather(target.dataset.search_id, key)
//     }
// })
sidebar.addEventListener("click", ({ target }) => {
    if (target.tagName === "H3") {
        setHoldACity(target.dataset.id)
        fetchCityWeather(target.dataset.search_id, key)
    }
})
logBtn.addEventListener("click", () => {
    currentUser = 0
    sidebar.style.display = "none"
    contentDiv.style.display = "none"
    loginForm.style.display = ""
    alert("You have successfully logged out.")
    loginForm.reset()
})

//FETCH REQUESTS TO RAILS API
const createNewUserCity = userCityObj => {
    fetch('http://localhost:3000/user_cities', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userCityObj)
    })
        .then(r => r.json())
        .then(newData => console.log('Success', newData))
}

const fetchUserCities = () => {
    return fetch('http://localhost:3000/user_cities')
        .then(r => r.json())
}

// const deleteUserCity = (id) => {
//     fetch(`http://localhost:3000/user_cities/${id}`, {
//         method: "DELETE"
//     })
// }
const deleteUserCity = (userCityData) => {
    fetch(`http://localhost:3000/remove/${userCityData}`, {
        method: "DELETE"
    })
}

const createNewUserPost = (userObj) => {
    fetch('http://localhost:3000/users', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userObj)
    })
        .then(r => r.json())
        .then(newUser => fetchAllUsers(newUser.username))
}

const fetchAllUsers = (setUser) => {
    return fetch(`http://localhost:3000/users/`)
        .then(r => r.json())
        .then(users => setCurrentUser(users, setUser))
}

const fetchCityById = (cityId) => {
    return fetch(`http://localhost:3000/cities/${cityId}`)
        .then(r => r.json())
}

const fetchCityByName = (cityName) => {
    return fetch(`http://localhost:3000/search/${cityName}`)
        .then(r => r.json())
        .then(cities => {
            if (cities.length > 1) {
                renderChooseCorrectCity(cities)
            } else if (cities.length === 1) {
                holdACity = cities
                fetchCityWeather(cities[0].search_id, key)
            } else {
                alert("That city does not exist.")
            }
        })
}

// const fetchAllCities = () => {
//     return fetch('http://localhost:3000/cities')
//     .then(r => r.json())
//     .then(cities => {
//         const newUserCity = {
//             user_id: currentUser.id,
//             city_id: Array.from(cities.find(city => city.search_id == cityBtn.dataset.search)),
//             want_texts: false
//         }
//         console.log(newUserCity)
//     // .then(cities => console.log(cities))
//     })
// }

//FETCH REQUESTS TO WEATHER API

const fetchCityWeather = (cityId, apiKey) => {
    fetch(`${baseUrl}?id=${cityId}&units=imperial&appid=${apiKey}`)
        .then(r => r.json())
        .then(cityWeather => renderWeather(cityWeather))
}


//RENDER FUNCTIONS

const renderSideBar = userObj => {
    sidebar.innerHTML = ""

    userObj.cities.forEach(city => {
        const div = document.createElement("div")
        div.className = city.name
        const h3 = document.createElement("h3")
        h3.dataset.id = city.id
        h3.dataset.search_id = city.search_id
        h3.textContent = city.name

        div.append(h3)
        sidebar.append(div)

        cityBtn.dataset.id = city.id
        /*renderWeather(userObj.home) create migration for
        home city for user so that it can be used to populate
        the content. creates a faux login, but allows us to
        swap users */
    })
}

const renderWeather = (weather) => {
    // console.log(holdACity)

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
    tempDiv.innerHTML = `
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
    cityBtn.dataset.search = weather.id
    const sideBarContent = Array.from(sidebar.querySelectorAll("div")).map(div => div.textContent)
    if (sideBarContent.includes(weather.name)) {
        cityBtn.textContent = "Delete City"
    } else {
        cityBtn.textContent = "Add City"
    }
}


const renderChooseCorrectCity = (cities) => {
    const modal = document.querySelector('#modal')
    modal.style.display = "block"
    const chooseCityForm = document.querySelector('#choose-city-form')

    const h1 = document.createElement('h1')
    h1.textContent = "Did you mean..."
    chooseCityForm.append(h1)

    cities.forEach(city => {
        const div = document.createElement('div')
        div.dataset.search_id = city.search_id
        div.dataset.rails_id = city.id
        div.textContent = `City: ${city.name}, State: ${city.state}, Country: ${city.country}`
        chooseCityForm.append(div)
    })

    chooseCityForm.addEventListener('click', ({ target }) => {
        if (target.tagName === 'DIV') {
            fetchCityWeather(target.dataset.search_id, key)
            setHoldACity(target.dataset.rails_id)
            chooseCityForm.innerHTML = ""
            modal.style.display = "none"
        }
    })
}

