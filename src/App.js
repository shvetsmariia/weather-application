import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const apiKey = process.env.REACT_APP_API_KEY;

  const weatherAPI = {
    fetchWeather(city) {
      fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`)
        .then((response) => response.json())
        .then((data) => {
          this.displayWeather(data);
        });
    },

    displayWeather(data) {
      const name = data?.location?.name;
      const text = data?.current?.condition?.text;
      const icon = data?.current?.condition?.icon;
      const temp_c = data?.current?.temp_c;
      const temp_f = data?.current?.temp_f;
      const humidity = data?.current?.humidity;
      const wind_kph = data?.current?.wind_kph;

      const cityElement = document.querySelector('.city');
      if (cityElement) {
        cityElement.innerText = name || '';
      }

      const descriptionElement = document.querySelector('.description');
      if (descriptionElement) {
        descriptionElement.innerText = text || '';
      }

      const iconElement = document.querySelector('.icon');
      if (iconElement) {
        iconElement.src = icon ? `https:${icon}` : '';
      }

      const tempElement = document.querySelector('.temp');
      if (tempElement) {
        tempElement.innerText = `${temp_c?.toFixed(0) || ''}°C / ${temp_f?.toFixed(0) || ''}°F`;
      }

      const humidityElement = document.querySelector('.humidity');
      if (humidityElement) {
        humidityElement.innerText = `Humidity: ${humidity || ''}%`;
      }

      const windElement = document.querySelector('.wind');
      if (windElement) {
        windElement.innerText = `Wind speed: ${wind_kph || ''}km/h`;
      }

      document.body.style.backgroundImage = name ? `url('https://source.unsplash.com/1600x900/?${name}')` : '';
    },

    search() {
      const city = searchTerm || 'Miami';
      this.fetchWeather(city);
      
      if (searchTerm) {
        this.fetchWeather(searchTerm);
      } else {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              this.fetchWeatherByCoordinates(latitude, longitude);
            },
            (error) => {
              console.error('Geolocation Error - Enable Location Services:', error);
              this.fetchWeather('Boston');
            },
          );
          this.fetchWeather('Miami');
        } else {
          console.error('Not supported by the browser');
          this.fetchWeather('Boston');
        }
      }
    },

    fetchWeatherByCoordinates(latitude, longitude) {
      fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&aqi=no`)
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
    },
  };

  const handleSearchButtonClick = () => {
    weatherAPI.search();
  };

  const handleSearchBarKeyUp = (event) => {
    if (event.key === 'Enter') {
      weatherAPI.search();
    }
  };

  useEffect(() => {
    weatherAPI.search();
  }, []);

  return (
    <div className="card">
      <div className="search">
        <input  
            type="text"
            className="search-bar"
            placeholder="Search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            onKeyUp={handleSearchBarKeyUp}
      />
        <button onClick={handleSearchButtonClick}>
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 1024 1024"
            height="1.7em"
            width="1.7em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path>
          </svg>
        </button>
      </div>
      <div className="weather">
        <div className="location">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 12 16"
            height="1.2em"
            width="1.2em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fillRule="evenodd" d="M6 0C2.69 0 0 2.5 0 5.5 0 10.02 6 16 6 16s6-5.98 6-10.5C12 2.5 9.31 0 6 0zm0 14.55C4.14 12.52 1 8.44 1 5.5 1 3.02 3.25 1 6 1c1.34 0 2.61.48 3.56 1.36.92.86 1.44 1.97 1.44 3.14 0 2.94-3.14 7.02-5 9.05zM8 5.5c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z"></path>
          </svg>
          <h2 className="city"></h2>
        </div>
        <h1 className="temp"></h1>
        <img src="" alt="weatherImage" className="icon" />
        <div className="description"></div>
        <div className="humidity"></div>
        <div className="wind"></div>
      </div>
    </div>
  );
}

export default App;
