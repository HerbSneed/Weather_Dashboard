var citySearchInput = document.getElementById('citySearchJS')
var searchContainer = document.getElementById('searchContainerJS');
var citySearchBtn = document.getElementById('searchSubbtnJS');
var featureCity = document.getElementById('city');
var forecastVis = document.getElementById('forecastDiv');
var today = dayjs().format('MM/DD/YYYY');


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
  } else {
  featureCity.innerHTML = searchTerm + " - ";
  var currentDay = document.getElementById('currentDate');
  currentDay.innerHTML = today.toString();
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
} 

var getCityForcast = function(cityN) {
  var apiUrlF = 'https://api.openweathermap.org/data/2.5/forecast?q='+cityN+'&appid=c82d8df7a3206dc1d57ce04e07f52165&units=imperial';
  fetch(apiUrlF) 
    .then(function (response) {
      if(response.ok) {
        response.json()
          .then(function(data) {
            displayForcast(data, cityN);
            console.log(data)
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
    // Day 1 Forcast
    var day1Date = document.getElementById('date1');
    day1Date.innerHTML = dayjs().add(1, 'day').format('MM/DD/YYYY').toString();
    var day1Icon = forecast.list[6].weather[0].icon;
    var day1IconUrl = "https://openweathermap.org/img/w/" + day1Icon + ".png";
    var day1IconDisplay = document.getElementById('icon1');
    day1IconDisplay.innerHTML = `<img src="${day1IconUrl}">`;
    console.log(day1IconDisplay)

    var day1Temp = forecast.list[6].main.temp;
    var day1TempDisplay = document.getElementById('temp1');
    day1TempDisplay.innerHTML = day1Temp;
  
    var day1Wind = forecast.list[6].wind.speed;
    var day1WindDisplay = document.getElementById('wind1');
    day1WindDisplay.innerHTML = day1Wind;
  
    var day1Humidity = forecast.list[6].main.humidity;
    var day1HumidityDisplay = document.getElementById('humidity1');
    day1HumidityDisplay.innerHTML = day1Humidity + '%';

    // Day 2 Forcast
    var day2Date = document.getElementById('date2');
    day2Date.innerHTML = dayjs().add(2, 'day').format('MM/DD/YYYY').toString();
    var day2Icon = forecast.list[14].weather[0].icon;
    var day2IconUrl = "https://openweathermap.org/img/w/" + day2Icon + ".png";
    var day2IconDisplay = document.getElementById('icon2');
    day2IconDisplay.innerHTML = `<img src="${day2IconUrl}">`;

    var day2Temp = forecast.list[14].main.temp;
    var day2TempDisplay = document.getElementById('temp2');
    day2TempDisplay.innerHTML = day2Temp;
  
    var day2Wind = forecast.list[14].wind.speed;
    var day2WindDisplay = document.getElementById('wind2');
    day2WindDisplay.innerHTML = day2Wind;
  
    var day2Humidity = forecast.list[14].main.humidity;
    var day2HumidityDisplay = document.getElementById('humidity2');
    day2HumidityDisplay.innerHTML = day2Humidity + '%';

    // Day 3 Forcast
    var day3Date = document.getElementById('date3');
    day3Date.innerHTML = dayjs().add(3, 'day').format('MM/DD/YYYY').toString();
    var day3Icon = forecast.list[22].weather[0].icon;
    var day3IconUrl = "https://openweathermap.org/img/w/" + day3Icon + ".png";
    var day3IconDisplay = document.getElementById('icon3');
    day3IconDisplay.innerHTML = `<img src="${day3IconUrl}">`;

    var day3Temp = forecast.list[22].main.temp;
    var day1TempDisplay = document.getElementById('temp3');
    day1TempDisplay.innerHTML = day1Temp;
  
    var day3Wind = forecast.list[22].wind.speed;
    var day3WindDisplay = document.getElementById('wind3');
    day3WindDisplay.innerHTML = day3Wind;
  
    var day3Humidity = forecast.list[22].main.humidity;
    var day3HumidityDisplay = document.getElementById('humidity3');
    day3HumidityDisplay.innerHTML = day3Humidity + '%';

    // Day 4 Forcast
    var day4Date = document.getElementById('date4');
    day4Date.innerHTML = dayjs().add(4, 'day').format('MM/DD/YYYY').toString();
    var day4Icon = forecast.list[30].weather[0].icon;
    var day4IconUrl = "https://openweathermap.org/img/w/" + day4Icon + ".png";
    var day4IconDisplay = document.getElementById('icon4');
    day4IconDisplay.innerHTML = `<img src="${day4IconUrl}">`;

    var day4Temp = forecast.list[30].main.temp;
    var day1TempDisplay = document.getElementById('temp4');
    day1TempDisplay.innerHTML = day4Temp;
  
    var day4Wind = forecast.list[30].wind.speed;
    var day4WindDisplay = document.getElementById('wind4');
    day4WindDisplay.innerHTML = day4Wind;
  
    var day4Humidity = forecast.list[30].main.humidity;
    var day4HumidityDisplay = document.getElementById('humidity4');
    day4HumidityDisplay.innerHTML = day4Humidity + '%';

    // Day 5 Forcast
    var day5Date = document.getElementById('date5');
    day5Date.innerHTML = dayjs().add(5, 'day').format('MM/DD/YYYY').toString();
    var day5Icon = forecast.list[38].weather[0].icon;
    var day5IconUrl = "https://openweathermap.org/img/w/" + day5Icon + ".png";
    var day5IconDisplay = document.getElementById('icon5');
    day5IconDisplay.innerHTML = `<img src="${day5IconUrl}">`;

    var day5Temp = forecast.list[38].main.temp;
    var day1TempDisplay = document.getElementById('temp5');
    day1TempDisplay.innerHTML = day5Temp;
  
    var day5Wind = forecast.list[38].wind.speed;
    var day5WindDisplay = document.getElementById('wind5');
    day5WindDisplay.innerHTML = day5Wind;
  
    var day5Humidity = forecast.list[38].main.humidity;
    var day5HumidityDisplay = document.getElementById('humidity5');
    day5HumidityDisplay.innerHTML = day5Humidity + '%';
    
  }

citySearchBtn.addEventListener('click', search);
