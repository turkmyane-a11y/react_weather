import { useState } from "react";

const WeatherCard = ({ data }) => {
  const { name, main, sys, weather } = data;
  const [tempFace, setTempFace] = useState(false);

  const temp = tempFace
    ? Math.round(main.temp)
    : Math.round((main.temp * 9) / 5 + 32);

  const feels_like = tempFace
    ? Math.round(main.feels_like)
    : Math.round((main.feels_like * 9) / 5 + 32);

  if (!data) return null;

  const onToggle = () => {
    setTempFace(!tempFace);
  };

  return (
    <div>
      <h1>
        Погода в городе {name}, {sys.country}
      </h1>
      <h3>Температура {temp}&deg;</h3>
      <h3>{weather.description}</h3>
      <h3>Ощущается как {feels_like}&deg;</h3>
      <h3>Влажность {main.humidity}%</h3>
      <button onClick={onToggle}>Изменить t на F/C</button>
    </div>
  );
};

export default WeatherCard;
