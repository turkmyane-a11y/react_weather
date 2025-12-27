import axios from "axios";
import "./App.css";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import { useEffect, useState } from "react";

function App() {
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState("");
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchWeather = async (city) => {
    if (!city || city.trim() === "") {
      return;
    }
    setCurrentCity(city);
    console.log("Ищем город:", city);

    setIsLoading(true);
    setError(null);
    setWeatherInfo(null);

    try {
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

      if (data.cod == 404) {
        throw new Error("Город не найден");
      }

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

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Ваш браузер не поддерживает геолокацию");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ru`;
      const response = await axios.get(url, {
        // signal: controller.signal,
        // timeout: 10000,
      });
      console.log("Ваше местоположение", response.data.name),
        {
          enableHighAccuracy: true, // ← важно!
          maximumAge: 0, // ← не использовать кеш
          timeout: 10000,
        };
    });
  }, []);
  return (
    <div>
      <h1>Погода</h1>
      <SearchBar onSearch={fetchWeather} />
      {isLoading && <div>Загрузка...</div>}
      {error && <div>Ошибка {error}</div>}
      {weatherInfo && <WeatherCard value={currentCity} data={weatherInfo} />}
      <button
        onClick={() => {
          navigator.geolocation.getCurrentPosition(
            (pos) =>
              console.log(
                "Координаты:",
                pos.coords.latitude,
                pos.coords.longitude
              ),
            (err) => console.log("Ошибка:", err)
          );
        }}
      >
        Проверить координаты
      </button>
    </div>
  );
}

export default App;
