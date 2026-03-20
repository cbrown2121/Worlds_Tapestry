import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const OAKLAND_CENTER = {
  lat: 42.6804,
  lng: -83.1956,
};

const ForumMapPage = () => {
  const location = useLocation();
  const forumData = location.state || {};

  const [userPins, setUserPins] = useState([]);
  const [menuPosition, setMenuPosition] = useState(null);
  const [clickedLatLng, setClickedLatLng] = useState(null);

  const [pinTitle, setPinTitle] = useState("");
  const [pinDescription, setPinDescription] = useState("");
  const [pinVisibility, setPinVisibility] = useState("Public");

  const [currentMapID, setCurrentMapID] = useState(null);
  const [center, setCenter] = useState(OAKLAND_CENTER);
  const [selectedPin, setSelectedPin] = useState(null);

  // Temporary: matches ForumLandingPage until real login is implemented
  const currentUserID = 1;

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  useEffect(() => {
    if (forumData?.latitude && forumData?.longitude) {
      setCenter({
        lat: forumData.latitude,
        lng: forumData.longitude,
      });
    }
  }, [forumData]);

  const getMapForForum = () => {
    if (!forumData?.forumID) return;

    fetch(`http://localhost:5000/maps/forum/${forumData.forumID}`)
      .then((response) => response.json())
      .then((mapData) => {
        console.log("map from backend:", mapData);

        if (mapData && mapData.MapID) {
          setCurrentMapID(mapData.MapID);
        }
      })
      .catch((error) => console.error(error));
  };

  const loadPins = (mapID) => {
    if (!mapID) return;

    fetch(`http://localhost:5000/userpins/map/${mapID}`)
      .then((response) => response.json())
      .then((pinList) => {
        console.log("pins from backend:", pinList);
        setUserPins(pinList);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getMapForForum();
  }, [forumData]);

  useEffect(() => {
    if (currentMapID) {
      loadPins(currentMapID);
    }
  }, [currentMapID]);

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
    if (!clickedLatLng) return;

    if (!currentMapID) {
      alert("No map found for this forum");
      return;
    }

    if (!pinTitle.trim()) {
      alert("Pin must have a title");
      return;
    }

    const newPin = {
      user_id: currentUserID,
      map_id: currentMapID,
      visibility: pinVisibility,
      longitude: clickedLatLng.lng,
      latitude: clickedLatLng.lat,
      title: pinTitle,
      description: pinDescription,
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
        loadPins(currentMapID);
        setPinTitle("");
        setPinDescription("");
        setPinVisibility("Public");
        setMenuPosition(null);
        setClickedLatLng(null);
      })
      .catch((error) => console.error(error));
  };

  const handleDeletePin = (pinID) => {
    fetch(`http://localhost:5000/userpins/${pinID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID: currentUserID }),
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Failed to delete pin");
          return;
        }

        loadPins(currentMapID);
        setSelectedPin(null);
      })
      .catch((error) => console.error(error));
  };

  const handleMapClick = () => {
    setMenuPosition(null);
  };

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <>
      {menuPosition && (
        <div
          style={{
            position: "fixed",
            top: menuPosition.y,
            left: menuPosition.x,
            background: "white",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "6px",
            zIndex: 10000,
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            width: "200px",
          }}
        >
          <input
            type="text"
            placeholder="Title"
            value={pinTitle}
            onChange={(e) => setPinTitle(e.target.value)}
            style={{ width: "100%", marginBottom: "6px" }}
          />

          <textarea
            placeholder="Description"
            value={pinDescription}
            onChange={(e) => setPinDescription(e.target.value)}
            style={{ width: "100%", marginBottom: "6px" }}
          />

          <select
            value={pinVisibility}
            onChange={(e) => setPinVisibility(e.target.value)}
            style={{ width: "100%", marginBottom: "6px" }}
          >
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>

          <button onClick={handlePlacePin} style={{ width: "100%" }}>
            Place Pin
          </button>
        </div>
      )}

      <div
        className="main-content"
        style={{ height: "90vh", width: "100%", position: "relative" }}
      >
        {forumData.forumName && (
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
              onClick={() => setSelectedPin(pin)}
            />
          ))}

          {selectedPin && (
            <InfoWindow
              position={{
                lat: parseFloat(selectedPin.Latitude),
                lng: parseFloat(selectedPin.Longitude),
              }}
              onCloseClick={() => setSelectedPin(null)}
            >
              <div style={{ maxWidth: "220px" }}>
                <h3 style={{ margin: "0 0 8px 0" }}>{selectedPin.Title}</h3>
                <p style={{ margin: "0 0 6px 0" }}>{selectedPin.Description}</p>
                <p style={{ margin: "0 0 10px 0" }}>
                  Created by: {selectedPin.UserName}
                </p>

                {Number(selectedPin.UserID) === Number(currentUserID) && (
                  <button onClick={() => handleDeletePin(selectedPin.PinID)}>
                    Delete Pin
                  </button>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </>
  );
};

export default ForumMapPage;