const apiKey = "3039da845c40616ddda701cc090928db";
const cityHistory = document.querySelector("#city-history");
const searchBtn = document.querySelector("#search-btn");
const cityInput = document.querySelector("#weather-input");
const forecastSubmit = document.querySelector("#forecast-weather");
const weatherElement = document.querySelector("#current-weather");
const forecastElement = document.querySelector("#forecast-weather");

let pastCities = JSON.parse(localStorage.getItem('cities')) || [];

//submits the form input
const formSubmitHandler = function (event) {
    event.preventDefault();

    const cityInputValue = cityInput.value.trim();
    const city = capitalizeFirstLetter(cityInputValue);
    if (city) {
        weatherSearch();

        cityInput.value = '';
    } else {
        alert('Please enter city.');
    }

}

//add a city

//get past cities
function getPastCitySearches() {
    const pastCities = JSON.parse(localStorage.getItem('cities'));
}
// past cities array handler 
const pastCitiesArrayHandler = function () {
    let weatherHistory = JSON.parse(localStorage.getItem('cities')) || [];

    weatherHistory.push(cities);

    localStorage.setItem('pastCities', JSON.stringify(weatherHistory));

}




//function to call api and retrieve weather data
const weatherSearch = function (city) {
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(queryURL)
        .then(function (response) {
            if (response.ok) {
                clearDiv();
                //clearDivsubtitleDisplay();
                pastCitiesArrayHandler(city);
                localStorage.setItem('cities', JSON.stringify(pastCities))
                //  cityHistory()
                //parse data
                response.json()
                    .then(function (data) {
                        console.log(data);
                        displayWeather(data);
                        forecastSearch(city);
                    })
            } else {
                alert(`Error: ${response.statusText}`);
            }
        })
};


//function to call api and retrieve forecast
const forecastSearch = function (city) {
    const queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(queryURL)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error('Network response was not ok.');
            }
            })
        .then(function (data) {
            displayForecast(data);
            localStorage.setItem('forecast', (JSON.stringify(data)));
        })
        .catch(function (error) {
            console.error('There was a problem witht the fetch operation:', error);
        });   
    
    };

        

//displays weather search data
const displayWeather = function (data) {
    const cityNameEl = document.createElement('h2');
    const cityTempEl = document.createElement('h3');
    const cityWindEl = document.createElement('h3');
    const cityHumidityEl = document.createElement('h3');
    //todays date
    const date = dayjs().format('MM/DD/YYYY');
    //retrieve weather icon
    const icon = weatherIcon(data);
    //give text to elements
    cityNameEl.textContent = `${data.name} ${date} ${icon}`;
    //convert temp from kelvin to fahrenheit
    const cityTemp = (data.main.temp - 273.15) * (9 / 5) + 32;
    cityTempEl.textContent = `Temp: ${cityTemp.toFixed(2)} °F`;
    cityWindEl.textContent = `Wind: ${data.wind.speed} MPH`;
    cityHumidityEl.textContent = `Humidity: ${data.main.humidity} %`

    //append to html
    weatherElement.appendChild(cityNameEl);
    weatherElement.appendChild(cityTempEl);
    weatherElement.appendChild(cityWindEl);
    weatherElement.appendChild(cityHumidityEl);
}
const displayForecast = function (data) {
    for (let i = 0; i <= 4; i++) {
        //create div
        const weatherForecast = document.createElement('div')
        //add attributes
        weatherForecast.setAttribute('id', 'card')

        //create elements
        const cityDateEl = document.createElement('h4')
        const iconEl = document.createElement('h5')
        const cityTempEl = document.createElement('h5')
        const cityHumidityEl = document.createElement('h5')

        //get date
        const date = forecastDate(i)

        //add text to each element
        cityDateEl.textContent = `${date}`
        iconEl.textContent = icon;
        //conver tempt from kelvin to fahrenheit
        const cityTemp = (data.list[i].main.temp - 273.15) * (9 / 5) + 32;
        cityTempEl.textContent = `Temp: ${cityTemp.toFixed(2)} °F`;
        cityWindEl.textContent = `Wind: ${data.list[i].wind.speed} MPH`;
        cityHumidityEl.textContent = `Humidity: ${data.list[i].main.humidity} %`;

        //append all elements to card
        forecastCard.appendChild(cityDateEl);
        forecastCard.appendChild(iconEl);
        forecastCard.appendChild(cityTempEl);
        forecastCard.appendChild(cityWindEl);
        forecastCard.appendChild(cityHumidityEl);
        //append the card to html
        forecastElement.appendChild(weatherForecast);
    }
}
//day JS function for future dates
const forecastDate = function (i) {
    let today = dayjs();

    let forecastDay = today.add(i + 0, 'day').format('MM/DD/YYY');
    return forecastDay;
}

//capitalize first letter of city
function capitalizeFirstLetter(city) {
    return city.charAt(0).toUpperCase() + city.slice(1);
}


//function to get input from event listener on button and display weather data
searchBtn.addEventListener('click', formSubmitHandler);
//function to clear div/
const clearDiv = function () {
    weatherElement.innerHTML = ''
    forecastElement.innerHTML = ''
}