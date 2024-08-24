import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './eventinfo.css'
import {Loader} from "../../components/Loader/Loader.jsx";

export const EventInfo = ({data}) => {
    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const email = localStorage.getItem('email');
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token')
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

    if (loading) return <Loader/>
    if (error) return <p>{error}</p>;

    return (
        <div className="event-details">
            {eventData && eventData.map(event => (
                <div key={event.id} className="event-card">
                    <h3>{event.eventName}</h3>
                    <p><strong>Start Time:</strong> {new Date(event.eventStartTime).toLocaleString()}</p>
                    <p><strong>End Time:</strong> {new Date(event.eventEndTime).toLocaleString()}</p>
                    <p><strong>Location:</strong> {event.location}</p>
                    <p><strong>Instructions:</strong> {event.instructions}</p>
                    <p><strong>Note:</strong> {event.note}</p>

                    <h4>Guests:</h4>
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

                    <h4>Sub-Events:</h4>
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
        </div>
    );
};
