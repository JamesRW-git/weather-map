"use strict";

const options = {method: 'GET', headers: {Accept: 'application/json'}};
//New Orleans is LAT: 29.97 LON: -90.08
let lat = mapLat;
let lon = mapLon;
let units = 'imperial';
let weatherDisplay;
let windDirection;
let currentWindAzimuth;
let pressure;
let time;

//Initializes Data (without this no weather data is available until a new location is set)
getData(mapLat, mapLon);

//Fetches data and runs Current/Forecasted Weather Functions
function getData(lat, lon) {
//could add together in the address to even further programmatically do this
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${OWM_key}`)
        //no semicolons until the end because we're chaining
        .then(response => response.json())
        //arrow function must have curly braces if you have more than one line of code in the body
        .then(response => getSanitizedData(response))
        .then((data) => {
            renderCurrentWeather(data)
            renderFiveDayForecast(data)
        })
        .catch(err => console.error(err));
}

//Clears Data from #forecast on each pass
function clearData() {
    $('#forecast').html("");
}

//Sanitizes data from API request
function getSanitizedData(dataBody) {
    return {
        locationLat: dataBody.lat,
        locationLng: dataBody.lng,
        currentTemp: dataBody.current.temp,
        todayForecastMaxTemp: dataBody.daily[0].temp.max,
        todayForecastMinTemp: dataBody.daily[0].temp.min,
        today: timeConverter(dataBody.daily[0].dt),
        currentWeatherType: dataBody.current.weather[0].main,
        currentWindAzimuth: dataBody.current.wind_deg,
        currentWindSpeed: dataBody.current.wind_speed,
        currentPressure: dataBody.current.pressure,
        currentHumidity: dataBody.current.humidity,
        dailyForecast: dataBody.daily //Current day is at index 0, tomorrow index 1, day after tomorrow index 2, etc.
    };
}

//Converts UNIX timestamp to Day Month Year format
function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    time = date + ' ' + month + ' ' + year;
    return time;
}

//Converts wind direction from azimuth to English
function convertWindDirection(azimuth) {
    windDirection = `${currentWindAzimuth}`;
    if (azimuth >= 0 && azimuth <= 22.5) {
        return windDirection = 'North';
    } else if (azimuth > 22.5 && azimuth <= 45) {
        return windDirection = 'North-northeast';
    } else if (azimuth > 45 && azimuth <= 67.5) {
        return windDirection = 'Northeast';
    } else if (azimuth > 67.5 && azimuth <= 90) {
        return windDirection = 'East-northeast';
    } else if (azimuth > 90 && azimuth <= 112.5) {
        return windDirection = 'East';
    } else if (azimuth > 112.5 && azimuth <= 135) {
        return windDirection = 'East-southeast';
    } else if (azimuth > 135 && azimuth <= 157.5) {
        return windDirection = 'Southeast';
    } else if (azimuth > 157.5 && azimuth <= 180) {
        return windDirection = 'South-southeast';
    } else if (azimuth > 180 && azimuth <= 202.5) {
        return windDirection = 'South';
    } else if (azimuth > 202.5 && azimuth <= 225) {
        return windDirection = 'Southwest';
    } else if (azimuth > 225 && azimuth <= 247.5) {
        return windDirection = 'West-southwest';
    } else if (azimuth > 247.5 && azimuth <= 270) {
        return windDirection = 'West';
    } else if (azimuth > 270 && azimuth <= 292.5) {
        return windDirection = 'West-northwest';
    } else if (azimuth > 292.5 && azimuth <= 315) {
        return windDirection = 'Northwest';
    } else if (azimuth > 315 && azimuth <= 337.5) {
        return windDirection = 'North-northwest';
    } else if (azimuth > 337.5 && azimuth <= 360) {
        return windDirection = 'North';
    }
}

//Converts weather type to corresponding image with styling for CURRENT WEATHER
//language=HTML
function convertWeatherTypeToImg(weatherType) {
    if (weatherType === 'Clear') {
        weatherDisplay = `<img class="weather-pic mx-auto" src="/pictures_and_stuff/clear.jpeg"
                               alt="sunny day with a pretty sunflower">`
    } else if (weatherType === 'Thunderstorm') {
        weatherDisplay = `<img class="weather-pic mx-auto" src="/pictures_and_stuff/thunderstorm.jpeg"
                               alt="thunderstorm over a cabin">`
    } else if (weatherType === 'Drizzle') {
        weatherDisplay = `<img class="weather-pic mx-auto" src="/pictures_and_stuff/drizzle.webp"
                               alt="rain into a man's hand">`
    } else if (weatherType === 'Rain') {
        weatherDisplay = `<img class="weather-pic mx-auto" src="/pictures_and_stuff/rain.jpeg"
                               alt="rain into a puddle">`
    } else if (weatherType === 'Snow') {
        weatherDisplay = `<img class="weather-pic mx-auto" src="/pictures_and_stuff/snow.jpeg" alt="snowy cabins">`
    } else if (weatherType === 'Fog') {
        weatherDisplay = `<img class="weather-pic mx-auto" src="/pictures_and_stuff/fog.jpeg" alt="foggy forest">`
    } else if (weatherType === 'Mist') {
        weatherDisplay = `<img class="weather-pic mx-auto" src="/pictures_and_stuff/mist.jpeg" alt="mist">`
    } else if (weatherType === 'Smoke') {
        weatherDisplay = `<img class="weather-pic mx-auto" src="/pictures_and_stuff/smoke.jpeg" alt="smoke">`
    } else if (weatherType === 'Haze') {
        weatherDisplay = `<img class="weather-pic mx-auto" src="/pictures_and_stuff/haze.jpeg" alt="hazy woods">`
    } else if (weatherType === 'Dust' || forecast.currentWeatherType === 'Sand') {
        weatherDisplay = `<img class="weather-pic mx-auto" src="/pictures_and_stuff/dust.jpeg" alt="dusty area">`
    } else if (weatherType === 'Ash') {
        weatherDisplay = `<img class="weather-pic mx-auto" src="/pictures_and_stuff/ash.jpeg" alt="volcanic ash">`
    } else if (weatherType === 'Squall') {
        weatherDisplay = `<img class="weather-pic mx-auto" src="/pictures_and_stuff/squall.jpeg" alt="squall">`
    } else if (weatherType === 'Tornado') {
        weatherDisplay = `<img class="weather-pic mx-auto" src="/pictures_and_stuff/tornado.jpeg" alt="tornado">`
    } else if (weatherType === 'Clouds') {
        weatherDisplay = `<img class="weather-pic mx-auto" src="/pictures_and_stuff/clouds.jpeg" alt="clouds">`
    }
}

//Converts weather type to corresponding image with styling for FORECASTED WEATHER
//language=HTML
function convertWeatherTypeToImgRepeated(weatherType) {
    if (weatherType === 'Clear') {
        weatherDisplay = `<img class="weather-pic-repeat mx-auto mt-1" src="/pictures_and_stuff/clear.webp" alt="sunny day with a pretty sunflower">`
    } else if (weatherType === 'Thunderstorm') {
        weatherDisplay = `<img class="weather-pic-repeat mx-auto mt-1" src="/pictures_and_stuff/thunderstorm.jpeg" alt="thunderstorm over a cabin">`
    } else if (weatherType === 'Drizzle') {
        weatherDisplay = `<img class="weather-pic-repeat mx-auto mt-1" src="/pictures_and_stuff/drizzle.webp" alt="rain into a man's hand">`
    } else if (weatherType === 'Rain') {
        weatherDisplay = `<img class="weather-pic-repeat mx-auto mt-1" src="/pictures_and_stuff/rain.jpeg" alt="rain into a puddle">`
    } else if (weatherType === 'Snow') {
        weatherDisplay = `<img class="weather-pic-repeat mx-auto mt-1" src="/pictures_and_stuff/snow.jpeg" alt="snowy cabins">`
    } else if (weatherType === 'Fog') {
        weatherDisplay = `<img class="weather-pic-repeat mx-auto mt-1" src="/pictures_and_stuff/fog.jpeg" alt="foggy forest">`
    } else if (weatherType === 'Mist') {
        weatherDisplay = `<img class="weather-pic-repeat mx-auto mt-1" src="/pictures_and_stuff/mist.jpeg" alt="mist">`
    } else if (weatherType === 'Smoke') {
        weatherDisplay = `<img class="weather-pic-repeat mx-auto mt-1" src="/pictures_and_stuff/smoke.webp" alt="smoke">`
    } else if (weatherType === 'Haze') {
        weatherDisplay = `<img class="weather-pic-repeat mx-auto mt-1" src="/pictures_and_stuff/haze.jpeg" alt="hazy woods">`
    } else if (weatherType === 'Dust' || forecast.currentWeatherType === 'Sand') {
        weatherDisplay = `<img class="weather-pic-repeat mx-auto mt-1" src="/pictures_and_stuff/dust.jpeg" alt="dusty area">`
    } else if (weatherType === 'Ash') {
        weatherDisplay = `<img class="weather-pic-repeat mx-auto mt-1" src="/pictures_and_stuff/ash.jpeg" alt="volcanic ash">`
    } else if (weatherType === 'Squall') {
        weatherDisplay = `<img class="weather-pic-repeat mx-auto mt-1" src="/pictures_and_stuff/squall.jpeg" alt="squall">`
    } else if (weatherType === 'Tornado') {
        weatherDisplay = `<img class="weather-pic-repeat mx-auto mt-1" src="/pictures_and_stuff/tornado.webp" alt="tornado">`
    } else if (weatherType === 'Clouds') {
        weatherDisplay = `<img class="weather-pic-repeat mx-auto mt-1" src="/pictures_and_stuff/clouds.jpeg" alt="clouds">`
    }
}

//Converts atmospheric pressure in hectopascals to inches mercury
function convertHpaToMerc(hPa) {
    return pressure = (hPa * 0.029529983071445).toFixed(2);
}

//Renders the current weather conditions
//language=HTML
function renderCurrentWeather(forecast) {
    //Selects picture to display for current weather
    convertWeatherTypeToImg(`${forecast.currentWeatherType}`)
    //Converts wind direction for current weather
    convertWindDirection(`${forecast.currentWindAzimuth}`)
    //Convert pressure to inches mercury
    convertHpaToMerc(`${forecast.currentPressure}`)
    $('#locationName').html(`
                ${weatherDisplay}
                <div class="card-body p-3 border cardStyle ramaraja">
                    <h3 class="card-text text-nowrap fw-bold">Current Weather</h3>
                    <hr>
                    <p class="card-text mb-1 text-nowrap fw-bold">Weather Conditions: ${forecast.currentWeatherType}</p>
                    <p class="card-text mb-1 text-nowrap fw-bold">Temperature: ${forecast.currentTemp}°F</p>
                    <p class="card-text mb-1 text-nowrap fw-bold">Wind Direction: ${windDirection}</p>
                    <p class="card-text mb-1 text-nowrap fw-bold">Wind Speed: ${forecast.currentWindSpeed} mph</p>
                    <p class="card-text mb-0 text-nowrap fw-bold">Pressure: ${pressure} inHg</p>
                    <p class="card-text mb-0 text-nowrap fw-bold">Humidity: ${forecast.currentHumidity}%</p>
                </div>
        `
    )
}

//Renders forecast for current day and next five days
//language=HTML
function renderFiveDayForecast(forecast) {
    // console.log(forecast.dailyForecast[0].weather[0].main)
    //Clears out #forecast on each run of the FiveDayForecast
    clearData();
    forecast.dailyForecast.forEach(function (day, i) {
        //Returns date in human
        timeConverter(`${forecast.dailyForecast[i].dt}`);
        //Selects picture to display for current weather
        convertWeatherTypeToImgRepeated(`${forecast.dailyForecast[i].weather[0].main}`);
        //Converts wind direction for current weather
        convertWindDirection(`${forecast.dailyForecast[i].wind_deg}`);
        //Convert pressure to inches mercury
        convertHpaToMerc(`${forecast.dailyForecast[i].pressure}`);
        if (i <= 4) {
            $('#forecast').append(`
                <div class="card col cardStyle border" style="width: 18rem;">
                    ${weatherDisplay}
                    <div class="card-body ramaraja">
                        <h5 class="card-text fw-bold text-nowrap">Forecast for ${time}</h5>
                        <hr>
                        <p class="card-text mb-1 fw-bold text-nowrap">Weather Conditions:
                            ${forecast.dailyForecast[i].weather[0].main}</p>
                        <p class="card-text mb-1 fw-bold text-nowrap">High Temperature: ${forecast.dailyForecast[i].temp.max}
                            °F</p>
                        <p class="card-text mb-1 fw-bold text-nowrap">Low Temperature: ${forecast.dailyForecast[i].temp.min}
                            °F</p>
                        <p class="card-text mb-1 fw-bold text-nowrap">Wind Direction: ${windDirection}</p>
                        <p class="card-text mb-1 fw-bold text-nowrap">Wind Speed: ${forecast.dailyForecast[i].wind_speed}
                            mph</p>
                        <p class="card-text mb-1 fw-bold text-nowrap">Pressure: ${pressure} inHg</p>
                        <p class="card-text mb-1 fw-bold text-nowrap">Humidity: ${forecast.dailyForecast[i].humidity}%</p>
                    </div>
                </div>`
            )
        }
    })
}

//Sets click event on Github logo that links to my Github
$('#github').click(function (){
    window.open('https://github.com/JamesRW-git');
})

//Sets click event on Codeup logo that links to Codeup website
$('#codeup').click(function (){
    window.open('https://codeup.com/')
})

