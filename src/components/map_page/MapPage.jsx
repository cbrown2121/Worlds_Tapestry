import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useState, useMemo, useEffect } from "react";

export default function MapPage() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  const [center, setCenter] = useState({
    lat: 0,
    lng: 0
  });

  const [locations, setLocations] = useState([]);

  const getIndex = (locationName, locationList) => {
    for (let i = 0; i < locationList.length; i++) {
      if (locationList[i].LocationName == locationName) {
        return i;
      }
    }
  }

  useEffect(() => {
      fetch("http://localhost:5000/location")
      .then(response => response.json())
      .then(locationList => {
        let index = getIndex("Oakland University", locationList);
        setLocations(locationList);
        setCenter({
          lat: parseFloat(locationList[index].Latitude),
          lng: parseFloat(locationList[index].Longitute)
        });
      }).catch(error => console.error(error));
  }, []);

  const updateMap = (locationName) => { // make this more robust later and have it use the react states
    fetch("http://localhost:5000/location")
      .then(response => response.json())
      .then(locationList => {
        let index = getIndex(locationName, locationList);
        setLocations(locationList);
        setCenter({
          lat: parseFloat(locationList[index].Latitude),
          lng: parseFloat(locationList[index].Longitute)
        });
    }).catch(error => console.error(error));
  }

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

        <button onClick={() => updateMap("Oakland University")} >Oakland</button>
        <button onClick={() => updateMap("Eiffel Tower")} >Eiffel Tower</button>
        <button onClick={() => updateMap("Mackinac Bridge")} ></button>
    </div>
  );
}
