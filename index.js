const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = 5000;

const apiKey = "8a88ad68ee0d1817316c9b8e6b6e3467";

// Middleware to parse JSON
app.use(express.json());
app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );

// Endpoint to retrieve current weather data for a given city
app.get("/currentWeather/:city", async (req, res) => {
  try {
    const city = req.params.city;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = {
      name: response?.data?.name,
      country: response?.data?.sys?.country,
      icon: response?.data?.weather[0]?.icon,
      temp: response?.data?.main?.temp,
      humidity: response?.data?.main?.humidity,
      visibility: response?.data?.visibility,
      windSpeed: response?.data?.wind.speed,
      description: response?.data?.weather[0]?.description,
    };
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching data" });
  }
});

// Endpoint to retrieve a 5-day weather forecast for a given city
app.get("/forecast/:city", async (req, res) => {
  try {
    const city = req.params.city;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast/daily/?q=${city}&appid=${apiKey}&units=metric`
    );

    const forecastData = response?.data?.list.map((item) => (
      {
      date: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
      temperature: item?.temp.day,
      description: item?.weather[0]?.description,
      icon: item?.weather[0]?.icon,
    }));
    res.json(forecastData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
});

app.get('/currentWeatherByCoords/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
    
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
