import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {format} from "date-fns";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './events.css'

const apiUrl = import.meta.env.VITE_API_URL;

export const Events = () => {
    const [eventName, setEventName] = useState("");
    const [eventStartTime, setEventStartTime] = useState("");
    const [eventEndTime, setEventEndTime] = useState("");
    const [location, setLocation] = useState("");
    const [note, setNote] = useState("");
    const [instructions, setInstructions] = useState("");
    const organizerEmail = localStorage.getItem("email"); // Organizer email from localStorage
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

    const navigate = useNavigate();

    // Date formatting function
    const formatDateTime = (date) => {
        return format(new Date(date), "dd/MM/yyyy HH:mm");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate if start time is greater than or equal to end time
        if (new Date(eventStartTime) >= new Date(eventEndTime)) {
            toast.error("Start time cannot be greater than or equal to end time.", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        // Validate if organizer email matches any guest email
        const guestEmailMatch = guests.some(guest => guest.email === organizerEmail);
        if (guestEmailMatch) {
            toast.error("Organizer email cannot be the same as guest email.", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        // Prepare event data with formatted dates
        const eventData = {
            eventEndTime: `${formatDateTime(eventEndTime)}`,
            eventName,
            eventStartTime: `${formatDateTime(eventStartTime)}`,
            guests,
            instructions,
            location,
            note,
            organizerEmail,
            subEvent: subEvent.map(sub => ({
                endTime: `${formatDateTime(sub.endTime)}`,
                ...sub,
                startTime: `${formatDateTime(sub.startTime)}`,
            })),
        };

        try {
            console.log(eventData)
            const response = await axios.post(apiUrl + "/invitations/invitation=''", eventData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                toast.success("Event created successfully!", {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                navigate("/events");
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
        <div className="events-container">
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
                        <div>
                            <label htmlFor="event-start-time">Start Time:</label>
                            <input
                                id="event-start-time"
                                type="datetime-local"
                                value={eventStartTime}
                                onChange={(e) => setEventStartTime(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="event-end-time">End Time:</label>
                            <input
                                id="event-end-time"
                                type="datetime-local"
                                value={eventEndTime}
                                onChange={(e) => setEventEndTime(e.target.value)}
                                required
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
                                required
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
                                required
                            />
                        </div>
                    </div>

                    <h3>Guests</h3>
                    <button type="button" className="add-button"
                            onClick={() => setGuests([...guests, {email: "", name: "", role: "GUEST"}])}>
                        Add Guest
                    </button>
                    <div className="guests-container">
                        {guests.map((guest, index) => (
                            <div key={index} className="guest-item">
                                <label htmlFor={`guest-email-${index}`}>Guest Email:</label>
                                <input
                                    id={`guest-email-${index}`}
                                    type="email"
                                    value={guest.email}
                                    onChange={(e) => {
                                        const newGuests = [...guests];
                                        newGuests[index].email = e.target.value;
                                        setGuests(newGuests);
                                    }}
                                    required
                                />
                                <label htmlFor={`guest-name-${index}`}>Guest Name:</label>
                                <input
                                    id={`guest-name-${index}`}
                                    type="text"
                                    value={guest.name}
                                    onChange={(e) => {
                                        const newGuests = [...guests];
                                        newGuests[index].name = e.target.value;
                                        setGuests(newGuests);
                                    }}
                                    required
                                />
                                <label htmlFor={`guest-role-${index}`}>Role:</label>
                                <select
                                    id={`guest-role-${index}`}
                                    value={guest.role}
                                    onChange={(e) => {
                                        const newGuests = [...guests];
                                        newGuests[index].role = e.target.value;
                                        setGuests(newGuests);
                                    }}
                                    required
                                >
                                    <option value="GUEST">GUEST</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                                {guests.length > 1 && (
                                    <button type="button" className="remove-button"
                                            onClick={() => setGuests(guests.filter((_, i) => i !== index))}>
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <h3>Sub-Events</h3>
                    <button type="button" className="add-button" onClick={() => setSubEvent([...subEvent, {
                        partName: "",
                        startTime: "",
                        endTime: "",
                        location: "",
                        instruction: "",
                        note: ""
                    }])}>
                        Add Sub-Event
                    </button>
                    <div className="subevents-container">
                        {subEvent.map((sub, index) => (
                            <div key={index} className="subevent-item">
                                <label htmlFor={`sub-name-${index}`}>Part Name:</label>
                                <input
                                    id={`sub-name-${index}`}
                                    type="text"
                                    value={sub.partName}
                                    onChange={(e) => {
                                        const newSubEvent = [...subEvent];
                                        newSubEvent[index].partName = e.target.value;
                                        setSubEvent(newSubEvent);
                                    }}
                                    required
                                />
                                <label htmlFor={`sub-start-time-${index}`}>Start Time:</label>
                                <input
                                    id={`sub-start-time-${index}`}
                                    type="datetime-local"
                                    value={sub.startTime}
                                    onChange={(e) => {
                                        const newSubEvent = [...subEvent];
                                        newSubEvent[index].startTime = e.target.value;
                                        setSubEvent(newSubEvent);
                                    }}
                                    required
                                />
                                <label htmlFor={`sub-end-time-${index}`}>End Time:</label>
                                <input
                                    id={`sub-end-time-${index}`}
                                    type="datetime-local"
                                    value={sub.endTime}
                                    onChange={(e) => {
                                        const newSubEvent = [...subEvent];
                                        newSubEvent[index].endTime = e.target.value;
                                        setSubEvent(newSubEvent);
                                    }}
                                    required
                                />
                                <label htmlFor={`sub-location-${index}`}>Location:</label>
                                <input
                                    id={`sub-location-${index}`}
                                    type="text"
                                    value={sub.location}
                                    onChange={(e) => {
                                        const newSubEvent = [...subEvent];
                                        newSubEvent[index].location = e.target.value;
                                        setSubEvent(newSubEvent);
                                    }}
                                    required
                                />
                                <label htmlFor={`sub-instruction-${index}`}>Instruction:</label>
                                <textarea
                                    id={`sub-instruction-${index}`}
                                    rows={3}
                                    value={sub.instruction}
                                    onChange={(e) => {
                                        const newSubEvent = [...subEvent];
                                        newSubEvent[index].instruction = e.target.value;
                                        setSubEvent(newSubEvent);
                                    }}
                                />
                                <label htmlFor={`sub-note-${index}`}>Note:</label>
                                <textarea
                                    id={`sub-note-${index}`}
                                    rows={3}
                                    value={sub.note}
                                    onChange={(e) => {
                                        const newSubEvent = [...subEvent];
                                        newSubEvent[index].note = e.target.value;
                                        setSubEvent(newSubEvent);
                                    }}
                                />
                                {subEvent.length > 1 && (
                                    <button type="button" className="remove-button"
                                            onClick={() => setSubEvent(subEvent.filter((_, i) => i !== index))}>
                                        Remove Sub-Event
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <button className="create-event" type="submit">Create Event</button>
                </form>
                <ToastContainer/>
            </div>
        </div>
    );
};
