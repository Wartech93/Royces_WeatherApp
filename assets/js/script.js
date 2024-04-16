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
        weatherSearch(city);
        savedCities();

        cityInput.value = '';
    } else {
        alert('Please enter city.');
    }

}




// past cities array handler 
const pastCitiesArrayHandler = function (city) {
    let weatherHistory = JSON.parse(localStorage.getItem('cities')) || [];

    weatherHistory.push(city);

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
                //cityHistory()
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
            console.error('There was a problem with the fetch operation:', error);
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
        const forecastCard = document.createElement('div');
        forecastCard.setAttribute('class', 'forecast-card d-flex flex-column m-1');

        //create elements
        const cityDateEl = document.createElement('h4');
        const iconEl = document.createElement('h5');
        const cityTempEl = document.createElement('h5');
        const cityHumidityEl = document.createElement('h5');
        const cityWindEl = document.createElement('h5');

        //get date
        const date = forecastDate(i);

        //add text to each element
        cityDateEl.textContent = `${date}`;
        iconEl.textContent = weatherIcon(data.list[i]); // Pass data for each day to weatherIcon
        const cityTemp = (data.list[i].main.temp - 273.15) * (9 / 5) + 32;
        cityTempEl.textContent = `Temp: ${cityTemp.toFixed(2)} °F` + ` `;
        cityWindEl.textContent = `Wind: ${data.list[i].wind.speed} MPH` + ` `;
        cityHumidityEl.textContent = `Humidity: ${data.list[i].main.humidity} %`;

        //append all elements to card
        forecastCard.appendChild(cityDateEl);
        forecastCard.appendChild(iconEl);
        forecastCard.appendChild(cityTempEl);
        forecastCard.appendChild(cityWindEl);
        forecastCard.appendChild(cityHumidityEl);
        
        
        //append the card to html
        forecastElement.appendChild(forecastCard);
    }
};
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
//weather icons
const weatherIcon = function (data) {
    if (data.weather && data.weather.length > 0) {
        const iconCode = data.weather[0].icon;

        switch (iconCode) {
            case '01d':
                return '☀️'; // clear sky day
            case '01n':
                return '🌙'; // clear sky night
            case '02d':
                return '🌤️'; // few clouds day
            case '02n':
                return '🌥️'; // few clouds night
            case '03d':
            case '03n':
                return '🌥️'; // scattered clouds
            case '04d':
            case '04n':
                return '☁️'; // broken clouds
            case '09d':
            case '09n':
                return '🌧️'; // shower rain
            case '10d':
                return '🌦️'; // rain day
            case '10n':
                return '🌧️'; // rain night
            case '11d':
            case '11n':
                return '⛈️'; // thunderstorm
            case '13d':
            case '13n':
                return '❄️'; // snow
            case '50d':
            case '50n':
                return '🌫️'; // mist
            default:
                return '❓'; // default icon for unknown conditions
        }
    } else {
        return '❓'; // default icon if weather data is not available
    }
};
//function to get input from event listener on button and display weather data
searchBtn.addEventListener('click', formSubmitHandler);
//function to clear div/

//display search history
const savedCities = function () {
    let historyInput = cityInput.value;
    let cityHistory = JSON.parse(localStorage.getItem("cityHistory")) || [];
    cityHistory.push(historyInput);
    localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
    displayPastCities(cityHistory);
    console.log(cityHistory);
}

const displayPastCities = function (cityHistory) {
    const historyContainer = document.querySelector("#city-history");
    historyContainer.innerHTML = ""; // Clear previous content

    cityHistory.forEach(city => {
        const historyButton = document.createElement("button");
        historyButton.textContent = city;
        historyButton.setAttribute('class', 'btn btn-info d-flex text-center flex-column my-1');
        historyButton.classList.add("past"); // Use classList.add instead of += for adding classes
        historyContainer.appendChild(historyButton);

        historyButton.addEventListener("click", (event) => {
            event.preventDefault();
            let pastCity = historyButton.textContent;
            weatherSearch(pastCity);
            clearDiv();
        });
    });
};
const clearDiv = function () {
    weatherElement.innerHTML = ''
    forecastElement.innerHTML = ''
}