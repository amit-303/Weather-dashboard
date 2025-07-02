import React, { useEffect, useRef } from 'react';

const mapContainerStyle = {
  width: '100%',
  maxWidth: '700px',
  height: '400px',
  margin: '0 auto',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  marginBottom: '20px',
};

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

const Map = ({ onMapClick }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('Google Maps API key is missing');
      return;
    }
    const src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    let listener = null;

    loadScript(src)
      .then(() => {
        if (!window.google) return;
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: { lat: 40.7128, lng: -74.006 },
          zoom: 3,
        });
        listener = mapInstance.current.addListener('click', (e) => {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          onMapClick(lat, lng);
        });
      })
      .catch(() => {
        console.error('Failed to load Google Maps script');
      });

    return () => {
      if (listener) {
        listener.remove();
      }
    };
  }, [onMapClick]);

  return <div ref={mapRef} style={mapContainerStyle} />;
};

export default Map;
