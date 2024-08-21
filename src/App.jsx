import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import logo from "./assets/logo.png";
import "./App.css";

// import pages
import {Navbar} from "./components/Navbar/Navbar.jsx";
import {Home} from "./pages/Home/Home.jsx";
import {Contact} from "./pages/Contact/Contact.jsx";
import {Login} from "./pages/Login/Login.jsx";
import {Register} from "./pages/Register/Register.jsx";
import {toast, ToastContainer} from "react-toastify";
import {MyErrorBoundary} from "./components/MyErrorBoundary/MyErrorBoundary.jsx";
import {CreateEvents} from "./pages/CreateEvents/CreateEvents.jsx";
import {MyInvitations} from "./pages/MyInvitaions/MyInvitations.jsx";
import axios from "axios";
import {useEffect, useState} from "react";
import {isAuthenticated} from "./auth/auth.js";
import {FillCreatedEvent} from "./components/FillCreatedEvent/FillCreatedEvent.jsx";

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
    //
    // const handleDelete = async (eventId) => {
    //     const token = localStorage.getItem("token");
    //     try {
    //         const response = await axios.delete(`${apiUrl}/invitations/invitation/${eventId}`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    //
    //         if (response.data.success) {
    //             toast.success("Event deleted successfully.", {
    //                 position: "bottom-right",
    //                 autoClose: 3000,
    //                 hideProgressBar: false,
    //                 closeOnClick: true,
    //                 pauseOnHover: true,
    //                 draggable: true,
    //                 progress: undefined,
    //             });
    //             // Remove the deleted event from the events state
    //             setEvents(events.filter(event => event.id !== eventId));
    //         } else {
    //             toast.error("Failed to delete event: " + response.data.message, {
    //                 position: "bottom-right",
    //                 autoClose: 3000,
    //                 hideProgressBar: false,
    //                 closeOnClick: true,
    //                 pauseOnHover: true,
    //                 draggable: true,
    //                 progress: undefined,
    //             });
    //         }
    //     } catch (error) {
    //         console.error("Error deleting event:", error);
    //         toast.error("An error occurred while deleting the event. Please try again.", {
    //             position: "bottom-right",
    //             autoClose: 3000,
    //             hideProgressBar: false,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //         });
    //     }
    // };

    useEffect(() => {
        if (isAuthenticated()) {
            fetchEvents();
        }
    }, [events]);

    return (
        <MyErrorBoundary>
            <div className="app">
                <Router>
                    <Navbar logo={logo}/>
                    <Routes>
                        <Route path="/"
                               element={<Home events={events} appLoading={appLoading} setAppLoading={setAppLoading}
                               />}/>
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
                    </Routes>
                </Router>
                <ToastContainer/>
            </div>
        </MyErrorBoundary>
    );
};
