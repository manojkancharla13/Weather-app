let key = "9f755144963c4c23aa854623251003";

// Fetch and Display Data
async function getWeatherData(API) {
    try {
        const res = await fetch(API);
        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();
        console.log(data);

        const current = data.current;
        const location = data.location;
        const weatherInfo = document.getElementById("weather-info");

        // Display Current Weather
        weatherInfo.innerHTML = `
      <h2>Weather in ${location.name}, ${location.country}</h2>
      <p>Temperature: ${current.temp_c}°C / ${current.temp_f}°F</p>
      <p>Condition: ${current.condition.text}</p>
      <img src="https:${current.condition.icon}" alt="${current.condition.text}" />
      <p>Humidity: ${current.humidity}%</p>
      <p>Wind Speed: ${current.wind_kph} kph</p>
    `;

        // Fetch and Display Forecast
        getForecast(location.name);
        getHistory(location.name);
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("weather-info").innerHTML = `<p>Error fetching data. Please try again.</p>`;
    }
}

// Fetch Forecast for Next 24 Hours
async function getForecast(city) {
    const API = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&days=1&aqi=no&alerts=no`;
    try {
        const res = await fetch(API);
        const data = await res.json();
        const forecast = data.forecast.forecastday[0].hour;

        let forecastHtml = `<h3>Hourly Forecast</h3><div class="d-flex overflow-auto">`;

        forecast.forEach(hour => {
            forecastHtml += `
        <div class="p-3 text-center">
          <p>${hour.time.split(" ")[1]}</p>
          <img src="https:${hour.condition.icon}" alt="${hour.condition.text}" />
          <p>${hour.temp_c}°C</p>
        </div>
      `;
        });

        forecastHtml += `</div>`;
        document.getElementById("weather-info").innerHTML += forecastHtml;
    } catch (error) {
        console.error("Error fetching forecast:", error);
    }
}

// Fetch Past 7 Days History
async function getHistory(city) {
    const today = new Date();
    let historyHtml = `<h3>Last 7 Days Weather</h3><div class="d-flex overflow-auto">`;

    for (let i = 1; i <= 7; i++) {
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - i);
        const formattedDate = pastDate.toISOString().split("T")[0];

        const API = `https://api.weatherapi.com/v1/history.json?key=${key}&q=${city}&dt=${formattedDate}`;

        try {
            const res = await fetch(API);
            const data = await res.json();
            const day = data.forecast.forecastday[0].day;

            historyHtml += `
        <div class="p-3 text-center">
          <p>${formattedDate}</p>
          <img src="https:${day.condition.icon}" alt="${day.condition.text}" />
          <p>${day.avgtemp_c}°C</p>
        </div>
      `;
        } catch (error) {
            console.error(`Error fetching history for ${formattedDate}:`, error);
        }
    }

    historyHtml += `</div>`;
    document.getElementById("weather-info").innerHTML += historyHtml;
}

// Form Submission Handler
function getcityname(event) {
    event.preventDefault();
    const city = document.forms.form.cityname.value;
    const API = `https://api.weatherapi.com/v1/current.json?key=${key}&q=${city}&aqi=no`;
    getWeatherData(API);
}