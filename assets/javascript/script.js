//API key.
var APIKey = "ee7c3298c2fab93deaad71567a82a537";

// URL for openweather API
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=";

// create a array to store city search
var cityList = JSON.parse(localStorage.getItem("cities")) || [];

// make sure page is loaded before operate functions
$(document).ready(function () {
  var city = cityList[cityList.length - 1];
  forecastWeather(city);
  citySearch(city);
});

// Create functions

function citySearch(city) {

  // clear out previous city data

  $(".city").empty();
  $(".temp").empty();
  $(".humidity").empty();
  $(".wind").empty();
  $(".uvIndex").empty();
  $("#uv").empty();

  var cityURL = queryURL + city + "&appid=" + APIKey;
  console.log(cityURL);

  // use ajax to get information from selected city
  $.ajax({
    url: cityURL,
    method: "GET",
  }).then(function (response) {
    // Display current weather condition in selected city

    //  City Date and weather icon
    $(".city").append(response.name + " (" + moment().format("l") + ")");

    var iconUrl =
      "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
    console.log(iconUrl);
    var iconImg = $("<img>");
    iconImg.attr("src", iconUrl);
    iconImg.attr("width", "50px");
    iconImg.attr("height", "50px");

    $(".city").append(iconImg);

    // Temperature
    var Kelvin = response.main.temp;
    var Fahrenheit = (Kelvin - 273.15) * 1.8 + 32;
    $(".temp").text("Temperature: " + Fahrenheit.toFixed(1) + " °F");

    // Humidity
    $(".humidity").text("Humidity: " + response.main.humidity + "%");

    // Wind speed
    $(".wind").text("Wind Speed: " + response.wind.speed.toFixed(1) + " MPH");

    // UV index
    var lon = response.coord.lon;
    var lat = response.coord.lat;
    uvIndex(lon, lat);
  });
}

// This is the function to get uv Index value for that city with lon and lat parameter

function uvIndex(lon, lat) {
  // SEARCHES

  var indexURL =
    "https://api.openweathermap.org/data/2.5/uvi?appid=ee7c3298c2fab93deaad71567a82a537&lat=" +
    lat +
    "&lon=" +
    lon;
  console.log(indexURL);

  $.ajax({
    url: indexURL,
    method: "GET",
  }).then(function (response) {
    var uvValue = response.value;
    // display uv index on a button and different colors indicates the conditions: favorable, moderate, or severe

    $(".uvIndex").append("UV Index: ");
    var uvBtn = $("<button>").text(uvValue);
    $("#uv").append(uvBtn);

    if (uvValue < 3) {
      // green means favorable
      uvBtn.attr("class", "uvFavorable");
    } else if (uvValue < 6) {
      // yellow means moderate
      uvBtn.attr("class", "uvModerate");
    } else if (uvValue < 11) {
      // red means severe
      uvBtn.attr("class", "uvSevere");
    } else {
      // purple means extreme condition
      uvBtn.attr("class", "uvExtreme");
    }
  });
}

// This function displays list of city search history

function renderButtons() {
  // Empty the button value stored previously
  $(".list-group").empty();

  // Looping through the array of cities
  for (var i = 0; i < cityList.length; i++) {
    
    var li = $("<li>");
    // Adding a class
    li.addClass("cityName");
    li.addClass("list-group-item");
    // Adding a data-attribute
    li.attr("data-name", cityList[i]);
    // button value
    li.text(cityList[i]);
    // Add button to the first row of the list
    $(".list-group").prepend(li);
  }

  $(".cityName").on("click", function (event) {
    event.preventDefault();

    var city = $(this).data("name");
    console.log("prev searched city" + city);

    //call five days weather forecast 
    forecastWeather(city);
    //city weather info display
    citySearch(city);
  });
}

// Display five cards which include five days weather forecast for this city

