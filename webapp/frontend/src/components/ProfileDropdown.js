// src/components/ProfileDropdown.js
import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import '../styles/ProfileDropdown.css';


const ProfileDropdown = () => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setOpen((prev) => !prev);
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle user logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully.");
      setOpen(false);
      navigate("/signin"); // Adjust your redirect path as needed
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <div onClick={toggleDropdown} className="profile-icon">
        <FaUserCircle size={24} />
      </div>
      {open && (
        <div className="dropdown-menu">
          {user ? (
            <div className="user-info">
              <p>{user.displayName || user.email}</p>
              <button onClick={handleLogout} className="dropdown-button">
                Logout
              </button>
            </div>
          ) : (
            <div className="user-info">
              <p>Please sign in</p>
              <button
                onClick={() => navigate("/signin")}
                className="dropdown-button">
                Sign In
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
