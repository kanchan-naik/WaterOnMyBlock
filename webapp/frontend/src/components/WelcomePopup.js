/**
 * WelcomePopup.js
 * ----------------
 * A homepage popup that introduces users to the WaterOnMyBlock app.
 * Offers three main actions: "Learn More", "Take a Tour", and "Report a Flood".
 * 
 * - If the user clicks "Learn More", they're redirected to the Resources page.
 * - If they click "Take a Tour", an interactive TourPopup is displayed.
 * - "Report a Flood" checks auth status and either prompts sign-in or opens the form.
 *
 * This component appears on initial load and can be dismissed via the "x" button.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import "../styles/WelcomePopup.css";
import TourPopup from "../components/TourPopup";

const WelcomePopup = ({ onClose, showForm }) => {
  const [isInsClicked, setIsInsClicked] = useState(false);
  const [isReportClicked, setIsReportClicked] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false); // State to track if TourPopup is visible
  const navigate = useNavigate();

  const resources = () => window.open("/resources", "_blank");

  // Toggle TourPopup visibility
  const TakeTheTour = () => {
    setIsTourOpen(true);  // Set the state to true to open the TourPopup
  };

  const handleReportClick = () => {
    setIsReportClicked(!isReportClicked);
    if (!auth.currentUser) {
      navigate("/signin");
    } else {
      onClose();
      showForm(true);
    }
  };

  return (
    <div className="welcome-popup">
      <div className="welcome-popup-content">
        <h2 className="welcome-popup-title">
          Welcome to <br></br><span>Water on My Block</span>
        </h2>
        <p className="welcome-popup-description">
          Where small actions make big impacts.
        </p>
        <div className="welcome-popup-buttons">
          <button
            className="welcome-button"
            onClick={() => {
              setIsInsClicked(!isInsClicked);
              resources();
            }}
          >
            <span>Learn More</span>
          </button>
          <button
            className="welcome-button"
            onClick={TakeTheTour} // Trigger the TakeTheTour function when clicked
          >
            <span style={{ fontSize: "0.75rem" }}>TAKE A TOUR</span>
          </button>
          <button className="welcome-button" onClick={handleReportClick}>
            <span>REPORT A FLOOD</span>
          </button>
        </div>
      </div>
      <button className="close-button" onClick={onClose}>
        <span>x</span>
      </button>

      {/* Conditionally render the TourPopup based on the state */}
      {isTourOpen && <TourPopup onClose={() => setIsTourOpen(false)} />}
    </div>
  );
};

export default WelcomePopup;
