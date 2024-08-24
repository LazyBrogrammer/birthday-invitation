import React from 'react';
import './dashboard.css'; // Import the styles for the dashboard
import {useNavigate} from 'react-router-dom';

export const Dashboard = () => {
    const navigate = useNavigate();
    const email = localStorage.getItem('email');
    const name = localStorage.getItem('user-name');

    const handleLogout = () => {
        // Clear the local storage
        localStorage.removeItem('email');
        localStorage.removeItem('user-name');
        localStorage.removeItem('token');
        // Redirect to login page
        navigate('/');
    };

    return (
        <div className="dashboard-container">
            <h2>Welcome to your Dashboard</h2>
            <div className="user-info">
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Email:</strong> {email}</p>
            </div>
            <button className="logout-button" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};
