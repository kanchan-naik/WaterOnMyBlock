import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import SignupForm from "./SignUpForm";  // Import SignupForm

const Login = () => {
  const [activeForm, setActiveForm] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // Only used for signup
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null); // Clear previous errors
    try {
      if (activeForm === "login") {
        // Login with email and password
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("Logged in:", userCredential.user);
      } else {
        // Signup with email and password
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("Signed up:", userCredential.user);
        // Optionally update the user profile with the username here
      }
      // Redirect to the map page upon successful authentication
      navigate("/");
    } catch (error) {
      console.error("Authentication error:", error);
      // Update error message to show feedback to the user
      setErrorMessage("Invalid credentials, please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign in successful:", result.user);
      navigate("/");
    } catch (error) {
      console.error("Google sign in error:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="form-container">
        <h2>{activeForm === "login" ? "Back On My Block" : "Join Us Now"}</h2>

        {/* Conditional Rendering of SignupForm when activeForm is "signup" */}
        {activeForm === "signup" ? (
          <SignupForm />
        ) : (
          <form className="form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={errorMessage ? "input-error" : ""}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={errorMessage ? "input-error" : ""}
            />
            <button type="submit" className="primary-button">
              {activeForm === "login" ? "Log In" : "Sign Up"}
            </button>
          </form>
        )}

        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="form-toggle">
          <p>
            {activeForm === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <span
              onClick={() => {
                setActiveForm(activeForm === "login" ? "signup" : "login");
                setErrorMessage(null); // Clear error on form switch
              }}
            >
              {activeForm === "login" ? "Sign Up" : "Log In"}
            </span>
          </p>
        </div>
        <div className="google-signin">
          <button onClick={handleGoogleSignIn} className="google-button">
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
