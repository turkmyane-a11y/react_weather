import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [cityInput, setCityInput] = useState("Москва");
  const handleSubmite = (e) => {
    e.preventDefault();
    const cityToSearch = cityInput.trim();
    if (!cityToSearch) {
      console.error("Введите название города");
      return;
    }
    if (cityToSearch) {
      onSearch(cityToSearch);
      setCityInput("");
    }
  };
  return (
    <form onSubmit={handleSubmite}>
      <input
        value={cityInput}
        onChange={(e) => setCityInput(e.target.value)}
        type="text"
        placeholder="Введите город"
      ></input>
      <button type="submit">Поиск</button>
    </form>
  );
};

export default SearchBar;
