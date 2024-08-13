import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export const Navbar = () => {
    const [click, setClick] = useState(false);
    const location = useLocation();

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const getNavLinkClass = (path) => {
        return location.pathname === path ? "nav-links active-link" : "nav-links";
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                    <img className="logo" src="/logo.png" alt="event schedule app main logo" />
                </Link>
                <div className="menu-icon" onClick={handleClick}>
                    <i className={click ? "fas fa-times" : "fas fa-bars"}></i>
                </div>
                <ul className={click ? "nav-menu active" : "nav-menu"}>
                    <li className="nav-item">
                        <Link
                            to="/"
                            className={getNavLinkClass("/")}
                            onClick={closeMobileMenu}
                        >
                            Home
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            to="/events"
                            className={getNavLinkClass("/events")}
                            onClick={closeMobileMenu}
                        >
                            Events
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            to="/contact"
                            className={getNavLinkClass("/contact")}
                            onClick={closeMobileMenu}
                        >
                            Contact
                        </Link>
                    </li>
                    <li className="nav-item login">
                        <Link
                            to="/login"
                            className={getNavLinkClass("/login")}
                            onClick={closeMobileMenu}
                        >
                            Login
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};