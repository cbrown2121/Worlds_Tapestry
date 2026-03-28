import { GoogleMap, Marker, InfoWindow, Polyline, useJsApiLoader } from "@react-google-maps/api";
import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { UserContext } from "../../../contexts/Context.jsx";
import userPinIcon from "../../../assets/user_pin.png";

const OAKLAND_CENTER = {
  lat: 42.6804,
  lng: -83.1956,
};

const ForumMapPage = () => {
  const location = useLocation();
  const forumData = location.state || {};
  const { user } = useContext(UserContext);

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

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editVisibility, setEditVisibility] = useState("Public");

  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);

  const [rating, setRating] = useState("");
  const [reviewText, setReviewText] = useState("");

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
        setUserPins(Array.isArray(pinList) ? pinList : []);
      })
      .catch((error) => console.error(error));
  };

  const loadReviews = (locationID) => {
    fetch(`http://localhost:5000/place-reviews/${locationID}`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error(error));

    fetch(`http://localhost:5000/place-reviews/${locationID}/summary`)
      .then((res) => res.json())
      .then((data) => setSummary(data))
      .catch((error) => console.error(error));
  };

  const handleEditClick = (pin) => {
    setIsEditing(true);
    setEditTitle(pin.Title || "");
    setEditDescription(pin.Description || "");
    setEditVisibility(pin.Visibility || "Public");
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

    if (type === "incident") {
      return {
        strokeColor: "#1976d2",
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

    let fillColor = "#f57c00";

    if (type === "closed") {
      fillColor = "#d32f2f";
    } else if (type === "incident") {
      fillColor = "#1976d2";
    }

    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillColor,
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
    if (!user) {
      alert("No logged in user found");
      return;
    }

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
      user_id: user.UserID,
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
    if (!user) {
      alert("No logged in user found");
      return;
    }

    fetch(`http://localhost:5000/userpins/${pinID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID: user.UserID }),
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

  const handleUpdatePin = () => {
    if (!user) {
      alert("No logged in user found");
      return;
    }

    if (!selectedPin) return;

    fetch(`http://localhost:5000/userpins/${selectedPin.PinID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: user.UserID,
        title: editTitle,
        description: editDescription,
        visibility: editVisibility,
      }),
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Failed to update pin");
          return;
        }

        loadPins(currentMapID);
        setIsEditing(false);
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
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
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

            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "20px",
                  height: "4px",
                  background: "#1976d2",
                  marginRight: "6px",
                }}
              />
              <span>Incident</span>
            </div>

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
                setReviews([]);
                setSummary(null);
                loadReviews(pin.LocationID);
              }}
            />
          ))}

          {selectedPin && (
            <InfoWindow
              position={{
                lat: parseFloat(selectedPin.Latitude),
                lng: parseFloat(selectedPin.Longitude),
              }}
              onCloseClick={() => {
                setSelectedPin(null);
                setIsEditing(false);
              }}
            >
              <div style={{ maxWidth: "220px" }}>
                {!isEditing ? (
                  <>
                    <h3 style={{ margin: "0 0 8px 0" }}>{selectedPin.Title}</h3>
                    <p style={{ margin: "0 0 6px 0" }}>{selectedPin.Description}</p>
                    <p style={{ margin: "0 0 10px 0" }}>
                      Created by: {selectedPin.UserName}
                    </p>

                    {summary && (
                      <p style={{ margin: "0 0 6px 0" }}>
                        ⭐ {summary.avg || 0} ({summary.count} reviews)
                      </p>
                    )}

                    <div style={{ marginTop: "6px" }}>
                      <strong>Reviews:</strong>

                      {reviews.length > 0 ? (
                        <ul style={{ paddingLeft: "16px" }}>
                          {reviews.slice(0, 3).map((r) => (
                            <li key={r.ReviewID}>
                              <strong>{r.UserName}</strong> {"⭐".repeat(r.Rating)}
                              <br />
                              {r.ReviewText}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No reviews yet</p>
                      )}
                    </div>

                    <div style={{ marginTop: "8px" }}>
                      <select
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        style={{ width: "100%", marginBottom: "4px" }}
                      >
                        <option value="">Rating</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>

                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write review"
                        style={{ width: "100%", marginBottom: "4px" }}
                      />

                      <button
                        onClick={() => {
                          if (!rating) {
                            alert("Please select a rating");
                            return;
                          }

                          fetch("http://localhost:5000/place-reviews", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              LocationID: selectedPin.LocationID,
                              UserID: user.UserID,
                              Rating: Number(rating),
                              ReviewText: reviewText,
                            }),
                          })
                            .then(() => {
                              loadReviews(selectedPin.LocationID);
                              setRating("");
                              setReviewText("");
                            })
                            .catch((error) => console.error(error));
                        }}
                        style={{ width: "100%" }}
                      >
                        Submit Review
                      </button>
                    </div>

                    {Number(selectedPin.UserID) === Number(user.UserID) && (
                      <>
                        <button
                          onClick={() => handleEditClick(selectedPin)}
                          style={{ display: "block", marginBottom: "6px", width: "100%" }}
                        >
                          Edit Pin
                        </button>

                        <button
                          onClick={() => handleDeletePin(selectedPin.PinID)}
                          style={{ width: "100%" }}
                        >
                          Delete Pin
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Title"
                      style={{ width: "100%", marginBottom: "6px" }}
                    />

                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Description"
                      style={{ width: "100%", marginBottom: "6px" }}
                    />

                    <select
                      value={editVisibility}
                      onChange={(e) => setEditVisibility(e.target.value)}
                      style={{ width: "100%", marginBottom: "6px" }}
                    >
                      <option value="Public">Public</option>
                      <option value="Private">Private</option>
                    </select>

                    <button
                      onClick={handleUpdatePin}
                      style={{ width: "100%", marginBottom: "6px" }}
                    >
                      Save Changes
                    </button>

                    <button
                      onClick={() => setIsEditing(false)}
                      style={{ width: "100%" }}
                    >
                      Cancel
                    </button>
                  </>
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
                <p style={{ margin: 0 }}>Status: {selectedRoadStatus.type}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </>
  );
};

export default ForumMapPage;