// Create global variables
var apiKey = '582b12347eeccfd7da6831e8aac48bf6';
var apiURL = 'https://api.openweathermap.org/data/2.5/weather?q=';
var apiForecastURL = 'https://api.openweathermap.org/data/2.5/forecast?q=';
var apiMetrics = '&units=imperial';
var cityArray = [];

// Renders current weather results on html
function currentWeather(weatherJSON){
    // Clear old results
    $('#weather-results').empty();

    var currentResults = document.querySelector("#weather-results");
    //city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the the wind speed
    //create h2 for city name

    var renderCity = document.createElement("h2");
    renderCity.textContent = weatherJSON.name.toString();
    currentResults.append(renderCity); 
    //create img for weather icon
    var renderIcon = document.createElement("img");
    renderIcon.src = "http://openweathermap.org/img/wn/" + weatherJSON.weather[0].icon + "@2x.png";
    currentResults.append(renderIcon);
    //create p for date
    var renderDate = document.createElement("h2");
    //var dateValue = new Date(weather.dt *1000)
    renderDate.textContent = "Today is: " + dayjs(weatherJSON.dt *1000).format("YYYY-MM-DD");
    currentResults.append(renderDate);
    //create p for temperature
    var renderTemp = document.createElement("p");
    renderTemp.textContent = "Temperature: " + weatherJSON.main.temp + " °F";
    currentResults.append(renderTemp);
    //create p for humidity
    var renderHumidity = document.createElement("p");
    renderHumidity.textContent = "Humidity: " + weatherJSON.main.humidity + " %";
    currentResults.append(renderHumidity);
    //create p for wind speed
    var renderWindspeed = document.createElement("p");
    renderWindspeed.textContent = "Wind Speed: " + weatherJSON.wind.speed + "  mph";
    currentResults.append(renderWindspeed);

}

// Render forecast results on html
function forecastWeather(weatherJSON){
    // Create a 5-day array for weather forecast
    var forecastArray = [];
    
    // Clear old results
    $('#weather-forecast-results').empty();

    // Append on div weather-results
    var forecastResults = document.querySelector("#weather-forecast-results");
    
    // Create h2 for forecast weather
    var forecastHeader = document.createElement("h2");
    forecastHeader.textContent = "5-Day Forecast";
    forecastResults.append(forecastHeader);
    
    // Popuplate the array with dates using a for loop
    for(i = 1; i < 6; i++) {
        var nextDate = dayjs().add(i, 'day').format("YYYY-MM-DD").toString() + " 00:00:00";
        forecastArray.push(nextDate);
    } 
    console.log(forecastArray);

    // Query forecast
    for(i = 0; i < forecastArray.length; i++){
        //var results = [];
        var searchVal =  forecastArray[i];

        console.log(searchVal);
        //var searchVal = "2023-02-03 12:00:00"

        // Search in JSON
        for(a = 0; a < weatherJSON.list.length; a++) {
            var searchKey = dayjs(weatherJSON.list[a].dt_txt).format("YYYY-MM-DD HH:mm:ss").toString();
            if (searchKey.match(searchVal)){
                console.log("match: "+ searchKey);
                //show forecast date
                var forecastDate = document.createElement("h2");
                forecastDate.textContent = dayjs(weatherJSON.list[a].dt_txt).format("YYYY-MM-DD");
                forecastResults.append(forecastDate); 
                //show weather icon for forecast
                var forecastIcon = document.createElement("img");
                forecastIcon.src = "http://openweathermap.org/img/wn/" + weatherJSON.list[a].weather[0].icon + "@2x.png";
                forecastResults.append(forecastIcon);
                //show temperature forecast
                var forecastTemp = document.createElement("p");
                forecastTemp.textContent = "Temperature: " + weatherJSON.list[a].main.temp + " °F";
                forecastResults.append(forecastTemp);
                //show humidity forecast
                var forecastHumidity = document.createElement("p");
                forecastHumidity.textContent = "Humidity: " + weatherJSON.list[a].main.humidity + " %";
                forecastResults.append(forecastHumidity);
                //show wind speed forecast
                var forecastWindspeed = document.createElement("p");
                forecastWindspeed.textContent = "Wind Speed: " + weatherJSON.list[a].wind.speed + "  mph";
                forecastResults.append(forecastWindspeed);
            }
        }
    }
}

/*Search button saves and render weather results*/
$('#searchButton').on("click", function(event){
    event.preventDefault();
    // Get search string
    var cityName = $('#citySearch').val();
    cityName.trim();
    // Save searched city name into array
    cityArray.push(cityName);
    // Store new/updated array in local storage
    localStorage.setItem("cityArray", JSON.stringify(cityArray));
    // Refresh search history list
    searchResult();
    // Query the weather API
    fetchWeather(cityName);
})

/*Click on search history then render weather results*/
function clickHistory(cityName) {
    // Query the weather API
    fetchWeather(cityName);
}

// Post/update search history on html page as buttons
function searchResult(){
    $('#searchHistory').empty();
    var searchHistory = document.querySelector("#searchHistory");
    
    for (i = 0;  i < cityArray.length; i++){
        var searchCity = document.createElement("button");
        var cityValue = cityArray[i];
        searchCity.textContent = cityValue;
        searchCity.setAttribute('value', cityValue);
        searchCity.setAttribute ('onclick', 'clickHistory(this.value)');
        searchCity.style = 'searchHistory';
        searchHistory.append(searchCity);
    }   
}

// Query the API and post JSON for results rendering
function fetchWeather(cityName){
    var completeURL = apiURL + cityName + "&appid=" + apiKey + apiMetrics;
    fetch(completeURL)
        .then((response) => response.json())
        .then((data) => currentWeather(data));

    var forecastURL = apiForecastURL + cityName + "&appid=" + apiKey + apiMetrics;
    fetch(forecastURL)
        .then((response) => response.json())
        .then((data) => forecastWeather(data));
   
}
