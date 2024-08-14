import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Navbar.css";

export const Navbar = () => {
  const [click, setClick] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Determine if the screen is mobile size
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 960);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 960);
    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false);
      }
    };

    // Add event listener to detect clicks outside the dropdown
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClick = () => setClick(!click);
  // const closeMobileMenu = () => setClick(false);

  const toggleDropdown = () => {
    if (!isMobile) {
      setDropdown(!dropdown);
    }
  };

  const closeDropdownMenu = () => {
    setClick(false);
    if (!isMobile) {
      setDropdown(false);
    }
  };
  // const closeDropdown = () => {
  //   if (!isMobile) {
  //     setDropdown(false);
  //   }
  // };

  const getNavLinkClass = (path) => {
    return location.pathname === path ? "nav-links active-link" : "nav-links";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeDropdownMenu}>
          <img className="logo" src={logo} alt="event schedule app main logo" />
        </Link>
        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? "fas fa-times" : "fas fa-bars"}></i>
        </div>
        <ul className={click ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <Link
              to="/"
              className={getNavLinkClass("/")}
              onClick={closeDropdownMenu}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/events"
              className={getNavLinkClass("/events")}
              onClick={closeDropdownMenu}
            >
              Events
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/contact"
              className={getNavLinkClass("/contact")}
              onClick={closeDropdownMenu}
            >
              Contact
            </Link>
          </li>
          <li
            className="nav-item"
            onClick={toggleDropdown}
            ref={dropdownRef} // Reference to the dropdown element
          >
            <div className="nav-links">
              Account <i className="fas fa-caret-down" />
            </div>
            {(dropdown || isMobile) && (
              <ul className="dropdown-menu">
                <li>
                  <Link
                    to="/login"
                    className="dropdown-link"
                    onClick={closeDropdownMenu}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="dropdown-link"
                    onClick={closeDropdownMenu}
                  >
                    Register
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="dropdown-link"
                    onClick={closeDropdownMenu}
                  >
                    Logout
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};
