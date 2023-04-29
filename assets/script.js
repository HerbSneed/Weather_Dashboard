var citySearchInput = document.getElementById('citySearchJS')
var searchContainer = document.getElementById('searchContainerJS');
var citySearchBtn = document.getElementById('searchSubbtnJS');
var featureCity = document.getElementById('city');
var forecastVis = document.getElementById('forecastDiv');

var search = function(event) {
  event.preventDefault()
  var cityName = citySearchInput.value.trim();
  forecastVis.setAttribute("style", "display: block");
  // console.log(cityName);
  if (cityName) {
    getCityWeather(cityName);
    getCityForcast(cityName);
    citySearchInput.value = '';
  }else{
    alert('Please enter a city');
  }
}

var getCityWeather = function(cityN) {
  var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+cityN+'&appid=c82d8df7a3206dc1d57ce04e07f52165&units=imperial';
  fetch(apiUrl) 
    .then(function (response) {
      if(response.ok) {
        response.json()
          .then(function(data) {
            displayCurrentWeather(data, cityN);
          })
      } else{
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function(error) {
      alert('Unable to connect to Open Weather API');
    })
  }

var displayCurrentWeather = function(weather, searchTerm) {
  if (weather === 0) {
    featureCity.innerHTML = 'City is Unknown';
    return;
  }
  featureCity.innerHTML = searchTerm;
  console.log(weather)

  var currentTemp = weather.main.temp;
  var currentTempDisplay = document.getElementById('currentTempJS');
  currentTempDisplay.innerHTML = currentTemp;

  var currentWind = weather.wind.speed;
  var currentWindDisplay = document.getElementById('currentWindJS');
  currentWindDisplay.innerHTML = currentWind;

  var currentHumidiy = weather.main.humidity;
  var currentHumidityDisplay = document.getElementById('currentHumidiyJS');
  currentHumidityDisplay.innerHTML = currentHumidiy + '%';
}

var getCityForcast = function(cityN) {
  var apiUrlF = 'https://api.openweathermap.org/data/2.5/forecast?q='+cityN+'&appid=c82d8df7a3206dc1d57ce04e07f52165&units=imperial';
  fetch(apiUrlF) 
    .then(function (response) {
      if(response.ok) {
        response.json()
          .then(function(data) {
            displayForcast(data, cityN);
          })
      } else{
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function(error) {
      alert('Unable to connect to Open Weather API');
    })
  }

  var displayForcast = function(forecast) {
    var day1Icon = forecast.list[3].weather[0].icon;
    var day1IconUrl = "https://openweathermap.org/img/w/" + day1Icon + ".png";
    var day1IconDisplay = document.getElementById('icon1');
    day1IconDisplay.innerHTML = `<img src="${day1IconUrl}">`;
    console.log(day1IconDisplay)

    var day1Temp = forecast.list[3].main.temp;
    var day1TempDisplay = document.getElementById('temp1');
    day1TempDisplay.innerHTML = day1Temp;
  
    var day1Wind = forecast.list[3].wind.speed;
    var day1WindDisplay = document.getElementById('wind1');
    day1WindDisplay.innerHTML = day1Wind;
  
    var day1Humidity = forecast.list[3].main.humidity;
    var day1HumidityDisplay = document.getElementById('humidity1');
    day1HumidityDisplay.innerHTML = day1Humidity + '%';




























    
  }


citySearchBtn.addEventListener('click', search);
