import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import './greetingBoard.css';
import {Loader} from "../Loader/Loader.jsx";

export const GreetingBoard = ({eventId}) => {
    const [greetings, setGreetings] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const modalRef = useRef(null);

    const guestEmail = localStorage.getItem('email'); // Assuming guestEmail is stored in localStorage
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');
    const greetingUrl = `${apiUrl}/greetings/allGreetings/${eventId}`;

    useEffect(() => {
        const fetchGreetings = async () => {
            try {
                const response = await axios.get(greetingUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.success) {
                    setGreetings(response.data.data);
                } else {
                    setError(response.data.message);
                }
            } catch (error) {
                setError('Failed to fetch greetings.');
            } finally {
                setLoading(false);
            }
        };

        fetchGreetings();
    }, [greetingUrl]);

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setShowModal(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAddGreeting = async () => {
        const writtenDate = new Date().toISOString(); // Get the current date in ISO format

        try {
            const response = await axios.post(`${apiUrl}/greetings/addGreeting`, {
                eventId,
                guestEmail,
                message,
                writtenDate,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                alert('Greeting added successfully!');
                setShowModal(false);
                setMessage('');
                setGreetings([...greetings, {eventId, guestEmail, message, writtenDate, status: 'PENDING'}]);
            } else {
                alert('Failed to add greeting.');
            }
        } catch (error) {
            console.error('Error adding greeting:', error);
        }
    };

    if (loading) return <Loader/>;

    return (
        <div className="greeting-board">
            <div className="greetings-list">
                {greetings.map((greeting) => (
                    <div key={greeting.id} className="greeting-card">
                        <p>{greeting.message}</p>
                        <span className="written-date">{new Date(greeting.writtenDate).toLocaleString()}</span>
                    </div>
                ))}
            </div>

            <div className="add-greeting">
                <button onClick={() => setShowModal(true)}>Add Greeting</button>
            </div>

            {/* Modal Popup */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" ref={modalRef}>
                        <button className="close-button" onClick={() => setShowModal(false)}>X</button>
                        <h3>Add Greeting</h3>
                        <textarea
                            placeholder="Write your greeting..."
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                        />
                        <button onClick={handleAddGreeting}>Submit</button>
                    </div>
                </div>
            )}
        </div>
    );
};
