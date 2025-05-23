// src/components/LoginButton.js
import React from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const LoginButton = () => {
  const handleLogin = async () => {
    try {
      // Replace these with your login form values
      const email = 'user@example.com';
      const password = 'yourPassword';
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in:', userCredential.user);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return <button onClick={handleLogin}>Login</button>;
};

export default LoginButton;