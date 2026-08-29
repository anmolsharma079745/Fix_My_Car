import React, { useEffect, useState } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";

import logo from "../../assets/images/RideLogo.png";

const Header = ({ theme, toggleTheme }) => {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Invalid user data in localStorage");
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setShowMenu(false);

    navigate("/");
  };

  return (
    <header className="header">

      {/* Logo Section */}

      <div className="logo">

        <img
          src={logo}
          alt="Fix My Ride Logo"
        />

        <h2>
          Fix My Ride
        </h2>

      </div>


      {/* Navigation Section */}

      <nav className="nav">

        <Link to="/">
          Home
        </Link>

        <a href="/#services">
          Services
        </a>

        <a href="/#why-choose-us">
          About
        </a>

        <a href="/#contact">
          Contact
        </a>

      </nav>


      {/* Authentication Buttons */}

      <div className="header-buttons">

        {!user ? (

          <>
            {/* Login */}

            <Link to="/login" className="btn">
              Login
            </Link>


            {/* Register */}

            <Link to="/register" className="btn">
              Register
            </Link>
          </>

        ) : (

          <div className="user-menu">

            <button
              className="user-name-btn"
              onClick={() => setShowMenu(!showMenu)}
            >
              {user.name || "User"} ▼
            </button>


            {showMenu && (

              <div className="user-dropdown">

                <button onClick={handleLogout}>
                  Logout
                </button>

              </div>

            )}

          </div>

        )}


        {/* Theme Toggle */}

        <button
          className="theme-toggle"
          onClick={toggleTheme}
        >
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </button>

      </div>

    </header>
  );
};

export default Header;