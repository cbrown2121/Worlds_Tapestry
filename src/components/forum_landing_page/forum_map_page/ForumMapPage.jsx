import { GoogleMap, Marker, InfoWindow, Polyline, useJsApiLoader } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import userPinIcon from "../../../assets/user_pin.png";

const OAKLAND_CENTER = {
  lat: 42.6804,
  lng: -83.1956,
};

const ForumMapPage = () => {
  const location = useLocation();
  const forumData = location.state || {};

  const [userPins, setUserPins] = useState([]);
  const [roadStatuses, setRoadStatuses] = useState([]);
  const [menuPosition, setMenuPosition] = useState(null);
  const [clickedLatLng, setClickedLatLng] = useState(null);

  const [pinTitle, setPinTitle] = useState("");
  const [pinDescription, setPinDescription] = useState("");
  const [pinVisibility, setPinVisibility] = useState("Public");

  const [currentMapID, setCurrentMapID] = useState(null);
  const [center, setCenter] = useState(OAKLAND_CENTER);
  const [selectedPin, setSelectedPin] = useState(null);
  const [selectedRoadStatus, setSelectedRoadStatus] = useState(null);

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

  useEffect(() => {
    if (!forumData?.forumID) return;

    fetch(`http://localhost:5000/road-status/${forumData.forumID}`)
      .then((response) => response.json())
      .then((data) => {
        setRoadStatuses(data);
      })
      .catch((error) => console.error(error));
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

  const getRoadStyle = (type) => {
    if (type === "closed") {
      return {
        strokeColor: "#d32f2f",
        strokeOpacity: 1,
        strokeWeight: 5,
      };
    }

    return {
      strokeColor: "#f57c00",
      strokeOpacity: 1,
      strokeWeight: 5,
    };
  };

  const getRoadIcon = (type) => {
    if (!window.google) return undefined;

    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillColor: type === "closed" ? "#d32f2f" : "#f57c00",
      fillOpacity: 1,
      strokeColor: "#ffffff",
      strokeWeight: 2,
    };
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

    setSelectedPin(null);
    setSelectedRoadStatus(null);
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
    setSelectedPin(null);
    setSelectedRoadStatus(null);
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

      <div
        style={{
          position: "absolute",
          top: 10,
          right: 70,
          zIndex: 1000,
          background: "white",
          padding: "10px 14px",
          borderRadius: "6px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: "6px" }}>Map Legend</div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px", // spacing between items
            flexWrap: "wrap", // prevents overflow on smaller screens
          }}
        >
          {/* User Pin */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={userPinIcon}
              alt="User Pin"
              style={{
                width: "16px",
                height: "20px",
                marginRight: "6px",
              }}
            />
            <span>User Pin</span>
          </div>

          {/* Road Closed */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "20px",
                height: "4px",
                background: "#d32f2f",
                marginRight: "6px",
              }}
            />
            <span>Closed</span>
          </div>

          {/* Construction */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "20px",
                height: "4px",
                background: "#f57c00",
                marginRight: "6px",
              }}
            />
            <span>Construction</span>
          </div>
        </div>
      </div>

        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={13}
          onRightClick={handleRightClick}
          onClick={handleMapClick}
        >
          {roadStatuses.map((status) => (
            <Polyline
              key={`line-${status.id}`}
              path={status.path}
              options={getRoadStyle(status.type)}
              onClick={() => {
                setSelectedRoadStatus(status);
                setSelectedPin(null);
              }}
            />
          ))}

          {roadStatuses.map((status) => (
            <Marker
              key={`marker-${status.id}`}
              position={status.iconPosition}
              icon={getRoadIcon(status.type)}
              onClick={() => {
                setSelectedRoadStatus(status);
                setSelectedPin(null);
              }}
            />
          ))}

          {userPins.map((pin) => (
            <Marker
              key={pin.PinID}
              position={{
                lat: parseFloat(pin.Latitude),
                lng: parseFloat(pin.Longitude),
              }}
                icon={{
                url: userPinIcon,
                scaledSize: new window.google.maps.Size(30, 40),
              }}
              onClick={() => {
                setSelectedPin(pin);
                setSelectedRoadStatus(null);
              }}
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

          {selectedRoadStatus && (
            <InfoWindow
              position={selectedRoadStatus.iconPosition}
              onCloseClick={() => setSelectedRoadStatus(null)}
            >
              <div style={{ maxWidth: "220px" }}>
                <h3 style={{ margin: "0 0 8px 0" }}>{selectedRoadStatus.title}</h3>
                <p style={{ margin: "0 0 8px 0" }}>{selectedRoadStatus.description}</p>
                <p style={{ margin: 0 }}>
                  Status: {selectedRoadStatus.type}
                </p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </>
  );
};

export default ForumMapPage;