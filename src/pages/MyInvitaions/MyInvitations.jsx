import React, { useState, useEffect } from "react";
import axios from "axios";
import "./myInvitations.css"; // For custom styles

export const MyInvitations = () => {
    const [events, setEvents] = useState([]);
    const email = localStorage.getItem("email");

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`/guests/account/${email}/events`);
                if (response.data.success) {
                    // Sort events by start time (ascending)
                    const sortedEvents = response.data.data.sort((a, b) =>
                        new Date(a.eventStartTime) - new Date(b.eventStartTime)
                    );
                    setEvents(sortedEvents);
                } else {
                    console.error("Failed to fetch events:", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, [email]);

    return (
        <div className="events-container">
            {events.length === 0 ? (
                <div className="no-events-card">
                    <h3>No Events Found</h3>
                    <p>There are no events to display. Please check back later or create a new event.</p>
                </div>
            ) : (
                events.map((event) => (
                    <div key={event.id} className="event-card">
                        <div className="event-header">
                            <h2 className="event-name">{event.eventName}</h2>
                            <span className={`event-status ${event.status.toLowerCase()}`}>
                {event.status}
              </span>
                        </div>
                        <p><strong>Location:</strong> {event.location}</p>
                        <p><strong>Start:</strong> {new Date(event.eventStartTime).toLocaleString()}</p>
                        <p><strong>End:</strong> {new Date(event.eventEndTime).toLocaleString()}</p>
                        <p><strong>Note:</strong> {event.note}</p>
                        <p><strong>Organizer:</strong> {event.organizerName} ({event.organizerEmail})</p>

                        {event.subEvent.length > 0 && (
                            <div className="sub-events">
                                <h4>Sub Events:</h4>
                                {event.subEvent.map((sub) => (
                                    <div key={sub.id} className="sub-event">
                                        <p><strong>Part Name:</strong> {sub.partName}</p>
                                        <p><strong>Start:</strong> {new Date(sub.startTime).toLocaleString()}</p>
                                        <p><strong>End:</strong> {new Date(sub.endTime).toLocaleString()}</p>
                                        <p><strong>Location:</strong> {sub.location}</p>
                                        <p><strong>Note:</strong> {sub.note}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};
