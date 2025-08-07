import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../assets/images/logo.png";

import "../styles/landingPage.css";

const logsign_url = process.env.REACT_APP_LOGSIGN_URL || "http://localhost:5000";

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(null); // null = loading

  // Check auth status on mount
useEffect(() => {
  axios
    .get(`${logsign_url}/auth/check`, { withCredentials: true })
    .then((res) => {
      setLoggedIn(true);
    })
    .catch((err) => {
      const status = err?.response?.status;

      if (status === 401) {
        // Expected: user is not logged in
        setLoggedIn(false);
      } else {
        // Unexpected: log it properly
        console.error("Auth check failed:", err);
        setLoggedIn(false); // fallback
      }
    });
}, []);


  

  const handleLogin = () => {
    window.location.href = `${logsign_url}/auth/google`;
  };

  const handleLogout = () => {
    axios.post(`${logsign_url}/auth/logout`, {}, { withCredentials: true })
      .then(() => setLoggedIn(false))
      .catch((err) => console.error("Logout failed:", err));
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <img src={logo} alt="Objective Mail Logo" className="navbar-logo" />
        </div>
        <div className="navbar-right">
          <a href="#features" className="nav-link">Features</a>
          <a href="#guide" className="nav-link">Guide</a>
          <a href="#api" className="nav-link">API</a>
          <a href="#pricing" className="nav-link">Pricing</a>

          {loggedIn === null ? (
            <span className="nav-link">Checking...</span>
          ) : loggedIn ? (
            <button className="login-btn" onClick={handleLogout}>Logout</button>
          ) : (
            <button className="login-btn" onClick={handleLogin}>Login</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
