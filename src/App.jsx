import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import logo from "./assets/logo.png";
import "./App.css";

// import pages
import {Navbar} from "./components/Navbar/Navbar.jsx";
import {Home} from "./pages/Home/Home.jsx";
import {Contact} from "./pages/Contact/Contact.jsx";
import {Login} from "./pages/Login/Login.jsx";
import {Register} from "./pages/Register/Register.jsx";
import toast, {Toaster} from 'react-hot-toast';
import {MyErrorBoundary} from "./components/MyErrorBoundary/MyErrorBoundary.jsx";
import {CreateEvents} from "./pages/CreateEvents/CreateEvents.jsx";
import {MyInvitations} from "./pages/MyInvitaions/MyInvitations.jsx";
import axios from "axios";
import {useEffect, useState} from "react";
import {isAuthenticated} from "./auth/auth.js";
import {FillCreatedEvent} from "./components/FillCreatedEvent/FillCreatedEvent.jsx";
import {EventInfo} from "./pages/EventInfo/EventInfo.jsx";

export const App = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [route, setRoute] = useState([]);
    const [events, setEvents] = useState([]);
    const [appLoading, setAppLoading] = useState(false);

    const fetchEvents = async () => {
        const organizerEmail = localStorage.getItem("email");
        const token = localStorage.getItem("token");
        setAppLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/invitations/organizer/${organizerEmail}/events`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setRoute(response.data.data);
                setEvents(response.data.data); // Update the events state
                setAppLoading(false);
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


    useEffect(() => {
        if (isAuthenticated()) {
            fetchEvents();
        }
    }, []);

    return (
        <MyErrorBoundary>
            <div className="app">
                <Router>
                    <Navbar logo={logo}/>
                    <Routes>
                        <Route path="/"
                               element={<Home route={route} setRoute={setRoute}/>}/>
                        <Route
                            path="/events/create-events" element={isAuthenticated() ? <CreateEvents/> : <Login/>}
                        />
                        <Route
                            path="/events/my-invitations" element={isAuthenticated() ? <MyInvitations/> : <Login/>}
                        />
                        <Route path="/contact" element={<Contact/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        
                        {
                            route.map((route) => <Route key={route.id} path={`/events/event/${route.id}`}
                                                        element={<FillCreatedEvent data={route}/>}
                                />
                            )
                        }
                        {
                            route.map((route) => <Route key={route.id} path={`/event-info/${route.id}`}
                                                        element={<EventInfo data={route}/>}
                                />
                            )
                        }
                    </Routes>
                </Router>
                <Toaster/>
            </div>
        </MyErrorBoundary>
    );
};
