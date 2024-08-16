import video from '../../assets/backgroundVideo.mp4'
import './home.css';
import {Login} from "../Login/Login.jsx";
import {isAuthenticated} from "../../auth/auth.js";

export const Home = () => {
const token = localStorage.getItem('token');

    return (
        <div className="home">
            <div className="video-background">
                <video autoPlay loop muted>
                    <source src={video} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            {
                isAuthenticated() ? <h1>Welcome to our website</h1> : <Login />
            }
        </div>
    );
};
