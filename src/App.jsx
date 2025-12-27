import axios from "axios";
import "./App.css";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import { useState } from "react";

function App() {
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState("");
  const [error, setError] = useState("");

  const fetchWeather = async (city) => {
    setCurrentCity(city);
    console.log("Ищем город:", city);

    setIsLoading(true);
    setError(null);
    setWeatherInfo(null);

    try {
      const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
      if (!API_KEY) {
        throw new Error("API ключ не настроен");
      }
      const encodedCity = encodeURIComponent(city);
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${API_KEY}&units=metric&lang=ru`;
      console.log("Делаем запрос к", url);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await axios.get(url, {
        signal: controller.signal,
        timeout: 10000,
      });
      clearTimeout(timeoutId);

      const data = await response.data;

      if (data.cod !== 200) {
        throw new Error("Ошибка:", data.message || "Неизвестная ошибка API");
      }

      setWeatherInfo(data);

      console.log("Данные получены:", data);
    } catch (error) {
      let errorMessage = "Неизвестная ошибка";

      if (error.name === "AbortError") {
        errorMessage = "Превышено время ожидания";
      } else {
        errorMessage = error.message;
      }

      setError(errorMessage);
      setWeatherInfo(null);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <h1>Погода</h1>
      <SearchBar onSearch={fetchWeather} />
      {isLoading && <div>Загрузка...</div>}
      {error && <div>Ошибка {error}</div>}
      {weatherInfo && <WeatherCard value={currentCity} data={weatherInfo} />}
    </div>
  );
}

export default App;
