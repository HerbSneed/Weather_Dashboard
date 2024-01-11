var citySearchInput = document.getElementById("citySearchJS");
var searchContainer = document.getElementById("searchContainerJS");
var citySearchBtn = document.getElementById("searchSubbtnJS");
var featureCity = document.getElementById("city");
var forecastVis = document.getElementById("forecastDiv");
var today = dayjs().format("MM/DD/YYYY");
var userCities = [];
var cityN;
var stateC;
var countryC = "US";
var apiId = "c82d8df7a3206dc1d57ce04e07f52165"

// Retrieves data from local storage and creates buttons of user search history this function is called in the HTML
const citiesSearched = () => {
  var cityLs = JSON.parse(localStorage.getItem("Cities"));

  searchContainer.innerHTML = "";

  if (cityLs && cityLs.length > 0) {
    forecastVis.setAttribute("style", "display: block");
    userCities = cityLs;

    for (var i = 0; i < cityLs.length; i++) {
      var oldCities = document.createElement("button");
      oldCities.innerHTML = cityLs[i];
      oldCities.setAttribute("data-city", cityLs[i]); // Set custom attribute

      searchContainer.appendChild(oldCities);

      oldCities.addEventListener("click", function () {
        // Retrieve the city name from the custom attribute
        var cityName = this.getAttribute("data-city");
        var parts = cityName.split(',');

        cityN = parts[0].trim();
        stateC = parts[1] ? parts[1].trim() : "";
        countryC = parts[2] ? parts[2].trim() : "US";
        getCityWeather(cityN, stateC, countryC);
        getCityForcast(cityN, stateC, countryC);
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
      var currentDayIconDisplay = document.getElementById("iconCurrent");
      currentDayIconDisplay.innerHTML = "";
      forecastVis.setAttribute("style", "display: none");
      userCities = [];
      location.reload();
    });
    cleanAndStoreCities();
  }
}

// Retrieves input from user, adds it to local storage and creates buttons of user search history
var search = function () {

  var input = citySearchInput.value.trim();

  if (input.includes(',')) {
    var parts = input.split(',');
    cityN = parts[0].trim();
    stateC = parts[1].trim().toUpperCase();

  } else {
    cityN = input;
    stateC = "";
  }

  if (cityN && stateC) {
    // If both city and state are provided
    countryC = "US"; // Set the country code if state is provided
  } else {
    // If no state is provided, consider it an invalid city
    alert("Please enter a city with a state.");
    citySearchInput.value = "";
    return;
  }

  if (cityN  && stateC) {
    var newCityName = citySearchInput.value.trim();
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
    cities.innerHTML = newCityName;
    
    // Add an event listener to the new button
    cities.addEventListener("click", function () {
      // Update cityN and stateC based on the clicked button
      var parts = this.textContent.split(',');
      cityN = parts[0].trim();
      stateC = parts[1] ? parts[1].trim() : "";
      countryC = parts[2] ? parts[2].trim() : "US";

      // Call functions to get weather and forecast for the selected city
      getCityWeather(cityN, stateC, countryC);
      getCityForcast(cityN, stateC, countryC);

      // Show the forecast container
      forecastVis.setAttribute("style", "display: block");
    });

    // Append the new city button before the clear button
    searchContainer.insertBefore(cities, searchContainer.lastChild);

    // Call functions to get weather and forecast for the new city
    getCityWeather(cityN, stateC, countryC);
    getCityForcast(cityN, stateC, countryC);

    // Show the forecast container
    forecastVis.setAttribute("style", "display: block");

    // Clear the input field
    citySearchInput.value = "";

  } else {
    alert("Please enter a city");
    citySearchInput.value = "";
  }
  citiesSearched();
};

// Removes invalid cities from userCities and stores the updated list in local storage
const cleanAndStoreCities = () => {
  userCities = userCities.filter(city => {
    const [cityName, state, country] = city.split(',').map(part => part.trim());
    const isValidCity = (cityName || (cityName.includes(' ') && state));

    if (!isValidCity) {
      console.log(`Invalid city: ${city}`);
    }

    return isValidCity;
  });

  localStorage.setItem("Cities", JSON.stringify(userCities));
};

// Fetches current weather from Open Weather Api
// Fetches current weather from Open Weather Api
const getCityWeather = async (cityN, stateC, countryC) => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityN},${stateC},${countryC}&appid=${apiId}&units=imperial`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      if (response.status === 404) {
        alert('City not found. Please enter a valid city.');
        // Don't proceed further if city is not found
        return;
      }
      throw new Error("Error: " + response.statusText);
    }

    const data = await response.json();
    displayCurrentWeather(data, cityN, stateC);

    // Create a button for new city only if it's valid
    var newCityName = `${cityN}${stateC ? ', ' + stateC : ''}`;

    if (!userCities.includes(newCityName)) {
      userCities.push(newCityName);

      var cities = document.createElement("button");
      cities.innerHTML = newCityName;
      cities.addEventListener("click", function () {
        var parts = this.textContent.split(',');
        cityN = parts[0].trim();
        stateC = parts[1] ? parts[1].trim() : "";
        countryC = parts[2] ? parts[2].trim() : "US";

        getCityWeather(cityN, stateC);
        getCityForcast(cityN, stateC);
        forecastVis.setAttribute("style", "display: block");
      });

      searchContainer.insertBefore(cities, searchContainer.lastChild);
      citiesSearched();
    }
  } catch (error) {
    console.error("Unable to connect to Open Weather API:", error);
    citySearchInput.value = "";
    alert("Unable to connect to Open Weather API. Check the console for details.");
    
  }
};



// Fetches forecast from Open Weather Api
const getCityForcast = async (cityN, stateC, countryC) => {
  const apiUrlF = `https://api.openweathermap.org/data/2.5/forecast?q=${cityN},${stateC},${countryC}&appid=${apiId}&units=imperial`;

  try {
    const response = await fetch(apiUrlF);

    if (!response.ok) {
      if (response.status === 404) {
        alert('City not found. Please enter a valid city.')
      }
      throw new Error("Error: " + response.statusText);
    }
    const data = await response.json();
    displayForcast(data);
  } catch (error) {
    console.error("Unable to connect to Open Weather API:", error);
    alert("Unable to connect to Open Weather API. Check the console for details.");
  }
}

