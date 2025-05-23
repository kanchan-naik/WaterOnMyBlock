// src/components/Logout.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
      navigate("/"); // Redirect to home page after logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="logout-page">
      <h2>You are about to be logged out</h2>
      <button onClick={handleLogout} className="primary-button">
        Logout
      </button>
    </div>
  );
};

export default Logout;
