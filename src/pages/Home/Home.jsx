import {useState, useEffect} from 'react';
import video from '../../assets/backgroundVideo.mp4';
import './home.css';
import {Login} from "../Login/Login";
import {isAuthenticated} from "../../auth/auth";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import {Loader} from "../../components/Loader/Loader.jsx";
import {Link, useNavigate} from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

export const Home = () => {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(isAuthenticated());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    // console.log(events)

    // Function to fetch events
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
        // console.log(events)

    }, [loggedIn]);

    // const changeRoute = (e) => {
    //     // navigate('events/event/' + e.target.id)
    // }
    return (
        <div className="home-container">
            <div className="video-background">
                <video autoPlay loop muted>
                    <source src={video} type="video/mp4"/>
                    Your browser does not support the video tag.
                </video>
            </div>
            {
                loading ? <Loader/> : <div>
                    {loggedIn ? (
                        <div className="home-content">
                            {
                                loggedIn ?
                                    <span>
                                <h1>Events</h1>
                                <p>This is a simple home page</p>
                            </span> :
                                    <h1>Welcome to the Home Page</h1>
                            }
                            <div className="events-grid">
                                {events.length > 0 ? (
                                    events.reverse().map(event => (
                                        <Link to={`/events/event/${event.id}`} key={event.id}>
                                            <div id={event.id}
                                                 className="event-card">
                                                <h3>{event.eventName}</h3>
                                            </div>
                                        </Link>
                                    ))
                                ) : (

                                    <div className={'no-events'}>
                                        <h3>No events found.</h3>
                                    </div>

                                )}
                            </div>
                        </div>
                    ) : (
                        <Login setLoggedIn={setLoggedIn}/>
                    )}
                </div>
            }
            <ToastContainer/>
        </div>
    );
};
