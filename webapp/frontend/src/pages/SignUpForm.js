import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { auth, firestore } from "../firebase"; // Firebase auth and firestore import
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore"; // Firestore functions

const SignupForm = () => {
    const navigate = useNavigate();

    // State for the first part of the form (block address, residence, etc.)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        blockAddress: "",
        cityState: "",
        zipcode: "",
        residenceType: "",
        basement: "",
        alleyway: "",
        driveway: "",
        floodingHistory: "",
        floodFrequency: "",
        propertyDamage: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [isHovered, setIsHovered] = useState(false);
    const [errors, setErrors] = useState({});
    const [openDropdown, setOpenDropdown] = useState(null);

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    };

    const toggleDropdown = (name) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredFields = ["firstName", "lastName", "blockAddress", "cityState", "zipcode", "residenceType"];
        const newErrors = {};
        requiredFields.forEach((field) => {
            if (!formData[field]) newErrors[field] = "red";
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            // Create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
            const user = userCredential.user;

            try {
                // Store additional user data in Firestore
                const userRef = doc(firestore, "users", user.uid);
                await setDoc(userRef, {
                    firstName: formData.firstName, 
                    lastName: formData.lastName, 
                    blockAddress: formData.blockAddress, 
                    cityState: formData.cityState, 
                    zipcode: formData.zipcode, 
                    basement: formData.basement, 
                    alleyway: formData.alleyway, 
                    driveway: formData.driveway, 
                    floodingHistory: formData.floodingHistory, 
                    floodFrequency: formData.floodFrequency, 
                    propertyDamage: formData.propertyDamage, 
                    phone: formData.phone,
                    email: formData.email,
                });
            }
            catch (error) {
                console.error("Error during signup for firestore:", error.message);
                alert("Error during signup (firestore). Please try again.");
            }
            console.log("User created and data saved:", user);
            // Navigate to home page after successful signup
            navigate("/", { state: { fromSignup: true } });

        } catch (error) {
            console.error("Error during signup:", error.message);
            alert("Error during signup. Please try again.");
        }
    };

    const customDropdown = (name, placeholder, options) => (
        <div style={{ position: "relative", zIndex: openDropdown === name ? 1000 : "auto" }}>
            <div
                style={{
                    backgroundColor: "#EDEDED",
                    borderTopLeftRadius: "25px",
                    borderTopRightRadius: "25px",
                    borderBottomLeftRadius: openDropdown === name ? "0px" : "25px",
                    borderBottomRightRadius: openDropdown === name ? "0px" : "25px",
                    padding: "1rem",
                    paddingRight: "3rem",
                    marginBottom: openDropdown === name ? "0.5rem" : "1.5rem",
                    cursor: "pointer",
                    border: `2px solid ${errors[name] || "transparent"}`,
                    transition: "all 0.3s ease",
                    position: "relative",
                }}
                onClick={() => toggleDropdown(name)}
            >
                <span style={{ textTransform: "uppercase" }}>
                    {formData[name] || placeholder}
                </span>
                <span
                    style={{
                        position: "absolute",
                        right: "1rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                    }}
                >
                    {openDropdown === name ? <FaCaretUp /> : <FaCaretDown />}
                </span>
            </div>

            <div
                style={{
                    maxHeight: openDropdown === name ? "300px" : "0px",
                    overflow: "hidden",
                    transition: "max-height 0.3s ease",
                    backgroundColor: "#EDEDED",
                    borderBottomLeftRadius: "25px",
                    borderBottomRightRadius: "25px",
                    borderTopLeftRadius: "0px",
                    borderTopRightRadius: "0px",
                    marginTop: "-1rem",
                    padding: openDropdown === name ? "1rem" : "0 1rem",
                    marginBottom: "1.5rem",
                }}
            >
                {options.map((option) => (
                    <div
                        key={option}
                        onClick={() => {
                            handleChange(name, option);
                            setOpenDropdown(null);
                        }}
                        style={{
                            backgroundColor: "white",
                            borderRadius: "25px",
                            padding: "1rem",
                            marginBottom: "0.5rem",
                            textAlign: "center",
                            textTransform: "uppercase",
                            fontWeight: "normal",
                            cursor: "pointer",
                        }}
                    >
                        {option}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div style={containerStyle}>
            <div style={innerContainerStyle}>
                <h2 style={headerStyle}>Tell Us About Your Block</h2>
                <p style={subtextStyle}>
                    <strong>Water On My Block</strong> will never share or sell your data to unauthorized parties.
                </p>

                <form onSubmit={handleSubmit} style={{ width: "100%", textAlign: "left" }}>
                    {/* Personal Info */}
                    <label style={labelStyle}>Your Name</label>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name..."
                        value={formData.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        style={{ ...inputStyle, border: `2px solid ${errors.firstName || "transparent"}` }}
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name..."
                        value={formData.lastName}
                        onChange={(e) => handleChange("lastName", e.target.value)}
                        style={{ ...inputStyle, border: `2px solid ${errors.lastName || "transparent"}` }}
                    />

                    {/* Block Info */}
                    <label style={labelStyle}>Your Block</label>
                    <input
                        type="text"
                        name="blockAddress"
                        placeholder="Block Address..."
                        value={formData.blockAddress}
                        onChange={(e) => handleChange("blockAddress", e.target.value)}
                        style={{ ...inputStyle, border: `2px solid ${errors.blockAddress || "transparent"}` }}
                    />
                    <input
                        type="text"
                        name="cityState"
                        placeholder="City, State..."
                        value={formData.cityState}
                        onChange={(e) => handleChange("cityState", e.target.value)}
                        style={{ ...inputStyle, border: `2px solid ${errors.cityState || "transparent"}` }}
                    />
                    <input
                        type="text"
                        name="zipcode"
                        placeholder="Zipcode..."
                        value={formData.zipcode}
                        onChange={(e) => handleChange("zipcode", e.target.value)}
                        style={{ ...inputStyle, border: `2px solid ${errors.zipcode || "transparent"}` }}
                    />

                    {/* Residence & Flooding Info */}
                    {customDropdown("residenceType", "SELECT YOUR BUILDING TYPE...", ["Apartment", "Condo", "House", "Other..."])}
                    {customDropdown("basement", "DO YOU HAVE A BASEMENT?", ["Yes", "No"])}
                    {customDropdown("alleyway", "DO YOU HAVE AN ALLEYWAY?", ["Yes", "No"])}
                    {customDropdown("driveway", "DO YOU HAVE A GARAGE/DRIVEWAY?", ["Yes", "No"])}

                    <h3 style={{ ...labelStyle, marginTop: "2rem" }}>Flooding History</h3>
                    {customDropdown("floodingHistory", "HAVE YOU EXPERIENCED FLOODING ON THIS BLOCK IN THE PAST?", ["Yes", "No"])}
                    {customDropdown("floodFrequency", "HOW MANY TIMES HAVE YOU EXPERIENCED FLOODING ON THIS BLOCK IN THE PAST YEAR?", ["1", "2", "3+", "None"])}
                    {customDropdown("propertyDamage", "HOW MANY OF THESE FLOODS HAVE LED TO PROPERTY DAMAGE OR LOSS?", ["Yes", "No"])}

                    {/* Contact Info */}
                    <label style={labelStyle}>Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        placeholder="(123)-456-7890..."
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        style={{ ...inputStyle }}
                        required
                    />

                    <label style={labelStyle}>Your Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="email@email.com..."
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        style={{ ...inputStyle }}
                        required
                    />

                    <label style={labelStyle}>Your Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password..."
                        value={formData.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        style={{ ...inputStyle }}
                        required
                    />

                    <label style={labelStyle}>Confirm Your Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Password Confirmation..."
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange("confirmPassword", e.target.value)}
                        style={{ ...inputStyle }}
                        required
                    />

                    <button
                        type="submit"
                        style={{
                            ...buttonStyle,
                            backgroundColor: isHovered ? "black" : "white",
                            color: isHovered ? "white" : "black",
                            border: "1px solid black",
                        }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        SIGN UP
                    </button>
                </form>
            </div>
        </div>
    );
};

// Styles for both components

const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    minHeight: "100vh",
    padding: "2rem",
    background: "#FFFFFF",
    overflowY: "auto",
    boxSizing: "border-box",
};

const innerContainerStyle = {
    width: "90%",
    maxWidth: "500px",
    textAlign: "center",
};

const headerStyle = {
    fontSize: "2rem",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: "3rem",
    lineHeight: "3rem",
    letterSpacing: ".25rem",
};

const subtextStyle = {
    fontSize: "1rem",
    fontWeight: "lighter",
    marginBottom: "3rem",
    lineHeight: "2rem",
};

const inputStyle = {
    width: "100%",
    padding: "1rem",
    borderRadius: "25px",
    border: "1px solid transparent",
    backgroundColor: "#EDEDED",
    fontSize: "1rem",
    marginBottom: "1.5rem",
    outline: "none",
    textAlign: "start",
    boxSizing: "border-box",
};

const labelStyle = {
    textTransform: "uppercase",
    fontSize: "1rem",
    marginBottom: "1rem",
    marginTop: "1rem",
    display: "block",
    letterSpacing: ".05rem",
    fontWeight: "bold",
};

const buttonStyle = {
    width: "100%",
    padding: "1rem",
    fontSize: "1rem",
    borderRadius: "25px",
    border: "1px solid black",
    background: "white",
    cursor: "pointer",
    transition: "background 0.3s ease",
    marginTop: "1.5rem",
};

const finishTextStyle = {
    fontSize: "1rem",
    textAlign: "center",
    marginBottom: "2rem",
};

const formWrapper = {
    width: "100%",
    maxWidth: "500px",
};

const titleStyle = {
    fontSize: "2rem",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: "2rem",
};

const subtitleStyle = {
    fontSize: "1rem",
    fontWeight: "lighter",
    marginBottom: "3rem",
    lineHeight: "2rem",
    textAlign: "left",
};

const inputStyleFinal = {
    width: "100%",
    padding: "1rem",
    borderRadius: "50px",
    border: "none",
    backgroundColor: "#EDEDED",
    fontSize: "1rem",
    marginBottom: "2rem",
    outline: "none",
    boxSizing: "border-box",
};

const labelStyleFinal = {
    fontSize: "1rem",
    fontWeight: "normal",
    textTransform: "uppercase",
    marginBottom: "0.5rem",
    display: "block",
};

const buttonStyleFinal = {
    width: "100%",
    padding: "1rem",
    fontSize: "1.25rem",
    fontWeight: "bold",
    borderRadius: "50px",
    border: "2px solid black",
    background: "white",
    cursor: "pointer",
    transition: "all 0.3s ease",
};

export default SignupForm;
