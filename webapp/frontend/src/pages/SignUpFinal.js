import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../firebase"; // Firebase auth and firestore import
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore"; // Firestore functions

const SignupFinal = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
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

            // Update user profile (optional, you can update name or photoURL here)
            await user.updateProfile({
                displayName: formData.phone,
            });

            // Store additional user data in Firestore
            const userRef = doc(firestore, "users", user.uid);
            await setDoc(userRef, {
                phone: formData.phone,
                email: formData.email,
            });

            console.log("User created and data saved:", user);

            // Navigate to home page after successful signup
            navigate("/", { state: { fromSignup: true } });

        } catch (error) {
            console.error("Error during signup:", error.message);
            alert("Error during signup. Please try again.");
        }
    };

    return (
        <div style={containerStyle}>
            <div style={formWrapper}>
                <h2 style={titleStyle}>Contact Information</h2>
                <p style={subtitleStyle}>
                    <strong>Water On My Block</strong> will never share or sell your data to unauthorized parties.
                </p>

                <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                    <label style={labelStyle}>Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        placeholder="(123)-456-7890..."
                        value={formData.phone}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />

                    <label style={labelStyle}>Your Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="email@email.com..."
                        value={formData.email}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />

                    <label style={labelStyle}>Your Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password..."
                        value={formData.password}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />

                    <label style={labelStyle}>Confirm Your Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Password Confirmation..."
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />

                    <p style={finishTextStyle}>And that’s it! Join the block!</p>

                    <button
                        type="submit"
                        style={buttonStyle}
                        onMouseEnter={(e) => {
                            e.target.style.background = "black";
                            e.target.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = "white";
                            e.target.style.color = "black";
                        }}
                    >
                        SIGN UP
                    </button>
                </form>
            </div>
        </div>
    );
};

// Styles
const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
    background: "#FFFFFF",
    minHeight: "100vh",
    boxSizing: "border-box",
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

const inputStyle = {
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

const labelStyle = {
    fontSize: "1rem",
    fontWeight: "normal",
    textTransform: "uppercase",
    marginBottom: "0.5rem",
    display: "block",
};

const buttonStyle = {
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

const finishTextStyle = {
    fontSize: "1rem",
    textAlign: "center",
    marginBottom: "2rem",
};

export default SignupFinal;
