import {useState, useEffect, useRef} from 'react';
import './home.css';
import {Login} from "../Login/Login";
import {isAuthenticated} from "../../auth/auth";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import {Loader} from "../../components/Loader/Loader.jsx";
import {Link, useNavigate} from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

export const Home = ({route, setRoute}) => {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(isAuthenticated());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const popupRef = useRef(null);

    const updateRoutes = (data) => {
        setRoute(data);
    };

    const showToastInDisabledBtn = () => {
        toast.info('Please create event fully!', {
            position: "bottom-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    const fetchEvents = async () => {
        const organizerEmail = localStorage.getItem("email");
        const token = localStorage.getItem("token");
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/invitations/organizer/${organizerEmail}/events`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setEvents(response.data.data);
                setLoading(false);
                updateRoutes(response.data.data);

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

    const handleDelete = async (eventId) => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.delete(`${apiUrl}/invitations/invitation/${eventId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                toast.success("Event deleted successfully.", {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setEvents(events.filter(event => event.id !== eventId));
            } else {
                toast.error("Failed to delete event: " + response.data.message, {
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
            console.error("Error deleting event:", error);
            toast.error("An error occurred while deleting the event. Please try again.", {
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

    useEffect(() => {
        if (loggedIn) {
            fetchEvents();
        }
    }, [loggedIn]);

    const handlePopupOpen = (eventId) => {
        setSelectedEventId(eventId);
        setShowPopup(true);
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

    return (
        <div className={events.length > 0 ? 'home-container' : "no-events-container"}>
            {loading ? <Loader/> : (
                <div>
                    {loggedIn ? (
                        <div className="home-content">
                            <div className="events-grid">
                                {events.length > 0 ? (
                                    events.map(event => (
                                        <>
                                            <div key={event.id}>
                                                <div className="event-card">
                                                    <button className="delete-button"
                                                            onClick={() => handleDelete(event.id)}>X
                                                    </button>
                                                    <h3>{event.eventName}</h3>

                                                    <div className='btn-groups'>
                                                        <Link to={`/events/event/${event.id}`}>
                                                            <button className='btn-edit'>
                                                                Edit
                                                            </button>
                                                        </Link>
                                                        <button className='btn-show'
                                                                onClick={() => handlePopupOpen(event.id)}>Open
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            {showPopup && (
                                                <div className="popup-overlay">
                                                    <div className="popup-content" ref={popupRef}>
                                                        <button className="close-button" onClick={handlePopupClose}>X
                                                        </button>
                                                        <h3>Event Actions</h3>
                                                        <Link to={`/event-info/${event.id}`}>
                                                            <button className={'route-btn'}>Event Schedule</button>
                                                        </Link>
                                                        <button className={'route-btn'}
                                                                onClick={() => alert('Action 2')}>Media Gallery
                                                        </button>
                                                        <button className={'route-btn'}
                                                                onClick={() => alert('Action 3')}>Greeting Board
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ))
                                ) : (
                                    <div className="no-events">
                                        <h3>No events found.</h3>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <Login setLoggedIn={setLoggedIn}/>
                    )}
                </div>
            )}

            <ToastContainer/>
        </div>
    );
};
