import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useState, useMemo } from "react";

export default function MapPage() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  const center = useMemo(() => ({
    lat: 41.8821,
    lng: -87.6240,
  }), []);

  const [userPins, setUserPins] = useState([]);
  const [menuPosition, setMenuPosition] = useState(null);
  const [clickedLatLng, setClickedLatLng] = useState(null);

  // Right click on map
  const handleRightClick = (event) => {
    event.domEvent.preventDefault();

    setMenuPosition({
      x: event.domEvent.clientX,
      y: event.domEvent.clientY,
    });

    setClickedLatLng({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  // Place pin
  const handlePlacePin = () => {
    if (!clickedLatLng) return;

    setUserPins((prev) => [...prev, clickedLatLng]);
    setMenuPosition(null);
  };

  // Close menu when clicking map
  const handleMapClick = () => {
    setMenuPosition(null);
  };

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>

      {/* Right-click menu */}
      {menuPosition && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            handlePlacePin();
          }}
          style={{
            position: "fixed",
            top: menuPosition.y,
            left: menuPosition.x,
            background: "white",
            border: "1px solid #ccc",
            padding: "6px 10px",
            borderRadius: "6px",
            cursor: "pointer",
            zIndex: 9999,
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          Place Pin
        </div>
      )}

      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={13}
        onRightClick={handleRightClick}
        onClick={handleMapClick}
      >
        {userPins.map((pin, index) => (
          <Marker key={index} position={pin} />
        ))}
      </GoogleMap>
    </div>
  );
}
