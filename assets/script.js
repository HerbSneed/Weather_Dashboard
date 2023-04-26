var citySearchInput = document.getElementById('citySearchJS')
var searchContainer = document.getElementById('searchContainerJS');
var citySearchBtn = document.getElementById('searchSubbtnJS');
var cityBtn = document.createElement('div');


var search = function(event) {
  event.preventDefault();

  var city = citySearchInput.value.trim();

  var getcity = function(city) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+ city +'&appid=c82d8df7a3206dc1d57ce04e07f52165';
    fetch(apiUrl)
      .then(function (response) {
        if(response.ok) {
        response.json()
          .then(function(data) {
           console.log(data, city);
          });
        }else{
          alert("Error: " + response.statusText);
        };
      })
      .catch(function(error) {
        alert('Unable to connect ot api');
      })
  };
  var cityArray = [];

if (city) {
  cityArray.push(searchContainer.appendChild(cityBtn));
  cityBtn.innerHTML = city;
  cityBtn.setAttribute('class', 'city')
  searchContainer.appendChild(cityBtn);
  getcity(city);
} else {
  alert("please enter city");
}



};

citySearchBtn.addEventListener('click', search);


