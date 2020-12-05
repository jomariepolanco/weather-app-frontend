//STATE AND BASEURL
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather'
const key = config.SECRET_API_KEY

let currentUser = 0
let holdACity;

const setCurrentUser = (users, setUser) => {
    /* should be refactored as a login method that calls setCurrentUser the way that
    setHoldACity works since half of this function has nothing to do with setting
    the currentUser global variable */
    signUpCont.style.display = "none"
    signUpForm.style.display = "none"
    const setUserObj = users.find(user => user.username === setUser)
    currentUser = setUserObj
    // debugger
    renderSideBar(setUserObj)
    fetchCityWeather(setUserObj.home_city, key)

    loginForm.style.display = "none"
    loginCont.style.display = "none"
    contentDiv.style.display = ""
    sidebar.style.display = ""
    logBtn.textContent = "Log Out"
    homeBtn.style.display = "none"
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
const hourlyDiv = document.querySelector('#hourly-weather')
const dailyDiv = document.querySelector('#daily-weather')
const logBtn = document.querySelector('#log-btn')
const contentDiv = document.querySelector('#content')
const loginForm = document.querySelector('#login-form')
const loginCont = document.querySelector('.login-form-container')
const signUpForm = document.querySelector('#signup-form')
const signUpCont = document.querySelector('.signup-form-container')
const sandbox = document.querySelector('main')
const searchForm = document.querySelector('#search-cities')
const signUp = document.querySelector('.sign-up')
const logIn = document.querySelector('.log-in')
const cityBtn = document.querySelector(".add-city")
const homeBtn = document.querySelector("#make-home-btn")


//EVENT LISTENERS

homeBtn.addEventListener('click', ({ target }) => {

    setHomeCityFetch()
})

cityBtn.addEventListener("click", () => {
    if (cityBtn.textContent == "Delete City") {
        const userCityData = `${currentUser.id},${holdACity.id}`
        deleteUserCity(userCityData)
        removeSidebarObj(holdACity)
        alert("City successfully removed.")
        cityBtn.textContent = "Add City"
    } else if (cityBtn.textContent == "Add City") {
        renderSidebarObj(holdACity)
        const newUserCityObj = {
            user_id: currentUser.id,
            city_id: holdACity.id,
            want_texts: false,
        }
        createNewUserCity(newUserCityObj)
        cityBtn.textContent = "Delete City"
    }
})

signUp.addEventListener('click', () => {
    loginCont.style.display = "none"
    signUpCont.style.display = ""
    signUpForm.style.display = ""
    signUpForm.addEventListener('submit', event => {
        console.log('clicked')
        // const newUserObj = {
        //     username: event.target.username.value,
        //     name: event.target.name.value,
        //     phone_number: event.target['phone-number'].value,
        //     home_city: 5128638
        // }
        // createNewUserPost(newUserObj)
    })
})

logIn.addEventListener('click', () => {
    loginCont.style.display = ""
    signUpCont.style.display = "none"
})

loginForm.addEventListener('submit', event => {
    event.preventDefault()
    const setUser = event.target.username.value
    if (setUser) {
        fetchAllUsers(setUser)
    }
    //not a great idea but should work
})

searchForm.addEventListener('submit', event => {
    event.preventDefault()
    const cityName = event.target.city.value
    fetchCityByName(cityName)
    searchForm.reset()
})

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
    loginCont.style.display = ""

    // alert("You have successfully logged out.")
    loginForm.reset()
})

//FETCH REQUESTS TO RAILS API
const setHomeCityFetch = () => {
    const homeObj = { home_city: holdACity.search_id }
    fetch(`http://localhost:3000/users/${currentUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(homeObj)
    })
        .then(r => r.json())
        .then(updatedUser => {
            currentUser = updatedUser
            homeBtn.style.display = "none"
        })
}

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
                holdACity = cities[0]
                fetchCityWeather(holdACity.search_id, key)
            } else {
                alert("That city does not exist.")
            }
        })
}

//FETCH REQUESTS TO WEATHER API

const fetchCityWeather = (cityId, apiKey) => {
    fetch(`${baseUrl}?id=${cityId}&units=imperial&appid=${apiKey}`)
        .then(r => r.json())
        .then(cityWeather => renderWeather(cityWeather))
}

const fetchCityHourlyWeather = (lat, lon, apiKey) => {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,alerts&appid=${apiKey}`)
    .then(r => r.json())
    .then(hourlyWeather => renderHourlyWeather(hourlyWeather))
}

// const fetchCityDailyWeather = (cityName, apiKey) => {
//     fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`)
//     .then(r => r.json())
//     .then(dailyWeather => renderDailyWeather(dailyWeather))
// }


//RENDER FUNCTIONS

const renderSideBar = userObj => {
    sidebar.innerHTML = ""
    userObj.cities.forEach(city => renderSidebarObj(city))
}

