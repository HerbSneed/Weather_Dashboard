var citySearchInput = document.getElementById("citySearchJS");
var searchContainer = document.getElementById("searchContainerJS");
var citySearchBtn = document.getElementById("searchSubbtnJS");
var featureCity = document.getElementById("city");
var forecastVis = document.getElementById("forecastDiv");
var today = dayjs().format("MM/DD/YYYY");
var userCities = [];
var cityN;
var stateC;

// Retrieves data from local storage and creates buttons of user search history this function is called in the HTML
const citiesSearched = () => {
  var cityLs = JSON.parse(localStorage.getItem("Cities"));

  if (cityLs && cityLs.length > 0) {
    let cityName = cityLs[cityLs.length - 1];
    let cityN, stateC;

    if (cityName.includes(',')) {
      // If input contains a comma, split into city and state
      var parts = cityName.split(',');
      cityN = parts[0].trim();
      stateC = parts[1].trim().toUpperCase();
    } else {
      // If no comma, assume only city is entered
      cityN = input;
      stateC = "";
    }

    forecastVis.setAttribute("style", "display: block");
    userCities = cityLs;

    for (var i = 0; i < cityLs.length; i++) {
      var oldCities = document.createElement("button");
      oldCities.innerHTML = cityLs[i];
      let currentCity = cityLs[i]; // Use a different variable here
      searchContainer.appendChild(oldCities);

      oldCities.addEventListener("click", function () {
        var parts = currentCity.split(','); // Use the variable here
        cityN = parts[0].trim();
        stateC = parts[1].trim();
        getCityWeather(cityN, stateC);
        getCityForcast(cityN, stateC);
        forecastVis.setAttribute("style", "display: block");
      });
    }

    var clearButton = document.createElement("button");
    clearButton.innerHTML = "Clear History";
    clearButton.className = "clearButton";  // Set the class for styling
    searchContainer.appendChild(clearButton);

    clearButton.addEventListener("click", function () {
      localStorage.removeItem("Cities");
      searchContainer.innerHTML = "";
      featureCity.innerHTML = "";
      forecastVis.setAttribute("style", "display: none");
      userCities = [];
    });
  }
}


// Retrieves input from user, adds it to local storage and creates buttons of user search history
var search = function (event) {
  event.preventDefault();

  var input = citySearchInput.value.trim();


  if (input.includes(',')) {
    // If input contains a comma, split into city and state
    var parts = input.split(',');
    cityN = parts[0].trim();
    stateC = parts[1].trim().toUpperCase();
  } else {
    // If no comma, assume only city is entered
    cityN = input;
    stateC = "";
  }


  if (cityN ) {
    var newCityName = citySearchInput.value.trim(); // Use a different variable for the loop
    if (userCities.includes(newCityName)) {
      alert(newCityName + " is already in your search history. Enter a new city.");
      return;
    }
    userCities.push(newCityName);
    var empty = userCities.indexOf("");
    if (empty !== -1) {
      userCities.splice(empty, 1);
    }
    localStorage.setItem("Cities", JSON.stringify(userCities));

    // Create a button for new city
    var cities = document.createElement("button");
    cities.innerHTML = newCityName; // Use the newCityName variable here
    searchContainer.appendChild(cities);

    // Add an event listener to the new button
    cities.addEventListener("click", function () {
      // Set the cityName variable to the text content of the button
      newCityName = this.textContent;

      // Show the forecast container
      forecastVis.setAttribute("style", "display: block");
    });

    // Call functions to get weather and forecast for the new city
    getCityWeather(cityN, stateC);
    getCityForcast(cityN, stateC);

    // Show the forecast container
    forecastVis.setAttribute("style", "display: block");

    // Clear the input field
    citySearchInput.value = "";
    
  } else {
    alert("Please enter a city");
  }
};


// Fetches current weather from Open Weather Api
var getCityWeather = function (cityN, stateC) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityN + "," + stateC + "," +
    "US&appid=c82d8df7a3206dc1d57ce04e07f52165&units=imperial";

    console.log(apiUrl);

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error: " + response.statusText);
      }
    })
    .then(function (data) {
      displayCurrentWeather(data, cityN, stateC);
    })
    .catch(function (error) {
      console.error("Unable to connect to Open Weather API:", error);
      alert("Unable to connect to Open Weather API. Check the console for details.");
    });
};

// Fetches forecast from Open Weather Api
var getCityForcast = function (cityN, stateC) {
  var apiUrlF =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    cityN + "," + stateC + "," +
    "US&appid=c82d8df7a3206dc1d57ce04e07f52165&units=imperial";

  console.log(apiUrlF);

  fetch(apiUrlF)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayForcast(data, cityN, stateC);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      console.error("Unable to connect to Open Weather API:", error);
      alert("Unable to connect to Open Weather API. Check the console for details.");
    });
};

// Displays current weather data from Open Weather Api
var displayCurrentWeather = function (weather, cityN, stateC) {
  if (weather === 0) {
    featureCity.innerHTML = "City is Unknown";
    return;
  } else {
    featureCity.innerHTML = cityN;

    if (stateC) {
      featureCity.innerHTML += ", " + stateC;
    }

    featureCity.innerHTML += " - ";

    var currentDayIcon = weather.weather[0].icon;
    var currentDayIconUrl = "https://openweathermap.org/img/w/" + currentDayIcon + ".png";
    var currentDayIconDisplay = document.getElementById("iconCurrent");
    currentDayIconDisplay.innerHTML = `<img src="${currentDayIconUrl}">`;
    currentDayIconDisplay.setAttribute('style', 'position: absolute')

    var currentDay = document.getElementById("currentDate");
    currentDay.innerHTML = today.toString();
    var currentTemp = weather.main.temp;
    var currentTempDisplay = document.getElementById("currentTempJS");
    currentTempDisplay.innerHTML = Math.ceil(currentTemp) + "°F";

    var currentWind = weather.wind.speed;
    var currentWindDisplay = document.getElementById("currentWindJS");
    currentWindDisplay.innerHTML = Math.ceil(currentWind) + "mph";

    var currentHumidity = weather.main.humidity;
    var currentHumidityDisplay = document.getElementById("currentHumidiyJS");
    currentHumidityDisplay.innerHTML = currentHumidity + "%";
  }
};