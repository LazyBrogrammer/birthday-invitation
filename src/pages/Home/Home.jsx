import React, { useState } from 'react';
import video from '../../assets/backgroundVideo.mp4';
import './home.css';
import { Login } from "../Login/Login";
import { isAuthenticated } from "../../auth/auth";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Home = () => {
    // State to track if the user is logged in
    const [loggedIn, setLoggedIn] = useState(isAuthenticated());

    // Callback function to handle successful login

    return (
        <div className="home">
            <div className="video-background">
                <video autoPlay loop muted>
                    <source src={video} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            {loggedIn ? (
                <div className="home-content">
                    <h1>Welcome to the Home Page</h1>
                    <p>This is a simple home page</p>
                </div>
            ) : (
                <Login setLoggedIn={setLoggedIn} /> // Pass the callback to the Login component
            )}
            <ToastContainer />  {/* ToastContainer here ensures toasts are displayed */}
        </div>
    );
};
