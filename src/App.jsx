import React, { useState } from 'react';
import Map from './Map'; // Your Map component that calls onMapClick(lat, lng)
import axios from 'axios';

const appStyle = {
  fontFamily: 'Arial, sans-serif',
  textAlign: 'center',
  padding: '20px',
  background: '#f0f4f8',
  minHeight: '100vh',
};

const weatherBoxStyle = {
  margin: '20px auto',
  padding: '20px',
  background: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  maxWidth: '350px',
};

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMapClick = async (lat, lng, placeName) => {
    setLoading(true);
    setError('');
    setWeather(null);
  
    try {
      const baseUrl = process.env.REACT_APP_OPEN_METEO_ENDPOINT; // e.g. https://api.open-meteo.com/v1/forecast
      const params = process.env.REACT_APP_OPEN_METEO_PARAMS; // e.g. hourly=temperature_2m,precipitation&current_weather=true&timezone=auto&units=metric
  
      // Build full URL
      const url = `${baseUrl}?latitude=${lat}&longitude=${lng}&${params}`;
  
      const response = await axios.get(url);
  
      if (response.data.current_weather) {
        const current = response.data.current_weather;
  
        setWeather({
          temp: current.temperature,
          wind: current.windspeed,
          condition: current.weathercode,  // Note: Open-Meteo uses weather codes, not descriptions
          name: placeName || 'Unknown location',
        });
      } else {
        setError('No current weather data available.');
      }
    } catch (err) {
      setError('Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div style={appStyle}>
      <h1>Amit Vibing - Weather Dashboard</h1>
      <Map onMapClick={handleMapClick} />
      <div style={weatherBoxStyle}>
        {loading && <p>Loading weather...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {weather && !loading && !error && (
          <div>
            <h2>{weather.name}</h2>
            <p><strong>Temperature:</strong> {weather.temp}°C</p>
            <p><strong>Wind Speed:</strong> {weather.wind} m/s</p>
            <p><strong>Condition:</strong> {weather.condition}</p>
          </div>
        )}
        {!weather && !loading && !error && <p>Click on the map to get weather info.</p>}
      </div>
    </div>
  );
}

export default App;