function forecastWeather(city) {
  var forecastURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=" +
    APIKey;
  console.log(forecastURL);

  //clear out old value
  $(".card-text").empty();
  $(".card-title").empty();

  $.ajax({
    url: forecastURL,
    method: "GET",
  }).then(function (response) {

    
// use moment format the date for next five days
    var dateOne = moment().add(1, "days").format("l");
    $(".date-1").append(dateOne);
    var dateTwo = moment().add(2, "days").format("l");
    $(".date-2").append(dateTwo);
    var dateThree = moment().add(3, "days").format("l");
    $(".date-3").append(dateThree);
    var dateFour = moment().add(4, "days").format("l");
    $(".date-4").append(dateFour);
    var dateFive = moment().add(5, "days").format("l");
    $(".date-5").append(dateFive);

    //weather condition icon

    var iconOneSrc =
      "https://openweathermap.org/img/w/" +
      response.list[4].weather[0].icon +
      ".png";
    console.log(iconOneSrc);
    var iconOne = $("<img>").attr("src", iconOneSrc);
    $(".icon-1").append(iconOne);

    var iconTwoSrc =
      "https://openweathermap.org/img/w/" +
      response.list[12].weather[0].icon +
      ".png";
    var iconTwo = $("<img>").attr("src", iconTwoSrc);
    $(".icon-2").append(iconTwo);

    var iconThreeSrc =
      "https://openweathermap.org/img/w/" +
      response.list[20].weather[0].icon +
      ".png";
    var iconThree = $("<img>").attr("src", iconThreeSrc);
    $(".icon-3").append(iconThree);

    var iconFourSrc =
      "https://openweathermap.org/img/w/" +
      response.list[28].weather[0].icon +
      ".png";
    var iconFour = $("<img>").attr("src", iconFourSrc);
    $(".icon-4").append(iconFour);

    var iconFiveSrc =
      "https://openweathermap.org/img/w/" +
      response.list[36].weather[0].icon +
      ".png";
    var iconFive = $("<img>").attr("src", iconFiveSrc);
    $(".icon-5").append(iconFive);

    //temperature

    $(".temp-1").append(
      "Temp: " +
        ((response.list[2].main.temp - 273.15) * 1.8 + 32).toFixed(1) +
        " °F"
    );

    $(".temp-2").append(
      "Temp: " +
        ((response.list[10].main.temp - 273.15) * 1.8 + 32).toFixed(1) +
        " °F"
    );

    $(".temp-3").append(
      "Temp: " +
        ((response.list[18].main.temp - 273.15) * 1.8 + 32).toFixed(1) +
        " °F"
    );

    $(".temp-4").append(
      "Temp: " +
        ((response.list[26].main.temp - 273.15) * 1.8 + 32).toFixed(1) +
        " °F"
    );

    $(".temp-5").append(
      "Temp: " +
        ((response.list[34].main.temp - 273.15) * 1.8 + 32).toFixed(1) +
        " °F"
    );

    //humidity
    
    $(".humidity-1").append(
      "Humidity: " + response.list[2].main.humidity + "%"
    );

    $(".humidity-2").append(
      "Humidity: " + response.list[10].main.humidity + "%"
    );

    $(".humidity-3").append(
      "Humidity: " + response.list[18].main.humidity + "%"
    );

    $(".humidity-4").append(
      "Humidity: " + response.list[26].main.humidity + "%"
    );

    $(".humidity-5").append(
      "Humidity: " + response.list[34].main.humidity + "%"
    );
  });
}

// click event for city weather search

$("#btn-search").on("click", function (event) {
  // prevent submit event
  event.preventDefault();
  var city = $("#city-value").val().trim();

  //push new city into the Array
  var hasCities = false;

  if (cityList != null) {
    $(cityList).each(function (e) {
      if (cityList[e] === city) {
        hasCities = true;
      }
    });
  }
  if (hasCities === false) {
    cityList.push(city);
  }

  // set to store city in localStorage
  localStorage.setItem("cities", JSON.stringify(cityList));

  //call city weather five days forecast
  forecastWeather(city);

  // search city weather information
  citySearch(city);

  // add city to search history list
  renderButtons();
  $("#city-value").empty();
});

renderButtons();
