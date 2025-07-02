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

  const handleMapClick = async (lat, lng) => {
    setLoading(true);
    setError('');
    setWeather(null);

    const endpoint = process.env.REACT_APP_OPEN_METEO_ENDPOINT;
    if (!endpoint) {
      setError('Open-Meteo endpoint missing in .env');
      setLoading(false);
      return;
    }

    try {
      const url = `${endpoint}?latitude=${lat}&longitude=${lng}&current_weather=true`;
      const response = await axios.get(url);

      if (!response.data.current_weather) {
        setError('No weather data available for this location.');
      } else {
        setWeather({
          temp: response.data.current_weather.temperature,
          wind: response.data.current_weather.windspeed,
          condition: 'N/A', // Open-Meteo doesn't provide description
          name: `Lat: ${lat.toFixed(2)}, Lon: ${lng.toFixed(2)}`,
        });
      }
    } catch (err) {
      setError('Failed to fetch weather data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={appStyle}>
      <h1>Weather Dashboard</h1>
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