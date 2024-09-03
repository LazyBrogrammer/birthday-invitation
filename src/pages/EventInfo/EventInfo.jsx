import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './eventinfo.css';
import {Loader} from "../../components/Loader/Loader.jsx";

export const EventInfo = ({data}) => {
    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [popupContent, setPopupContent] = useState(null);
    const [showSubEventPopup, setShowSubEventPopup] = useState(false);
    const [showGuestPopup, setShowGuestPopup] = useState(false)

    const email = localStorage.getItem('email');
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');
    const url = `${apiUrl}/invitations/organizer/events?eventId=${data.id}&organizerEmail=${email}`;

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.success) {
                    setEventData(response.data.data);
                } else {
                    setError(response.data.message);
                }
            } catch (error) {
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchEventData();
    }, []);

    const openGuestPopup = () => {
        setShowGuestPopup(true);
    };
    const openSubEventPopup = () => {
        setShowSubEventPopup(true);
    };

    const closeGuestPopup = () => {
        setShowGuestPopup(false);
    };
    const closeSubEventPopup = () => {
        setShowSubEventPopup(false);
    };
    if (loading) return <Loader/>;
    if (error) return <p>{error}</p>;

    return (
        <div className="event-info">
            {eventData && eventData.map(event => (
                <div key={event.id} className="event-card">
                    <h3>{event.eventName}</h3>
                    <p><strong>Start Time:</strong> {new Date(event.eventStartTime).toLocaleString()}</p>
                    <p><strong>End Time:</strong> {new Date(event.eventEndTime).toLocaleString()}</p>
                    <p><strong>Location:</strong> {event.location}</p>
                    <p><strong>Instructions:</strong> {event.instructions}</p>
                    <p><strong>Note:</strong> {event.note}</p>

                    <div className='btn-wrapper'>
                        <h4>Guests:</h4>
                        <button onClick={() => openGuestPopup()}>Add guest</button>
                    </div>
                    <ul>

                        {event.guests.map(guest => (
                            <li key={guest.id}>
                                <p><strong>Name:</strong> {guest.name}</p>
                                <p><strong>Email:</strong> {guest.email}</p>
                                <p><strong>Role:</strong> {guest.role}</p>
                                <p><strong>Response:</strong>
                                    <span className={guest.response}>{guest.response}</span>
                                </p>

                            </li>
                        ))}
                    </ul>

                    <div className='btn-wrapper'>
                        <h4>Sub-Events:</h4>
                        <button onClick={() => openSubEventPopup()}>Add sub event</button>
                    </div>
                    <ul>

                        {event.subEvent.map(sub => (
                            <li key={sub.id}>
                                <p><strong>Sub-Event Name:</strong> {sub.name}</p>
                                <p><strong>Start Time:</strong> {new Date(sub.startTime).toLocaleString()}</p>
                                <p><strong>End Time:</strong> {new Date(sub.endTime).toLocaleString()}</p>
                                <p><strong>Location:</strong> {sub.location}</p>
                                <p><strong>Instruction:</strong> {sub.instruction}</p>
                                <p><strong>Note:</strong> {sub.note}</p>

                            </li>
                        ))}
                    </ul>
                </div>
            ))}
            {
                showGuestPopup && (
                    <div className='popup'>
                        <div className='popup-content'>
                            <h3>Guests</h3>
                            <button type="button" className="add-button" onClick={() => setGuests([...guests, {
                                email: "",
                                name: "",
                                role: "GUEST"
                            }])} disabled={!canAddItems}>
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
                                        >
                                            <option value="GUEST">GUEST</option>
                                            <option value="ADMIN">ADMIN</option>
                                        </select>
                                        {guests.length > 1 && (
                                            <button
                                                type="button"
                                                className="remove-button"
                                                onClick={() => setGuests(guests.filter((_, i) => i !== index))}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            }

            {/**/}

            {showSubEventPopup && (
                <div className="popup">
                    {/*<div className="popup-content">*/}
                    {/*    <button className="close-button" onClick={closePopup}>Close</button>*/}
                    {/*    <h3>Details</h3>*/}
                    {/*    <button type="button" className="add-button" onClick={() => setSubEvent([...subEvent, {*/}
                    {/*        partName: "",*/}
                    {/*        startTime: "",*/}
                    {/*        endTime: "",*/}
                    {/*        location: "",*/}
                    {/*        instruction: "",*/}
                    {/*        note: ""*/}
                    {/*    }])} disabled={!canAddItems}>*/}
                    {/*        Add Sub-Event*/}
                    {/*    </button>*/}
                    {/*    <div className="subevents-container">*/}
                    {/*        {subEvent.map((sub, index) => (*/}
                    {/*            <div key={index} className="subevent-item">*/}
                    {/*                <label htmlFor={`sub-name-${index}`}>Part Name:</label>*/}
                    {/*                <input*/}
                    {/*                    id={`sub-name-${index}`}*/}
                    {/*                    type="text"*/}
                    {/*                    value={sub.partName}*/}
                    {/*                    onChange={(e) => {*/}
                    {/*                        const newSubEvent = [...subEvent];*/}
                    {/*                        newSubEvent[index].partName = e.target.value;*/}
                    {/*                        setSubEvent(newSubEvent);*/}
                    {/*                    }}*/}
                    {/*                />*/}
                    {/*                <label htmlFor={`sub-start-time-${index}`}>Start Time:</label>*/}
                    {/*                <input*/}
                    {/*                    id={`sub-start-time-${index}`}*/}
                    {/*                    type="datetime-local"*/}
                    {/*                    value={sub.startTime}*/}
                    {/*                    onChange={(e) => {*/}
                    {/*                        const newSubEvent = [...subEvent];*/}
                    {/*                        newSubEvent[index].startTime = e.target.value;*/}
                    {/*                        setSubEvent(newSubEvent);*/}
                    {/*                    }}*/}
                    {/*                />*/}
                    {/*                <label htmlFor={`sub-end-time-${index}`}>End Time:</label>*/}
                    {/*                <input*/}
                    {/*                    id={`sub-end-time-${index}`}*/}
                    {/*                    type="datetime-local"*/}
                    {/*                    value={sub.endTime}*/}
                    {/*                    onChange={(e) => {*/}
                    {/*                        const newSubEvent = [...subEvent];*/}
                    {/*                        newSubEvent[index].endTime = e.target.value;*/}
                    {/*                        setSubEvent(newSubEvent);*/}
                    {/*                    }}*/}
                    {/*                />*/}
                    {/*                <label htmlFor={`sub-location-${index}`}>Location:</label>*/}
                    {/*                <input*/}
                    {/*                    id={`sub-location-${index}`}*/}
                    {/*                    type="text"*/}
                    {/*                    value={sub.location}*/}
                    {/*                    onChange={(e) => {*/}
                    {/*                        const newSubEvent = [...subEvent];*/}
                    {/*                        newSubEvent[index].location = e.target.value;*/}
                    {/*                        setSubEvent(newSubEvent);*/}
                    {/*                    }}*/}
                    {/*                />*/}
                    {/*                <label htmlFor={`sub-instruction-${index}`}>Instruction:</label>*/}
                    {/*                <textarea*/}
                    {/*                    id={`sub-instruction-${index}`}*/}
                    {/*                    rows={3}*/}
                    {/*                    value={sub.instruction}*/}
                    {/*                    onChange={(e) => {*/}
                    {/*                        const newSubEvent = [...subEvent];*/}
                    {/*                        newSubEvent[index].instruction = e.target.value;*/}
                    {/*                        setSubEvent(newSubEvent);*/}
                    {/*                    }}*/}
                    {/*                />*/}
                    {/*                <label htmlFor={`sub-note-${index}`}>Note:</label>*/}
                    {/*                <textarea*/}
                    {/*                    id={`sub-note-${index}`}*/}
                    {/*                    rows={3}*/}
                    {/*                    value={sub.note}*/}
                    {/*                    onChange={(e) => {*/}
                    {/*                        const newSubEvent = [...subEvent];*/}
                    {/*                        newSubEvent[index].note = e.target.value;*/}
                    {/*                        setSubEvent(newSubEvent);*/}
                    {/*                    }}*/}
                    {/*                />*/}
                    {/*                {subEvent.length > 1 && (*/}
                    {/*                    <button*/}
                    {/*                        type="button"*/}
                    {/*                        className="remove-button"*/}
                    {/*                        onClick={() => setSubEvent(subEvent.filter((_, i) => i !== index))}*/}
                    {/*                    >*/}
                    {/*                        Remove Sub-Event*/}
                    {/*                    </button>*/}
                    {/*                )}*/}
                    {/*            </div>*/}
                    {/*        ))}*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            )}
        </div>
    );
};
