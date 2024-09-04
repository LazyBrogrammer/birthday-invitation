import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import './eventinfo.css';
import {Loader} from "../../components/Loader/Loader.jsx";
import {Link} from "react-router-dom";

export const EventInfo = ({data}) => {
    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSubEventPopup, setShowSubEventPopup] = useState(false);
    const [showGuestPopup, setShowGuestPopup] = useState(false);
    const [guestForms, setGuestForms] = useState([{email: '', name: '', role: 'GUEST'}]);
    const [subEventForms, setSubEventForms] = useState([{
        endTime: '',
        instruction: '',
        location: '',
        note: '',
        partName: '',
        startTime: ''
    }]);

    const guestPopupRef = useRef(null);
    const subEventPopupRef = useRef(null);

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

    const handleClickOutside = (event) => {
        if (guestPopupRef.current && !guestPopupRef.current.contains(event.target)) {
            setShowGuestPopup(false);
        }
        if (subEventPopupRef.current && !subEventPopupRef.current.contains(event.target)) {
            setShowSubEventPopup(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleGuestSubmit = async () => {
        try {
            const response = await axios.post(`${apiUrl}/invitations/addGuests`, {
                eventId: data.id,
                guests: guestForms,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                alert("Guests added successfully!");
                setShowGuestPopup(false);
            } else {
                alert("Failed to add guests.");
            }
        } catch (error) {
            console.error("Error adding guests:", error);
        }
    };

    const handleSubEventSubmit = async () => {
        try {
            const response = await axios.post(`${apiUrl}/invitations/addSubEvents`, {
                eventId: data.id,
                subEvents: subEventForms,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                alert("Sub-Events added successfully!");
                setShowSubEventPopup(false);
            } else {
                alert("Failed to add sub-events.");
            }
        } catch (error) {
            console.error("Error adding sub-events:", error);
        }
    };

    const addGuestForm = () => {
        setGuestForms([...guestForms, {email: '', name: '', role: 'GUEST'}]);
    };

    const addSubEventForm = () => {
        setSubEventForms([...subEventForms, {
            endTime: '',
            instruction: '',
            location: '',
            note: '',
            partName: '',
            startTime: ''
        }]);
    };

    const removeGuestForm = (index) => {
        setGuestForms(guestForms.filter((_, i) => i !== index));
    };

    const removeSubEventForm = (index) => {
        setSubEventForms(subEventForms.filter((_, i) => i !== index));
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
                        <button>
                            <Link to={'/event-info/media-review/' + data.id}>Media Review</Link>
                        </button>
                        <button><Link to={'/event-info/greeting-review/' + data.id}>Greeting Review</Link></button>
                    </div>
                    <div className='btn-wrapper'>
                        <h4>Guests:</h4>
                        <button onClick={() => setShowGuestPopup(true)}>Add Guest</button>
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
                        <h4>Schedule:</h4>
                        <button onClick={() => setShowSubEventPopup(true)}>Add Schedule</button>
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

            {/* Guest Popup */}
            {showGuestPopup && (
                <div className="popup-overlay">
                    <div className="popup-content" ref={guestPopupRef}>
                        <button className="close-button" onClick={() => setShowGuestPopup(false)}>X</button>
                        <h3>Add Guests</h3>
                        {guestForms.map((guest, index) => (
                            <div key={index} className="form-card">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    placeholder="Guest Email"
                                    value={guest.email}
                                    onChange={e => {
                                        const updatedGuests = [...guestForms];
                                        updatedGuests[index].email = e.target.value;
                                        setGuestForms(updatedGuests);
                                    }}
                                />
                                <label>Name:</label>
                                <input
                                    type="text"
                                    placeholder="Guest Name"
                                    value={guest.name}
                                    onChange={e => {
                                        const updatedGuests = [...guestForms];
                                        updatedGuests[index].name = e.target.value;
                                        setGuestForms(updatedGuests);
                                    }}
                                />
                                <label>Role:</label>
                                <select
                                    value={guest.role}
                                    onChange={e => {
                                        const updatedGuests = [...guestForms];
                                        updatedGuests[index].role = e.target.value;
                                        setGuestForms(updatedGuests);
                                    }}
                                >
                                    <option value="GUEST">GUEST</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                                {guestForms.length > 1 && (
                                    <button className='submit-button delete-btn'
                                            onClick={() => removeGuestForm(index)}>Remove</button>
                                )}
                            </div>
                        ))}
                        <button className='submit-button' onClick={addGuestForm}>Add Another Guest
                        </button>
                        <button className='submit-button' onClick={handleGuestSubmit}>Submit</button>
                    </div>
                </div>
            )}

            {/* Sub-Event Popup */}
            {showSubEventPopup && (
                <div className="popup-overlay">
                    <div className="popup-content" ref={subEventPopupRef}>
                        <button className="close-button" onClick={() => setShowSubEventPopup(false)}>X</button>
                        <h3>Add Sub Events</h3>
                        {subEventForms.map((sub, index) => (
                            <div key={index} className="form-card">
                                <label>Start Time:</label>
                                <input
                                    type="datetime-local"
                                    placeholder="Start Time"
                                    value={sub.startTime}
                                    onChange={e => {
                                        const updatedSubEvents = [...subEventForms];
                                        updatedSubEvents[index].startTime = e.target.value;
                                        setSubEventForms(updatedSubEvents);
                                    }}
                                />
                                <label>End Time:</label>
                                <input
                                    type="datetime-local"
                                    placeholder="End Time"
                                    value={sub.endTime}
                                    onChange={e => {
                                        const updatedSubEvents = [...subEventForms];
                                        updatedSubEvents[index].endTime = e.target.value;
                                        setSubEventForms(updatedSubEvents);
                                    }}
                                />
                                <label>Location:</label>
                                <input
                                    type="text"
                                    placeholder="Location"
                                    value={sub.location}
                                    onChange={e => {
                                        const updatedSubEvents = [...subEventForms];
                                        updatedSubEvents[index].location = e.target.value;
                                        setSubEventForms(updatedSubEvents);
                                    }}
                                />
                                <label>Part Name:</label>
                                <input
                                    type="text"
                                    placeholder="Part Name"
                                    value={sub.partName}
                                    onChange={e => {
                                        const updatedSubEvents = [...subEventForms];
                                        updatedSubEvents[index].partName = e.target.value;
                                        setSubEventForms(updatedSubEvents);
                                    }}
                                />
                                <label>Instruction:</label>
                                <input
                                    type="text"
                                    placeholder="Instruction"
                                    value={sub.instruction}
                                    onChange={e => {
                                        const updatedSubEvents = [...subEventForms];
                                        updatedSubEvents[index].instruction = e.target.value;
                                        setSubEventForms(updatedSubEvents);
                                    }}
                                />
                                <label>Note:</label>
                                <textarea
                                    placeholder="Note"
                                    value={sub.note}
                                    onChange={e => {
                                        const updatedSubEvents = [...subEventForms];
                                        updatedSubEvents[index].note = e.target.value;
                                        setSubEventForms(updatedSubEvents);
                                    }}
                                />
                                {subEventForms.length > 1 && (
                                    <button className='submit-button delete-btn'
                                            onClick={() => removeSubEventForm(index)}>Remove</button>
                                )}
                            </div>
                        ))}
                        <button className='submit-button' onClick={addSubEventForm}>Add Another Sub Event</button>
                        <button className='submit-button' onClick={handleSubEventSubmit}>Submit</button>
                    </div>
                </div>
            )}
        </div>
    );
};
