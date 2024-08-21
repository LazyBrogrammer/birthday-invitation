import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './createEvents.css';
import {reload} from "../../utils/reload.js";

const apiUrl = import.meta.env.VITE_API_URL;

export const CreateEvents = () => {
    const [eventName, setEventName] = useState("");
    const organizerEmail = localStorage.getItem("email"); // Organizer email from localStorage
    const token = localStorage.getItem("token");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const eventData = {
            eventName,
            organizerEmail,
        };

        try {
            const response = await axios.post(apiUrl + "/invitations/invitationByName", eventData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                toast.success("Event created successfully!", {
                    position: "bottom-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    onClose: () => navigate("/") // Redirect to home page after toast closes
                });
                // reload();
                setEventName('');
            } else {
                toast.error("Failed to create event: " + response.data.message, {
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
            console.error("Error creating event:", error);
            if (!error.response) {
                toast.error("Server not working. Please try again later.", {
                    position: "bottom-right",
                    autoClose: false,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                toast.error(
                    "An error occurred while creating the event. Please try again.",
                    {
                        position: "bottom-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    }
                );
            }
        }
    };

    return (
        <div className="create-events-container">
            <div className="events">
                <h2>Create an Event</h2>
                <form className="event-form" onSubmit={handleSubmit}>
                    <div className="event-form_top">
                        <div>
                            <label htmlFor="event-name">Event Name:</label>
                            <input
                                id="event-name"
                                type="text"
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button className="create-event" type="submit">Create Event</button>
                </form>
                <ToastContainer/>
            </div>
        </div>
    );
};