import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ForumMapPage = () => {
    const location = useLocation();
    const forumData = location.state;
    const [locations, setLocations] = useState([]);
    const [userPins, setUserPins] = useState([]);
    const [menuPosition, setMenuPosition] = useState(null);
    const [clickedLatLng, setClickedLatLng] = useState(null);
    const [currentLocationID, setCurrentLocationID] = useState(null);

    const [center, setCenter] = useState({
        lat: 0,
        lng: 0,
    });

    useEffect(() => {
        fetch(`http://localhost:5000/maps/${forumData.forumID}`)
        .then((response) => response.json())
        .then((forumData) => {
            if (forumData.length == 1) {
                setCenter({lat: forumData[0].Latitude, lng: forumData[0].Longitude});
            }
    })});

    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    });

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
        </div>
    );
}

export default ForumMapPage;