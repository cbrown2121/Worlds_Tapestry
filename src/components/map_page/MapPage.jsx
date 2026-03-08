import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function MapPage() {
  const location = useLocation();
  const forumData = location.state;

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  const [center, setCenter] = useState({
    lat: 0,
    lng: 0,
  });

  const [locations, setLocations] = useState([]);
  const [userPins, setUserPins] = useState([]);
  const [menuPosition, setMenuPosition] = useState(null);
  const [clickedLatLng, setClickedLatLng] = useState(null);
  const [currentLocationID, setCurrentLocationID] = useState(null);

  const getIndex = (locationName, locationList) => {
    for (let i = 0; i < locationList.length; i++) {
      if (locationList[i].LocationName === locationName) {
        return i;
      }
    }
    return -1;
  };

  const loadPins = () => {
    fetch("http://localhost:5000/userpins")
      .then((response) => response.json())
      .then((pinList) => {
        if (currentLocationID) {
          const filteredPins = pinList.filter(
            (pin) => String(pin.LocationID) === String(currentLocationID)
          );
          setUserPins(filteredPins);
        } else {
          setUserPins(pinList);
        }
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetch("http://localhost:5000/location")
      .then((response) => response.json())
      .then((locationList) => {
        setLocations(locationList);

        if (forumData && forumData.forumName) {
          const index = getIndex(forumData.forumName, locationList);

          if (index !== -1) {
            setCenter({
              lat: parseFloat(locationList[index].Latitude),
              lng: parseFloat(locationList[index].Longitute),
            });

            setCurrentLocationID(locationList[index].LocationID);
            return;
          }
        }

        const defaultIndex = getIndex("Oakland University", locationList);

        if (defaultIndex !== -1) {
          setCenter({
            lat: parseFloat(locationList[defaultIndex].Latitude),
            lng: parseFloat(locationList[defaultIndex].Longitute),
          });

          setCurrentLocationID(locationList[defaultIndex].LocationID);
        }
      })
      .catch((error) => console.error(error));
  }, [forumData]);

  useEffect(() => {
    loadPins();
  }, [currentLocationID]);

  const updateMap = (locationName) => {
    const index = getIndex(locationName, locations);

    if (index !== -1) {
      setCenter({
        lat: parseFloat(locations[index].Latitude),
        lng: parseFloat(locations[index].Longitute),
      });

      setCurrentLocationID(locations[index].LocationID);
    }
  };

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

  const handlePlacePin = () => {
    if (!clickedLatLng || !currentLocationID) return;

    const newPin = {
      user_id: 1,
      visibility: "Public",
      longitude: clickedLatLng.lng,
      latitude: clickedLatLng.lat,
      title: "New Pin",
      description: "User placed pin",
      location_id: currentLocationID,
    };

    fetch("http://localhost:5000/userpins", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPin),
    })
      .then((response) => response.json())
      .then(() => {
        loadPins();
        setMenuPosition(null);
        setClickedLatLng(null);
      })
      .catch((error) => console.error(error));
  };

  const handleDeletePin = (pinID) => {
    fetch(`http://localhost:5000/userpins/${pinID}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        loadPins();
      })
      .catch((error) => console.error(error));
  };

  const handleMapClick = () => {
    setMenuPosition(null);
  };

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
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

      {forumData && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 1000,
            background: "white",
            padding: "10px",
            borderRadius: "6px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          Showing forum: {forumData.forumName}
        </div>
      )}

      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={13}
        onRightClick={handleRightClick}
        onClick={handleMapClick}
      >
        {userPins.map((pin) => (
          <Marker
            key={pin.PinID}
            position={{
              lat: parseFloat(pin.Latitude),
              lng: parseFloat(pin.Longitude),
            }}
            onClick={() => handleDeletePin(pin.PinID)}
          />
        ))}
      </GoogleMap>

      <button onClick={() => updateMap("Oakland University")}>Oakland</button>
      <button onClick={() => updateMap("Eiffel Tower")}>Eiffel Tower</button>
      <button onClick={() => updateMap("Mackinac Bridge")}>Mackinac Bridge</button>
    </div>
  );
}