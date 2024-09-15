import {useState, useEffect} from "react";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import './fillCreatedEvent.css';

export const FillCreatedEvent = ({data}) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [eventName, setEventName] = useState("");
    const [eventStartTime, setEventStartTime] = useState("");
    const [eventEndTime, setEventEndTime] = useState("");
    const [location, setLocation] = useState("");
    const [note, setNote] = useState("");
    const [instructions, setInstructions] = useState("");
    const organizerEmail = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    const [guests, setGuests] = useState([{email: "", name: "", role: "GUEST"}]);
    const [subEvent, setSubEvent] = useState([{
        partName: "",
        startTime: "",
        endTime: "",
        location: "",
        instruction: "",
        note: ""
    }]);
    const [isComplete, setIsComplete] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [canAddItems, setCanAddItems] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getEvents = async () => {
            try {
                const response = await axios.get(`${apiUrl}/invitations/invitation/${data.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.success) {
                    const fetchedData = response.data.data;
                    setEventName(fetchedData.eventName || "");
                    setEventStartTime(fetchedData.eventStartTime || "");
                    setEventEndTime(fetchedData.eventEndTime || "");
                    setLocation(fetchedData.location || "");
                    setNote(fetchedData.note || "");
                    setInstructions(fetchedData.instructions || "");
                    setGuests(fetchedData.guests || [{email: "", name: "", role: "GUEST"}]);
                    setSubEvent(fetchedData.subEvent || [{
                        partName: "",
                        startTime: "",
                        endTime: "",
                        location: "",
                        instruction: "",
                        note: ""
                    }]);
                } else {
                    toast.error("Failed to fetch event data.", {
                        position: "bottom-right",
                        autoClose: 3000,
                    });
                }
            } catch (error) {
                console.error("Error fetching event data:", error);
                toast.error("An error occurred while fetching event data.", {
                    position: "bottom-right",
                    autoClose: 3000,
                });
            }
        };

        getEvents();
    }, [data.id, apiUrl, token]);

    useEffect(() => {
        const allFieldsFilled =
            eventName &&
            eventStartTime &&
            eventEndTime &&
            location &&
            note &&
            instructions;

        setIsComplete(allFieldsFilled);

        setCanAddItems(allFieldsFilled);
    }, [eventName, eventStartTime, eventEndTime, location, note, instructions]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const guestEmailMatch = guests.some(guest => guest.email === organizerEmail);
        if (guestEmailMatch) {
            toast.error("Organizer email cannot be the same as guest email.", {
                position: "bottom-right",
                autoClose: 3000,
            });
            setIsSubmitting(false);
            return;
        }

        const eventData = {
            eventName,
            eventStartTime,
            eventEndTime,
            location,
            note,
            instructions,
            organizerEmail,
            guests,
            subEvent,
        };

        try {
            const response = await axios.put(`${apiUrl}/invitations/invitation/${data.id}`, eventData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                toast.success("Event created successfully!", {
                    position: "bottom-right",
                    autoClose: 3000,
                });
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                toast.error("Failed to save event.", {
                    position: "bottom-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error("Error saving event:", error);
            toast.error("An error occurred while saving the event.", {
                position: "bottom-right",
                autoClose: 3000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="fill-events-container">
                <div className="events">
                    <h2>{isComplete ? "Create Event" : "Save Event"}</h2>
                    <form className="event-form" onSubmit={handleSubmit}>
                        <div className="event-form_top">
                            <div>
                                <label htmlFor="event-name">Event Name:</label>
                                <input
                                    id="event-name"
                                    type="text"
                                    value={eventName}
                                    onChange={(e) => setEventName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="event-start-time">Start Time:</label>
                                <input
                                    id="event-start-time"
                                    type="datetime-local"
                                    value={eventStartTime}
                                    onChange={(e) => setEventStartTime(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="event-end-time">End Time:</label>
                                <input
                                    id="event-end-time"
                                    type="datetime-local"
                                    value={eventEndTime}
                                    onChange={(e) => setEventEndTime(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="event-form_middle">
                            <div>
                                <label htmlFor="location">Location:</label>
                                <input
                                    id="location"
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="note">Note:</label>
                                <textarea
                                    id="note"
                                    rows={5}
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="instructions">Instructions:</label>
                                <textarea
                                    id="instructions"
                                    rows={5}
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                />
                            </div>
                        </div>


                        <button className="create-event" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <span style={{display: "flex"}}><div className="loader"></div>
                                    &nbsp; Create event</span>
                            ) : (
                                isComplete ? "Create Event" : "Save"
                            )}
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer/>
        </>
    );
};