const renderSidebarObj = (cityObj) => {
    const div = document.createElement("div")
    div.className = cityObj.name
    div.id = cityObj.id

    const h3 = document.createElement("h3")
    h3.dataset.id = cityObj.id
    h3.dataset.search_id = cityObj.search_id
    h3.textContent = cityObj.name

    div.append(h3)
    sidebar.append(div)

    cityBtn.dataset.id = cityObj.id
}

const removeSidebarObj = (cityObj) => {
    const removeThisElement = document.querySelector(`[id='${cityObj.id}']`)
    removeThisElement.remove()
}

const renderWeather = (weather) => {
    // console.log(holdACity)

    contentDiv.style.display = ""
    currentCity.innerHTML = `
    <table class="city-name">
        <tr>
        <td><h1>${weather.name} ${weather.sys.country}</h1><td>
        <td><img src='http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png'>
            <h4>${weather.weather[0].description}</h4>
        </td>
        </tr>
    </table>
    `
    tempDiv.innerHTML = `
    <table class="sunrise">
        <tr>
            <td><h1>${weather.main.temp}F</h1></td>
            <td>🌞${weather.sys.sunrise}</td>
            <td>🌚${weather.sys.sunset}</td>
        </tr>
    </table>
    <table class="feels-like">
        <tr>
            <td>🌡 Feels Like</td>
            <td>${weather.main.feels_like}F</td>
            <td>💨 Wind</td>
            <td>${weather.wind.speed} MPH </td>
        </tr>
        <tr>
            <td>🔆 High</td>
            <td>${weather.main.temp_max}F</td>
            <td>❄️ Low</td> 
            <td>${weather.main.temp_min}F</td>
        </tr>
        <tr>
            <td>💧 Humidity</td>
            <td>${weather.main.humidity}%</td>
            <td>👁‍🗨 Visibility</td>
            <td>${weather.visibility} meters</td>
        </tr>
    </table>
    `
    cityBtn.dataset.search = weather.id
    const sideBarContent = Array.from(sidebar.querySelectorAll("div")).map(div => div.textContent)

    if (sideBarContent.includes(weather.name)) {
        cityBtn.textContent = "Delete City"
        if (holdACity && currentUser.home_city != holdACity.search_id) {
            homeBtn.style.display = ""
        } else {
            homeBtn.style.display = "none"
        }
    } else {
        cityBtn.textContent = "Add City"
        homeBtn.style.display = "none"
    }
    fetchCityHourlyWeather(weather.coord.lat, weather.coord.lon, key)
    // fetchCityDailyWeather(weather.name, key)

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
        div.textContent = `${city.name}, ${city.state}, ${city.country}`
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

const renderHourlyWeather = (hourlyData) => {
    // console.log(hourlyData)
    const tableHeader = hourlyDiv.querySelector(".time")
    tableHeader.innerHTML = ""
    const tableData = hourlyDiv.querySelector(".weather-data")
    tableData.innerHTML= ""
    const weatherIcon = hourlyDiv.querySelector(".weather-icon")
    const humidity = hourlyDiv.querySelector(".humidity")
    // debugger
    hourlyData.hourly.splice(0, 6).forEach(hour => {
        const newHeader = document.createElement("th")
        newHeader.textContent = convertTime(hour.dt)
        const temperature = document.createElement("td")
        temperature.textContent = `${hour.temp}F` 
        const iconTableD = document.createElement("td")
        const icon = document.createElement("img")
        icon.src = `http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`
        const humidD = document.createElement("td")
        humidD.textContent = `💦 ${hour.humidity}%`
        humidity.append(humidD)
        iconTableD.append(icon)
        weatherIcon.append(iconTableD)
        tableHeader.append(newHeader)
        tableData.append(temperature)
    })
}

// const renderDailyWeather = dailyWeatherData => {
//     const tableHeader = dailyDiv.querySelector('.day')
//     const tableHighW = dailyDiv.querySelector('.high')
//     const tableLowW = dailyDiv.querySelector('.low')
//     const tableIcon = dailyDiv.querySelector('.weather-icon')
//     const tableHumidity = dailyDiv.querySelector('.humidity')
//     dailyWeatherData.list.forEach(day => {
//         const newHeader = document.createElement("th")
//         newHeader.textContent = day.dt_txt

//         tableHeader.append(newHeader)
//     })
// }

//HELPER FUNCTIONS

const convertTime = unixTime => {
    const newTime = new Date(unixTime * 1000)
    const hours = newTime.getHours()
    let minutes = newTime.getMinutes()
    if (minutes == 0) {
        minutes = "00"
    }
    if (hours >= 12) {
        return `${hours}:${minutes} PM`
    } else {
        return `${hours}:${minutes} AM`
    }
}

