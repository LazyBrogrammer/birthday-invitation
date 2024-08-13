import video from '../../assets/backgroundVideo.mp4'
import './home.css';
export const Home = () => {
    return (
        <div className="home">
            <div className="video-background">
                <video autoPlay loop muted>
                    <source src={video} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
};
