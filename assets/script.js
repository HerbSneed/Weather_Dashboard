var citySearchInput = document.getElementById('citySearchJS')
var searchContainer = document.getElementById('searchContainerJS');
var citySearchBtn = document.getElementById('searchSubbtnJS');
var featureCity = document.getElementById('city');


var cityName = [];

function renderedCities() {
var savedCities = JSON.parse(localStorage.getItem('CityName'));
  if(savedCities !== null) {
    for (var i = 0; i < savedCities.length; i++) {
      var savedCityBtn = document.createElement('div');
      savedCityBtn.innerHTML = savedCities[i];
      savedCityBtn.setAttribute('class', 'city');
      searchContainer.appendChild(savedCityBtn);
    }
  }
}
window.onload = renderedCities();

var search = function(event) {
  event.preventDefault();

  var getcity = function(city) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+ city +'&appid=c82d8df7a3206dc1d57ce04e07f52165&units=imperial';

    fetch(apiUrl)
      .then(function (response) {
        if(response.ok) {
        response.json()
          .then(function(data) {
          });
        }else{
          alert("Error: " + response.statusText);
        };
      })
      .catch(function(error) {
        alert('Unable to connect to api');
      });

  };

 var get5Day = function(fiveDay) {
  var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q='+ city +'&appid=c82d8df7a3206dc1d57ce04e07f52165&units=imperial';

  fetch(apiUrl).then(function(response) {
    if (response.ok) {
      response.json()
      .then(function (data) {
        console.log(data);
      })
    }else{
      alert("Unable to connect to api")
    }
  })
 }
 get5Day();

  if (city !== null) {
    var city = citySearchInput.value.trim();
    var cityBtn = document.createElement('div');
    cityName.push(city);
    cityBtn.innerHTML = city;
    featureCity.innerHTML = city;

    cityBtn.setAttribute('class', 'city')
    searchContainer.appendChild(cityBtn);
    localStorage.setItem('CityName', JSON.stringify(cityName));

    getcity(city);

  } else {
    alert("please enter city");
  }
};

citySearchBtn.addEventListener('click', search);

