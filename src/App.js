import './App.css';
import Search from './components/search/search';
import CurrentWeather from './components/current-weather/currentWeather';
import { useState, useEffect } from 'react';
import ForeCast from './components/forecast/forecast';

function App() {
  const [imageUrl, setImageUrl] = useState('https://res.cloudinary.com/winterns/image/upload/v1706982390/ckg8yiqyiszpf3zwusjn.jpg');
  const [currentWeather, setcurrentWeather] = useState(null);
  const [forecast, setForeCast] = useState(null);
  const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
  const WEATHER_API_URL = process.env.REACT_APP_WEATHER_API_URL;

  useEffect(() => {
    document.body.style.backgroundImage = `url(${imageUrl})`;
  }, [imageUrl]);

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");
    const city = searchData.label;

    const imageUrl = fetch('https://free-images-api.p.rapidapi.com/images/' + city, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.REACT_APP_IMAGE_API_KEY,
        'X-RapidAPI-Host': process.env.REACT_APP_IMAGE_API_HOST
      }
    });

    const currentWeatherFetch = fetch(`${WEATHER_API_URL}weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);

    const forecastFetch = fetch(`${WEATHER_API_URL}forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);

    Promise.all([currentWeatherFetch, forecastFetch, imageUrl])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();
        const imageResponse = await response[2].json();
        // Random number between 0 to 19
        const random = Math.floor(Math.random() * 20);

        setcurrentWeather({ city: searchData.label, ...weatherResponse });
        setForeCast({ city: searchData.label, ...forecastResponse });
        setImageUrl(imageResponse.results[random].image);
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="container">
      <Search onSearchChange={handleOnSearchChange} />
      {currentWeather && <CurrentWeather data={currentWeather} />}
      {forecast && <ForeCast data={forecast} />}
    </div>
  );
}

export default App;
