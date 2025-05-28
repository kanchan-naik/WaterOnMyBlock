/**
 * TourPopup.js
 * -------------
 * A modal popup that plays an embedded YouTube video to guide new users
 * through the features of the WaterOnMyBlock application.
 *
 * Triggered from the WelcomePopup component when "Take a Tour" is clicked.
 * Includes a "Return to Map" button that closes the popup.
 *
 */

import React, { useState } from "react";
import "../styles/WelcomePopup.css";

const TourPopup = ({ onClose }) => {
    return (
        <div
            style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1002,
                background: "#FFFFFF",
                borderRadius: "25px",
                width: "25rem",
                height: "23rem",
                padding: "0rem 1.5rem",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                alignItems: "center",
                overflowY: "auto",
                boxSizing: "border-box"
            }}
        >
            <h2
                style={{
                    fontSize: "1.5rem",
                    fontWeight: "normal",
                    textTransform: "uppercase",
                    marginBottom: "0 rem",
                }}
            >
                Take the Tour
            </h2>

            <p
                style={{
                    fontSize: "1rem",
                    fontWeight: "lighter",
                    margin: "0 0 0rem",
                }}
            >
                Watch this short video to familiarize yourself with our features.
            </p>

            <div
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "480px",
                    paddingBottom: "40.5%",
                    height: 0,
                    margin: "0 rem auto"
                }}
            >
                <iframe
                    src="https://www.youtube.com/watch?v=NR6WeMcZVbY"
                    title="Tour Video"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "80%",
                        borderRadius: "12px",
                        border: "none"
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>

            <button
                className="welcome-button"
                onClick={onClose}
                style={{
                    border: "black 1px solid",
                    borderRadius: "25px",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    width: "90%",
                    height: "2.5rem",
                    marginTop: "0 rem",
                }}
            >
                <span style={{ fontSize: "0.75rem" }}>RETURN TO MAP</span>
            </button>

            
        </div>
    );
};

export default TourPopup;