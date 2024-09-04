import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import "./myInvitations.css";
import {Loader} from "../../components/Loader/Loader.jsx";
import {Link, Route} from "react-router-dom";
import {GreetingBoard} from "../../components/GreetingBoard/GreetingBoard.jsx";

export const MyInvitations = () => {
    const [events, setEvents] = useState([]);
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef(null);
    const [eventId, setEventId] = useState(null);


    useEffect(() => {
        setLoading(true);
        const fetchEvents = async () => {
            try {
                const response = await axios.get(apiUrl + `/guests/account/${email}/events`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.success) {
                    // const sortedEvents = response.data.data.sort(
                    //     (a, b) => new Date(a.eventStartTime) - new Date(b.eventStartTime)
                    // );
                    setEvents(response.data.data);

                    setLoading(false);
                } else {
                    console.error("Failed to fetch events:", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, [email]);

    const handlePopupOpen = (eventId) => {
        setShowPopup(true);
        setEventId(eventId)
    };

    const handlePopupClose = () => {
        setShowPopup(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                handlePopupClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const handleResponse = async (url) => {
        try {
            await axios.get(url);
            window.location.reload(); // Refresh the page after the request is made
        } catch (error) {
            console.error("Error sending response:", error);
        }
    };
    if (loading) <Loader/>

    return (
        <>
            {loading ? (
                <Loader/>
            ) : (
                <div className={events.length > 0 ? 'my-invitations-container' : "no-events-container"}>
                    {events.length === 0 ? (
                        <div className="no-events-card">
                            <h3>No Events Found</h3>
                            <p>There are no events to display.</p>
                        </div>
                    ) : (
                        events.map((event) => (
                            <div key={event.id} className="event-card">
                                <div className="event-header">
                                    <h2 className="event-name">{event.eventName}</h2>
                                    <span className={`event-status ${event.response}`}>
                                        {event.response}
                                    </span>
                                </div>
                                <p><strong>Location:</strong> {event.location}</p>
                                <p><strong>Start:</strong> {new Date(event.eventStartTime).toLocaleString()}</p>
                                <p><strong>End:</strong> {new Date(event.eventEndTime).toLocaleString()}</p>
                                <p><strong>Note:</strong> {event.note}</p>
                                <a href={"mailto:" + event.organizerEmail}>
                                    <strong>Organizer:</strong> {event.organizerName} ({event.organizerEmail})
                                </a>
                                {event.response === "PENDING" ? (
                                    <div className="response-buttons">
                                        <button
                                            className="response-button accept"
                                            onClick={() => handleResponse(event.responseLink + `&response=yes`)}
                                        >
                                            Accept
                                        </button>
                                        <button
                                            className="response-button decline"
                                            onClick={() => handleResponse(event.responseLink + `&response=no`)}
                                        >
                                            Decline
                                        </button>
                                    </div>
                                ) : (
                                    event.response === "ACCEPTED" ? (
                                        <button
                                            className="btn-my-invitations"
                                            onClick={() => handlePopupOpen(event.eventId)} // Add onClick handler
                                        > Open →
                                        </button>
                                    ) : <div className='declined-info'>DECLINED</div>
                                )

                                }

                            </div>
                        ))
                    )}
                </div>
            )}
            {showPopup && (
                <div className="popup-overlay full-screen">
                    <div className="popup-content-invitations" ref={popupRef}>
                        <button className="close-btn" onClick={handlePopupClose}>X</button>
                        <h3>Event Actions</h3>
                        <Link to={'/events/my-invitations/events/sub-events'}>
                            <button className="route-btn">
                                Event Schedule
                            </button>
                        </Link>
                        <button className="route-btn" onClick={() => alert('Media Gallery')}>Media Gallery</button>
                        <Link to={'/events/greeting-board/' + eventId}>
                            <button className="route-btn">
                                Greeting Board
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
};
