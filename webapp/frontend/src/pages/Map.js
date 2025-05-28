
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import {
  MapContainer,
  TileLayer,
  Circle,
  Popup,
  useMap,
  useMapEvent,
  ZoomControl,
} from "react-leaflet";
import axiosInstance from "../axiosInstance.js";
import AnnotationForm from "../components/AnnotationForm";
import CommunityFeed from "../components/CommunityFeed";
import WelcomePopup from "../components/WelcomePopup";
import "../styles/Map.css";
import "../styles/AnnotationForm.css";
import "leaflet/dist/leaflet.css";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const ChathamChicagoLatLng = {
  lat: parseFloat(process.env.REACT_APP_CHATHAM_LAT),
  lng: parseFloat(process.env.REACT_APP_CHATHAM_LNG),
};

const noise = Math.random() * 0.002; // long-term solution: persist this in the db instead of doing this here.

// Custom hook to get current user
function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, loading };
}

function Map() {
  const autocompleteRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [showAnnotationForm, setShowAnnotationForm] = useState(false);
  const [showCommunityFeed, setShowCommunityFeed] = useState(false);
  const [hoveredFeedId, setHoveredFeedId] = useState(null);
  const [clickedFeedId, setClickedFeedId] = useState(null);
  const [formPosition, setFormPosition] = useState(null);
  const [feedData, setFeedData] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  // New state for annotation popup on mobile
  const [showAnnotationPopup, setShowAnnotationPopup] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);

  // New state for sheet positions
  const [feedSheetState, setFeedSheetState] = useState("minimized"); // minimized, half-screen, full-screen
  const [formSheetState, setFormSheetState] = useState("half-screen"); // minimized, half-screen, full-screen

  const mapRef = useRef();
  const feedRef = useRef(null);
  const formRef = useRef(null);
  const { user: currentUser, loading: loadingUser } = useCurrentUser();
  const [showWelcome, setShowWelcome] = useState(false); // Initialize as false
  let startY = 0;
  let startHeight = 0;

  // Convert Uint8Array to base64
  const convertToBase64 = (imageObj) => {
    if (
      !imageObj ||
      !imageObj.data ||
      !imageObj.data.data ||
      !imageObj.contentType
    ) {
      return null;
    }
    try {
      const uint8Array = new Uint8Array(imageObj.data.data);
      const binaryString = uint8Array.reduce(
        (acc, byte) => acc + String.fromCharCode(byte),
        ""
      );
      return `data:${imageObj.contentType};base64,${btoa(binaryString)}`;
    } catch (error) {
      console.error("Error converting image to base64:", error);
      return null;
    }
  };

  useEffect(() => {
    if (!loadingUser) {
      setShowWelcome(!currentUser);
      if (currentUser) {
        const overlay = document.getElementById("overlay");
        if (overlay) {
          overlay.classList.remove("show");
        }
      }
    }
  }, [loadingUser, currentUser]);

  // Function to initialize the sheet states when component mounts
  useEffect(() => {
    // Initialize community feed to minimized state
    if (feedRef.current) {
      setSheetStateWithoutAnimation(feedRef, "minimized");
    }

    // Initialize form to half-screen state if visible
    if (formRef.current && showAnnotationForm) {
      setSheetStateWithoutAnimation(formRef, "half-screen");
    }
  }, []);

  useEffect(() => {
    if (currentUser && showWelcome) {
      toggleWelcome();
    }
  }, [currentUser]);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768;
      setIsMobile(newIsMobile);

      if (newIsMobile) {
        // Only show community feed if annotation popup is not active
        if (!showAnnotationPopup && !showAnnotationForm) {
          setShowCommunityFeed(true);
          setFeedSheetState("half-screen");
        } else if (showAnnotationPopup) {
          // Ensure annotation popup remains visible
          setShowCommunityFeed(false);
          setFeedSheetState("minimized");
        }
      } else {
        // On desktop, hide mobile-specific elements
        setShowCommunityFeed(false);
        setFeedSheetState("minimized");
        setFormSheetState("half-screen");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, [showAnnotationPopup, showAnnotationForm]);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await axiosInstance.get("/incidents");
        console.log("Response from the GET request:", response.data);

        // Map data into markers format
        const loadedMarkers = response.data
          .map((incident) => ({
            id: incident._id,
            lat: incident.latitude + noise,
            lng: incident.longitude + noise,
            data: incident,
            isSubmitted: true,
          }))
          .filter((marker) => marker.data.floodVisibility !== "Hide");
        setMarkers(loadedMarkers);

        // Map data into feedData format
        const initialFeedData = response.data
          .filter((incident) => incident.floodVisibility !== "Hide")
          .map((incident) => {
            const images = (incident.images || [])
              .map(convertToBase64)
              .filter((img) => img !== null);
            return {
              annotationId: incident._id,
              description: incident.description,
              propertyType: incident.floodLocation,
              floodAddress: incident.floodAddress,
              images:
                (incident.imagePrivacy ?? "Public") === "Public" ? images : [],
              numUpvotes: incident.upvotes || 0,
              timestamp: new Date(incident.createdAt).toLocaleString("en-US", {
                timeZone: "America/Chicago",
              }),
            };
          });
        setFeedData(
          initialFeedData.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          )
        );
      } catch (error) {
        console.error("Error fetching incidents:", error);
      }
    };

    fetchIncidents();
  }, []);

  // Center the map on the hovered or clicked marker
  useEffect(() => {
    const hoveredMarker = markers.find((marker) => marker.id === hoveredFeedId);
    const clickedMarker = markers.find((marker) => marker.id === clickedFeedId);

    if (hoveredFeedId && mapRef.current) {
      if (hoveredMarker) {
        mapRef.current.setView([hoveredMarker.lat, hoveredMarker.lng], 14, {
          animate: true,
          duration: 1,
        });
      }
    } else if (clickedFeedId && mapRef.current) {
      if (clickedMarker) {
        mapRef.current.flyTo([clickedMarker.lat, clickedMarker.lng], 14, {
          animate: true,
          duration: 1,
        });
        console.log("marker clicked");
      }
    }
  }, [hoveredFeedId, clickedFeedId, markers, isMobile]);

  const handleMarkerClick = (markerId, isMobile) => {
    const marker = markers.find((m) => m.id === markerId);
    if (marker && marker.isSubmitted) {
      setSelectedAnnotation(marker.data);
      setShowAnnotationPopup(true);
      setClickedFeedId(markerId);
      if (isMobile) {
        setFeedSheetState("minimized");
        setShowCommunityFeed(false);
        setFormSheetState("half-screen");
      }
    }
  };

  // Updated touch handlers for the sheet behavior
  const handleTouchStart = (e, ref) => {
    startY = e.touches[0].clientY;
    if (ref.current) {
      const height = window.getComputedStyle(ref.current).height;
      startHeight = parseInt(height);
    }
  };

  const handleTouchMove = (e, ref) => {
    if (!ref.current) return;
    e.preventDefault(); // Prevent scrolling while dragging

    const currentY = e.touches[0].clientY;
    const deltaY = startY - currentY; // Positive when dragging up

    let newHeight = startHeight + deltaY;
    newHeight = Math.max(60, Math.min(newHeight, window.innerHeight * 0.5));
    ref.current.style.height = `${newHeight}px`;
  };

  const handleTouchEnd = (e, ref, setSheetState, isForm = false) => {
    if (!ref.current) return;

    const height = parseInt(window.getComputedStyle(ref.current).height);
    const windowHeight = window.innerHeight;

    if (isForm) {
      if (height < windowHeight * 0.4) {
        setSheetState("half-screen");
      } else {
        setSheetState("full-screen");
      }
      return;
    }

    if (height < windowHeight * 0.25) {
      setSheetState("minimized");
    } else if (height < windowHeight * 0.4) {
      setSheetState("half-screen");
    } else {
      setSheetState("full-screen");
    }
  };

  // Function to update sheet state without animation
  const setSheetStateWithoutAnimation = (ref, state) => {
    if (!ref.current) return;

    ref.current.style.transition = "none";

    if (state === "minimized") {
      ref.current.style.height = "60px";
    } else if (state === "half-screen") {
      ref.current.style.height = "50vh";
    } else if (state === "full-screen") {
      ref.current.style.height = "50vh";
    }

    void ref.current.offsetHeight;
    setTimeout(() => {
      ref.current.style.transition = "";
    }, 10);
  };

  function toggleWelcome() {
    setShowWelcome(false);
    const overlay = document.getElementById("overlay");
    overlay.classList.remove("show");
  }

  if (loadingUser) {
    return null;
  }

  function handleToggleFeed() {
    setShowCommunityFeed((data) => !data);
  }

  const handleFeedHover = (annotationId) => {
    setHoveredFeedId(annotationId);
  };

  const handleFeedLeave = () => {
    setHoveredFeedId(null);
  };

  const handleClickedFeed = (annotationId) => {
    setClickedFeedId(annotationId);
    const marker = markers.find((m) => m.id === annotationId);
    if (marker && marker.data) {
      setSelectedAnnotation(marker.data);
      if (isMobile) {
        setShowAnnotationPopup(true);
        setShowCommunityFeed(false);
        setFeedSheetState("minimized");
        setFormSheetState("half-screen");
      }
    }
  };

  const handleBackToFeed = () => {
    setShowAnnotationPopup(false);
    setSelectedAnnotation(null);
    setClickedFeedId(null);
    if (isMobile) {
      setFeedSheetState("half-screen");
      setShowCommunityFeed(true);
      setTimeout(() => {
        if (feedRef.current) {
          feedRef.current.style.display = "block";
          feedRef.current.style.height = "50vh";
        }
      }, 50);
    }
  };

  const handleUpvote = (annotationId, newUpvoteCount) => {
    setFeedData((prevFeedData) =>
      prevFeedData.map((item) =>
        item.annotationId === annotationId
          ? { ...item, numUpvotes: newUpvoteCount }
          : item
      )
    );
  };

  const refreshData = async () => {
    try {
      const response = await axiosInstance.get("/incidents");
      const updatedMarkers = response.data.map((incident) => ({
        id: incident._id,
        lat: incident.latitude,
        lng: incident.longitude,
        data: incident,
        isSubmitted: true,
      }));
      setMarkers(updatedMarkers);

      const updatedFeedData = response.data
        .filter((incident) => incident.floodVisibility !== "Hide")
        .map((incident) => {
          const images = (incident.images || [])
            .map(convertToBase64)
            .filter((img) => img !== null);
          return {
            annotationId: incident._id,
            description: incident.description,
            propertyType: incident.floodLocation,
            floodAddress: incident.floodAddress,
            images:
              (incident.imagePrivacy ?? "Public") === "Public" ? images : [],
            numUpvotes: incident.upvotes || 0,
            timestamp: new Date(incident.createdAt).toLocaleString("en-US", {
              timeZone: "America/Chicago",
            }),
          };
        });

      setFeedData(
        updatedFeedData.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        )
      );
    } catch (error) {
      console.error("Error refreshing data after form submission:", error);
    }
  };

  const removeMarker = (markerId) => {
    setMarkers((prevMarkers) =>
      prevMarkers.filter((marker) => marker.id !== markerId)
    );
  };

  const handleFormClose = () => {
    setShowAnnotationForm(false);
    if (isMobile) {
      setFeedSheetState("half-screen");
      setTimeout(() => {
        if (feedRef.current) {
          feedRef.current.style.display = "block";
          feedRef.current.style.height = "50vh";
        }
      }, 50);
    } else {
      setSelectedMarker(null);
    }
  };

  function FormPositioner({ selectedMarker }) {
    const map = useMap();
    mapRef.current = map;

    const updatePosition = () => {
      if (selectedMarker) {
        const point = map.latLngToContainerPoint(selectedMarker);
        setFormPosition({ x: point.x, y: point.y });
      }
    };

    useEffect(() => {
      map.on("moveend", updatePosition);
      map.on("zoomend", updatePosition);

      return () => {
        map.off("moveend", updatePosition);
        map.off("zoomend", updatePosition);
      };
    }, [selectedMarker, map]);

    return null;
  }

  function ChangeMapView({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
      map.flyTo(center, zoom, {
        duration: 0.85,
        easeLinearity: 0.25,
      });
    }, [center, zoom, map]);
    return null;
  }

  function MapClickHandler() {
    const navigate = useNavigate();

    useMapEvent("click", (event) => {
      if (!currentUser) {
        navigate("/signin");
        return;
      }
      const { lat, lng } = event.latlng;

      const newMarker = { id: Date.now(), lat, lng, data: null };
      setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
      setSelectedMarker(newMarker);
      if (isMobile) {
        setFeedSheetState("minimized");
        setShowCommunityFeed(false);
        setShowAnnotationForm(true);
        setFormSheetState("half-screen");
        setShowAnnotationPopup(false); // Hide annotation popup
        setSelectedAnnotation(null);
        setTimeout(() => {
          if (formRef.current) {
            formRef.current.style.height = "50vh";
          }
          if (feedRef.current) {
            feedRef.current.style.display = "none";
          }
        }, 50);
      }
    });

    return null;
  }

  const handleAnnotationSubmit = async (data) => {
    console.log("Annotation Submitted:", data);
    if (selectedMarker) {
      if (selectedMarker && data.floodVisibility !== "Hide") {
        const formattedEntry = {
          annotationId: data.annotationId,
          images: data.images?.map((image) => image.src) || [],
          numUpvotes: 0,
          timestamp: new Date().toLocaleString("en-US", {
            timeZone: "America/Chicago",
          }),
      };

      // Add new entry to feedData
      setFeedData((prevFeedData) => {
        const updatedFeed = [formattedEntry, ...prevFeedData];
        return updatedFeed.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
      });
    }

      // Refresh the markers and feed data after submission
      await refreshData();

      const { lat, lng } = selectedMarker;
      if (mapRef.current) {
        mapRef.current.flyTo([lat, lng], 15, {
          animate: true,
          duration: 1.2,
        });
      }

      // Update the submitted marker
      setMarkers((prevMarkers) =>
        prevMarkers.map((marker) =>
          marker.id === selectedMarker.id
            ? { ...marker, data, isSubmitted: true }
            : marker
        )
      );

      setSelectedMarker(null);
      setShowAnnotationForm(false);
    }
  };

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.geometry) {
      const location = place.geometry.location;
      const latLng = {
        lat: location.lat(),
        lng: location.lng(),
      };

      setSearchText(place.formatted_address || "");

      const newMarker = {
        id: Date.now(),
        lat: latLng.lat,
        lng: latLng.lng,
        data: null,
      };
      setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
      setSelectedMarker(newMarker);
    }
  };

  const handleClearSearch = () => {
    setSearchText("");
  };

  const getPopupPosition = (point) => {
    const formWidth = 340;
    const formHeight = 400;
    const buffer = 20;
    const verticalOffset = formHeight / 2;

    return {
      left: `${point.x - formWidth - buffer}px`,
      top: `${point.y - verticalOffset}px`,
    };
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#526b5c",
        boxSizing: "border-box",
        height: "100%",
      }}>
      <div
        style={{
          width: "100%",
          height: "-webkit-fill-available",
          border: "none",
          overflow: "hidden",
          position: "relative",
        }}>
        {showWelcome && <div id="overlay" className="overlay show"></div>}

        {showWelcome && (
          <WelcomePopup
            onClose={toggleWelcome}
            showForm={setShowAnnotationForm}
          />
        )}

        <MapContainer
          center={ChathamChicagoLatLng}
          zoom={14}
          style={{ width: "100%", height: "100%" }}
          zoomControl={false}>
          <FormPositioner selectedMarker={selectedMarker} />
          <TileLayer
            url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`}
            attribution='© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> contributors'
          />
          <MapClickHandler />
          {markers.map((marker) => (
            <Circle
              key={marker.id}
              center={[marker.lat, marker.lng]}
              radius={100}
              pathOptions={{
                fillColor:
                  clickedFeedId === marker.id
                    ? "red"
                    : hoveredFeedId === marker.id
                    ? "yellow"
                    : "blue",
                color:
                  clickedFeedId === marker.id
                    ? "red"
                    : hoveredFeedId === marker.id
                    ? "yellow"
                    : "blue",
                weight: 2,
                opacity: 1,
                fillOpacity: 0.4,
              }}
              eventHandlers={{
                click: (e) => {
                  e.originalEvent.stopPropagation(); // prevent map click handler
                  handleMarkerClick(marker.id, isMobile);
                },
              }}>
              {!isMobile && (
                <Popup width="8vw" height="4vw">
                  {marker.data ? (
                    <div style={{ fontSize: "0.9vw", maxWidth: "22vw" }}>
                      {(marker.data.imagePrivacy ?? "Public") === "Public" &&
                        marker.data.images &&
                        marker.data.images.length > 0 && (
                          <div style={{ marginBottom: "0.2vw" }}>
                            <div
                              style={{
                                display: "flex",
                                overflowX: "auto",
                                marginBottom: "1vw",
                                gap: "0.5vw",
                                flexWrap: "nowrap",
                                minHeight: "6vw",
                              }}>
                              {marker.data.images
                                .slice(0, 8)
                                .map((image, index) => {
                                  const base64Image = convertToBase64(image);
                                  return (
                                    base64Image && (
                                      <img
                                        key={index}
                                        src={base64Image}
                                        alt={`Flood image ${index + 1}`}
                                        style={{
                                          width:
                                            marker.data.images.length === 1
                                              ? "100%"
                                              : `calc(100% / ${marker.data.images.length} - 0.1vw)`,
                                          height: "auto",
                                          objectFit: "cover",
                                          borderRadius: "5px",
                                        }}
                                      />
                                    )
                                  );
                                })}
                            </div>
                          </div>
                        )}
                      <h3
                        style={{
                          margin: "0",
                          fontSize: "1.2vw",
                          fontWeight: "bold",
                        }}>
                        {marker.data.floodAddress ||
                          "Flooding Incident Details:"}
                      </h3>
                      <p>
                        <strong>Date of Incident:</strong>{" "}
                        {new Date(
                          marker.data.dateOfIncident
                        ).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Water Depth:</strong>{" "}
                        {marker.data.waterDepth || "Not specified"}
                      </p>
                      <p>
                        <strong>Water Causes:</strong>{" "}
                        {Array.isArray(marker.data.waterCauses) &&
                        marker.data.waterCauses.length > 0
                          ? marker.data.waterCauses.includes("Other")
                            ? `${marker.data.waterCauses
                                .filter((cause) => cause !== "Other")
                                .join(", ")}, ${
                                marker.data.otherFloodCause || "Not specified"
                              }`
                            : marker.data.waterCauses.join(", ")
                          : "Not specified"}
                      </p>
                      <p>
                        <strong>Flood Spread:</strong>{" "}
                        {Array.isArray(marker.data.floodSpread) &&
                        marker.data.floodSpread.length > 0
                          ? marker.data.floodSpread.join(", ")
                          : "Not applicable"}
                      </p>
                      <p>
                        <strong>Water Cleanliness:</strong>{" "}
                        {marker.data.waterCleanliness === "Yes"
                          ? "Clean"
                          : "Unclean/contains sewage"}
                      </p>
                      <p>
                        <strong>Property Type:</strong>{" "}
                        {marker.data.floodLocation || "Not specified"}
                      </p>
                      <p>
                        <strong>Flood Duration:</strong>{" "}
                        {marker.data.floodTimeline || "Not specified"}
                      </p>
                      <p>
                        <strong>Additional details:</strong>{" "}
                        {marker.data.description || "Not specified"}
                      </p>
                      <div
                        style={{
                          marginTop: "0.6vw",
                          fontSize: "0.85vw",
                          color: "#444",
                        }}>
                        <em>
                          This area already has a report. Want to submit your
                          own?
                        </em>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedMarker({
                            id: Date.now(),
                            lat: marker.lat + Math.random() * 0.0001,
                            lng: marker.lng + Math.random() * 0.0001,
                            data: null,
                          });
                          setShowAnnotationForm(true);
                          if (mapRef.current) {
                            mapRef.current.closePopup();
                          }
                        }}
                        style={{
                          marginTop: "0.6vw",
                          backgroundColor: "#9cd1ff",
                          color: "white",
                          border: "none",
                          padding: "0.4vw 0.8vw",
                          borderRadius: "6px",
                          fontSize: "0.9vw",
                          cursor: "pointer",
                          width: "100%",
                        }}>
                        + Add a new report here
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p>No data for this marker.</p>
                      <button
                        onClick={() => {
                          setSelectedMarker(marker);
                          setShowAnnotationForm(true);
                        }}>
                        Add Report
                      </button>
                    </div>
                  )}
                </Popup>
              )}
            </Circle>
          ))}
          {markers.length > 0 && (
            <ChangeMapView
              center={{
                lat: markers[markers.length - 1].lat,
                lng: markers[markers.length - 1].lng,
              }}
              zoom={14}
            />
          )}
          <ZoomControl position="bottomright" />
        </MapContainer>

        <div className="search-bar">
          <LoadScript
            googleMapsApiKey={GOOGLE_MAPS_API_KEY}
            libraries={["places"]}>
            <div className="search-bar-container">
              <Autocomplete
                onLoad={(autocomplete) =>
                  (autocompleteRef.current = autocomplete)
                }
                onPlaceChanged={handlePlaceChanged}>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search your location"
                  className="search-input"
                />
              </Autocomplete>
              {searchText && (
                <button onClick={handleClearSearch} className="clear-search">
                  ×
                </button>
              )}
            </div>
          </LoadScript>
        </div>
        {!isMobile && (
          <div className="community-feed-container-pc">
            <div className="community-dropdown">
              <p>Community Feed</p>
              <button style={{ cursor: "pointer" }} onClick={handleToggleFeed}>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    transform: showCommunityFeed
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.3s",
                  }}>
                  <path
                    d="M6.34164 8.19869C5.78885 9.30426 4.21115 9.30426 3.65836 8.19868L0.894426 2.67082C0.395751 1.67347 1.12099 0.5 2.23607 0.5H7.76393C8.879 0.5 9.60425 1.67347 9.10557 2.67082L6.34164 8.19869Z"
                    fill={showCommunityFeed ? "none" : "black"}
                    stroke="black"
                  />
                </svg>
              </button>
            </div>
            {showCommunityFeed && (
              <CommunityFeed
                feedData={feedData}
                hoveredFeedId={hoveredFeedId}
                onFeedHover={handleFeedHover}
                onFeedLeave={handleFeedLeave}
                onFeedClicked={handleClickedFeed}
                onUpvote={handleUpvote}
              />
            )}
          </div>
        )}
        {isMobile && !showWelcome && (
          <>
            <div
              ref={feedRef}
              className={`mobile-bottom-sheet community-feed-container-mobile ${feedSheetState}`}
              style={{ display: showAnnotationPopup ? "none" : "block" }}>
              <div
                className="sheet-header"
                onTouchStart={(e) => handleTouchStart(e, feedRef)}
                onTouchMove={(e) => handleTouchMove(e, feedRef)}
                onTouchEnd={(e) =>
                  handleTouchEnd(e, feedRef, setFeedSheetState)
                }>
                <div className="drag-handle" />
                <h2>Community Feed</h2>
              </div>
              <div className="sheet-content">
                <CommunityFeed
                  feedData={feedData}
                  hoveredFeedId={hoveredFeedId}
                  onFeedHover={handleFeedHover}
                  onFeedLeave={handleFeedLeave}
                  onFeedClicked={handleClickedFeed}
                  onUpvote={handleUpvote}
                />
              </div>
            </div>

            {showAnnotationPopup && selectedAnnotation && (
              <div
                ref={formRef}
                className={`mobile-bottom-sheet mobile-annotation-popup-container ${formSheetState}`}>
                <div
                  className="sheet-header"
                  onTouchStart={(e) => handleTouchStart(e, formRef)}
                  onTouchMove={(e) => handleTouchMove(e, formRef)}
                  onTouchEnd={(e) =>
                    handleTouchEnd(e, formRef, setFormSheetState, true)
                  }>
                  <div className="drag-handle" />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}>
                    <h2 style={{ textAlign: "center" }}>Flood Details</h2>
                    <button
                      className="cancel-button"
                      onClick={handleBackToFeed}
                      aria-label="Back">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="sheet-content">
                  <div className="annotation-detail-mobile">
                    <h2>
                      {selectedAnnotation.floodLocation} flooding at{" "}
                      {selectedAnnotation.floodAddress}
                    </h2>
                    <p className="timestamp">
                      {new Date(selectedAnnotation.createdAt).toLocaleString(
                        "en-US",
                        {
                          timeZone: "America/Chicago",
                        }
                      )}
                    </p>
                    {(selectedAnnotation.imagePrivacy ?? "Public") ===
                      "Public" &&
                      selectedAnnotation.images &&
                      selectedAnnotation.images.length > 0 && (
                        <div className="image-gallery">
                          {selectedAnnotation.images.map((img, idx) => {
                            const base64Image = convertToBase64(img);
                            return (
                              base64Image && (
                                <img
                                  key={idx}
                                  src={base64Image}
                                  alt={`Flood ${idx + 1}`}
                                  style={{
                                    width: "100%",
                                    maxHeight: "200px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                    marginBottom: "10px",
                                  }}
                                />
                              )
                            );
                          })}
                        </div>
                      )}
                    <div className="details">
                      <p>
                        <strong>Flood Duration:</strong>{" "}
                        {selectedAnnotation.floodTimeline || "Not specified"}
                      </p>
                      <p>
                        <strong>Water Depth:</strong>{" "}
                        {selectedAnnotation.waterDepth || "Not specified"}
                      </p>
                      <p>
                        <strong>Water Cleanliness:</strong>{" "}
                        {selectedAnnotation.waterCleanliness === "Yes"
                          ? "Clean"
                          : "Unclean/contains sewage"}
                      </p>
                      <p>
                        <strong>Upvotes:</strong>{" "}
                        {feedData.find(
                          (item) => item.annotationId === selectedAnnotation._id
                        )?.numUpvotes || 0}
                      </p>
                      <p>
                        <strong>Water Causes:</strong>{" "}
                        {Array.isArray(selectedAnnotation.waterCauses) &&
                        selectedAnnotation.waterCauses.length > 0
                          ? selectedAnnotation.waterCauses.includes("Other")
                            ? `${selectedAnnotation.waterCauses
                                .filter((cause) => cause !== "Other")
                                .join(", ")}, ${
                                selectedAnnotation.otherFloodCause ||
                                "Not specified"
                              }`
                            : selectedAnnotation.waterCauses.join(", ")
                          : "Not specified"}
                      </p>
                      <p>
                        <strong>Flood Spread:</strong>{" "}
                        {Array.isArray(selectedAnnotation.floodSpread) &&
                        selectedAnnotation.floodSpread.length > 0
                          ? selectedAnnotation.floodSpread.join(", ")
                          : "Not applicable"}
                      </p>
                      <p>
                        <strong>Description:</strong>
                        <br />
                        {selectedAnnotation.description ||
                          "No description provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showAnnotationForm && selectedMarker && (
              <div
                ref={formRef}
                className={`mobile-bottom-sheet mobile-annotation-form-container ${formSheetState}`}>
                <div
                  className="sheet-header"
                  onTouchStart={(e) => handleTouchStart(e, formRef)}
                  onTouchMove={(e) => handleTouchMove(e, formRef)}
                  onTouchEnd={(e) =>
                    handleTouchEnd(e, formRef, setFormSheetState, true)
                  }>
                  <button
                    className="cancel-button"
                    onClick={handleFormClose}
                    aria-label="Cancel">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                  <div className="drag-handle" />
                  <h2>Add Annotation</h2>
                </div>
                <div className="sheet-content">
                  <AnnotationForm
                    onSubmit={handleAnnotationSubmit}
                    onClose={handleFormClose}
                    lat={selectedMarker.lat}
                    lng={selectedMarker.lng}
                    isVisible={showAnnotationForm}
                  />
                </div>
              </div>
            )}
          </>
        )}
        {!isMobile && selectedMarker && formPosition && (
          <div
            ref={formRef}
            className={`form-popup ${formSheetState}`}
            onTouchStart={(e) => handleTouchStart(e, formRef)}
            onTouchMove={(e) => handleTouchMove(e, formRef)}
            onTouchEnd={(e) =>
              handleTouchEnd(e, formRef, setFormSheetState, true)
            }
            style={{
              ...getPopupPosition(formPosition),
              position: "fixed",
              zIndex: 1002,
            }}>
            <AnnotationForm
              onSubmit={handleAnnotationSubmit}
              onClose={() => setSelectedMarker(null)}
              lat={selectedMarker.lat}
              lng={selectedMarker.lng}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Map;