// Displays current weather data from Open Weather Api
var displayCurrentWeather = function (weather, input) {
  if (weather === 0) {
    featureCity.innerHTML = "City is Unknown";
    return;
  } else {
    var cityAndState = input;
    if (stateC) {
      cityAndState += ", " + stateC;
    }

    console.log(cityAndState);

    featureCity.innerHTML = cityAndState + " - ";

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

// Displays weather forecast from Open Weather Api
var displayForcast = function (forecast) {
  // Day 1 Forcast
  var day1Date = document.getElementById("date1");
  day1Date.innerHTML = dayjs().add(1, "day").format("MM/DD/YYYY").toString();
  var day1Icon = forecast.list[6].weather[0].icon;
  var day1IconUrl = "https://openweathermap.org/img/w/" + day1Icon + ".png";
  var day1IconDisplay = document.getElementById("icon1");
  day1IconDisplay.innerHTML = `<img src="${day1IconUrl}">`;

  var day1Temp = forecast.list[6].main.temp;
  var day1TempDisplay = document.getElementById("temp1");
  day1TempDisplay.innerHTML = Math.ceil(day1Temp) + "°F";

  var day1Wind = forecast.list[6].wind.speed;
  var day1WindDisplay = document.getElementById("wind1");
  day1WindDisplay.innerHTML = Math.ceil(day1Wind) + "mph";

  var day1Humidity = forecast.list[6].main.humidity;
  var day1HumidityDisplay = document.getElementById("humidity1");
  day1HumidityDisplay.innerHTML = Math.ceil(day1Humidity) + "%";

  // Day 2 Forcast
  var day2Date = document.getElementById("date2");
  day2Date.innerHTML = dayjs().add(2, "day").format("MM/DD/YYYY").toString();
  var day2Icon = forecast.list[14].weather[0].icon;
  var day2IconUrl = "https://openweathermap.org/img/w/" + day2Icon + ".png";
  var day2IconDisplay = document.getElementById("icon2");
  day2IconDisplay.innerHTML = `<img src="${day2IconUrl}">`;

  var day2Temp = forecast.list[14].main.temp;
  var day2TempDisplay = document.getElementById("temp2");
  day2TempDisplay.innerHTML = Math.ceil(day2Temp) + "°F";

  var day2Wind = forecast.list[14].wind.speed;
  var day2WindDisplay = document.getElementById("wind2");
  day2WindDisplay.innerHTML = Math.ceil(day2Wind) + "mph";

  var day2Humidity = forecast.list[14].main.humidity;
  var day2HumidityDisplay = document.getElementById("humidity2");
  day2HumidityDisplay.innerHTML = day2Humidity + "%";

  // Day 3 Forcast
  var day3Date = document.getElementById("date3");
  day3Date.innerHTML = dayjs().add(3, "day").format("MM/DD/YYYY").toString();
  var day3Icon = forecast.list[22].weather[0].icon;
  var day3IconUrl = "https://openweathermap.org/img/w/" + day3Icon + ".png";
  var day3IconDisplay = document.getElementById("icon3");
  day3IconDisplay.innerHTML = `<img src="${day3IconUrl}">`;

  var day3Temp = forecast.list[22].main.temp;
  var day3TempDisplay = document.getElementById("temp3");
  day3TempDisplay.innerHTML = Math.ceil(day3Temp) + "°F";

  var day3Wind = forecast.list[22].wind.speed;
  var day3WindDisplay = document.getElementById("wind3");
  day3WindDisplay.innerHTML = Math.ceil(day3Wind) + "mph";

  var day3Humidity = forecast.list[22].main.humidity;
  var day3HumidityDisplay = document.getElementById("humidity3");
  day3HumidityDisplay.innerHTML = day3Humidity + "%";

  // Day 4 Forcast
  var day4Date = document.getElementById("date4");
  day4Date.innerHTML = dayjs().add(4, "day").format("MM/DD/YYYY").toString();
  var day4Icon = forecast.list[30].weather[0].icon;
  var day4IconUrl = "https://openweathermap.org/img/w/" + day4Icon + ".png";
  var day4IconDisplay = document.getElementById("icon4");
  day4IconDisplay.innerHTML = `<img src="${day4IconUrl}">`;

  var day4Temp = forecast.list[30].main.temp;
  var day4TempDisplay = document.getElementById("temp4");
  day4TempDisplay.innerHTML = Math.ceil(day4Temp) + "°F";

  var day4Wind = forecast.list[30].wind.speed;
  var day4WindDisplay = document.getElementById("wind4");
  day4WindDisplay.innerHTML = Math.ceil(day4Wind) + "mph";

  var day4Humidity = forecast.list[30].main.humidity;
  var day4HumidityDisplay = document.getElementById("humidity4");
  day4HumidityDisplay.innerHTML = day4Humidity + "%";

  // Day 5 Forcast
  var day5Date = document.getElementById("date5");
  day5Date.innerHTML = dayjs().add(5, "day").format("MM/DD/YYYY").toString();
  var day5Icon = forecast.list[38].weather[0].icon;
  var day5IconUrl = "https://openweathermap.org/img/w/" + day5Icon + ".png";
  var day5IconDisplay = document.getElementById("icon5");
  day5IconDisplay.innerHTML = `<img src="${day5IconUrl}">`;

  var day5Temp = forecast.list[38].main.temp;
  var day5TempDisplay = document.getElementById("temp5");
  day5TempDisplay.innerHTML = Math.ceil(day5Temp) + "°F";

  var day5Wind = forecast.list[38].wind.speed;
  var day5WindDisplay = document.getElementById("wind5");
  day5WindDisplay.innerHTML = Math.ceil(day5Wind) + "mph";

  var day5Humidity = forecast.list[38].main.humidity;
  var day5HumidityDisplay = document.getElementById("humidity5");
  day5HumidityDisplay.innerHTML = day5Humidity + "%";
};

// Event Listener for search button
citySearchBtn.addEventListener("click", function (event) {
  event.preventDefault();
  search();
  cleanAndStoreCities();
  citiesSearched();
});


// Initial display of searched citie
