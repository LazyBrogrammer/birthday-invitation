import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './subevents.css';
import {Loader} from "../Loader/Loader.jsx"; // Add necessary CSS styles

export const SubEvents = () => {
    const [subEvents, setSubEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const email = localStorage.getItem('email');
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token')

    useEffect(() => {
        const fetchSubEvents = async () => {
            try {
                const response = await axios.get(apiUrl + `/guests/account/${email}/events`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.success) {
                    // Extract sub-events from each event
                    const allSubEvents = response.data.data.flatMap(event => event.subEvents);
                    setSubEvents(allSubEvents);
                } else {
                    setError(response.data.message);
                }
            } catch (error) {
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchSubEvents();
    }, []);

    if (loading) {
        return <Loader/>
    }
    if (error) return <p>{error}</p>;

    return (
        <div className="sub-events-container">
            {subEvents.length > 0 ? subEvents.map(subEvent => (
                <div key={subEvent.id} className="sub-event-card">
                    <h4>{subEvent.partName}</h4>
                    <p><strong>Start Time:</strong> {new Date(subEvent.startTime).toLocaleString()}</p>
                    <p><strong>End Time:</strong> {new Date(subEvent.endTime).toLocaleString()}</p>
                    <p><strong>Location:</strong> {subEvent.location}</p>
                    <p><strong>Instruction:</strong> {subEvent.instruction}</p>
                    <p><strong>Note:</strong> {subEvent.note}</p>
                </div>
            )) : <p>You don't have sub events</p>}
        </div>
    );
};
