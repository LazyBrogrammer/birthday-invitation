import React, { useState, useEffect } from 'react';
import video from '../../assets/backgroundVideo.mp4';
import './home.css';
import { Login } from "../Login/Login";
import { isAuthenticated } from "../../auth/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export const Home = () => {
    const [loggedIn, setLoggedIn] = useState(isAuthenticated());
    const [events, setEvents] = useState([]);

    // Function to fetch events
    const fetchEvents = async () => {
        const organizerEmail = localStorage.getItem("email");
        const token = localStorage.getItem("token");

        try {
            const response = await axios.get(`${apiUrl}/invitations/organizer/${organizerEmail}/events`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setEvents(response.data.data);
            } else {
                toast.error("Failed to fetch events: " + response.data.message, {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.error("Error fetching events:", error);
            toast.error("An error occurred while fetching events. Please try again.", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    // Use effect to fetch events when component mounts or loggedIn state changes
    useEffect(() => {
        if (loggedIn) {
            fetchEvents();
        }
    }, [loggedIn]);

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
                    <div className="events-grid">
                        {events.length > 0 ? (
                            events.map(event => (
                                <div key={event.id} className="event-card">
                                    <h3>{event.eventName}</h3>
                                </div>
                            ))
                        ) : (
                            <p>No events available.</p>
                        )}
                    </div>
                </div>
            ) : (
                <Login setLoggedIn={setLoggedIn} />
            )}
            <ToastContainer />
        </div>
    );
};
