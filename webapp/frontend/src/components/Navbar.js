import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaWater } from 'react-icons/fa';
import { FiMoreVertical } from 'react-icons/fi'; // 3-dots icon
import ProfileDropdown from './ProfileDropdown';
import logo from '../images/logo_low_quality2.png';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="nav-left">
          <NavLink to="/" className="nav-logo">
            <img src={logo} alt="FloodWatch" className="nav-logo-img" />
          </NavLink>
        </div>

        {/* Desktop nav */}
        <div className="nav-right desktop-only">
          <NavLink to="/resources" className="nav-link">RESOURCES</NavLink>
          <NavLink to="/aboutus" className="nav-link">ABOUT US</NavLink>
          <ProfileDropdown />
        </div>

        {/* Mobile menu icon */}
        <div className="mobile-menu-icon mobile-only" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <FiMoreVertical size={24} />
        </div>

        {/* Mobile dropdown menu */}
        {isMobileMenuOpen && (
          <div className="mobile-dropdown">
            <NavLink to="/resources" className="dropdown-link" onClick={() => setIsMobileMenuOpen(false)}>RESOURCES</NavLink>
            <NavLink to="/aboutus" className="dropdown-link" onClick={() => setIsMobileMenuOpen(false)}>ABOUT US</NavLink>
            <ProfileDropdown />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
