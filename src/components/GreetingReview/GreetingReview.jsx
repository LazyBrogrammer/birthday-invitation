import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './greeting-review.css';
import {Loader} from "../Loader/Loader.jsx";
import toast from "react-hot-toast";
import {reload} from "../../utils/reload.js";

export const GreetingReview = () => {
    const [greetings, setGreetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getEventIdFromUrl = () => {
        const path = window.location.pathname;
        const parts = path.split('/');
        const lastPart = parts[parts.length - 1];
        const eventId = parseInt(lastPart, 10);
        return isNaN(eventId) ? null : eventId;
    };

    const eventId = getEventIdFromUrl();
    const apiUrl = import.meta.env.VITE_API_URL;
    const greetingsUrl = `${apiUrl}/greetings/allGreetings/${eventId}`;
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchGreetings = async () => {
            try {
                const response = await axios.get(greetingsUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.success) {
                    setGreetings(response.data.data);
                } else {
                    setError(response.data.message);
                }
            } catch (err) {
                setError('Failed to fetch greetings');
            } finally {
                setLoading(false);
            }
        };

        fetchGreetings();
    }, [greetingsUrl]);

    const handleApproval = async (greetingId, approval, eventToken) => {
        try {
            const response = await axios.post(
                `${apiUrl}/greetings/approve/${greetingId}?status=${approval}&token=${eventToken}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.data.success) {
                setGreetings(prev => prev.filter(g => g.id !== greetingId));
                toast.success(`Greeting ${approval === 'yes' ? 'approved' : 'declined'} successfully!`, {
                    position: 'bottom-right'
                });
                setTimeout(() => reload(), 1500);
            } else {
                alert('Failed to update greeting status');
            }
        } catch (error) {
            console.error("Error approving greeting:", error);
        }
    };

    if (loading) return <Loader/>;
    if (error) return <p>{error}</p>;

    return (
        <div className="greeting-review">
            <h2>Greeting Reviews</h2>
            {greetings.map(greeting => (
                <div key={greeting.id} className="greeting-card">
                    <p><strong>Message:</strong> {greeting.message}</p>
                    <p><strong>Guest Email:</strong> {greeting.guestEmail}</p>
                    <p><strong>Status: </strong><span
                        className={greeting.status}>{greeting.status}</span></p>
                    <p className="written-date"><strong>Date:</strong> {new Date(greeting.writtenDate).toLocaleString()}
                    </p>
                    {
                        greeting.status === "PENDING" ? <div className="greeting-actions btn-wrapper">
                            <button onClick={() => handleApproval(greeting.id, 'yes', greeting.token)}>Accept</button>
                            <button onClick={() => handleApproval(greeting.id, 'no', greeting.token)}>Decline</button>
                        </div> : ''
                    }
                </div>
            ))}
        </div>
    );
};
