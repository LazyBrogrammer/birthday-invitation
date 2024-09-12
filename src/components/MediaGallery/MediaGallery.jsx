import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Toaster, toast} from 'react-hot-toast';
import './media-gallery.css';
import {getIdFromPath} from "../../utils/getIdFromPath.js";

export const MediaGallery = () => {
    const [mediaItems, setMediaItems] = useState([]);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');
    const uploaderEmail = localStorage.getItem('email');
    const eventId = getIdFromPath(); // ID ni URL'dan olishingiz kerak bo'lsa

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        try {
            const response = await axios.get(`${apiUrl}/media/approved/${eventId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response)

            if (response.data.success) {
                setMediaItems(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to fetch media.');
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error('Please select a file to upload.', {
                position: "bottom-right",
                autoClose: 3000,
            });
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('eventId', eventId);
        formData.append('uploaderEmail', uploaderEmail);

        try {
            setUploading(true);
            setUploadProgress(0);

            await axios.post(`${apiUrl}/media/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                },
            });


            toast.success('File uploaded successfully!', {
                position: "bottom-right",
                autoClose: 3000,
            });
            setFile(null);
            fetchMedia();
        } catch (error) {
            toast.error('Failed to upload file.');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="media-gallery-container">
            {/*<Toaster position="top-right" reverseOrder={false}/>*/}
            <div className="upload-section">
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    disabled={uploading}
                />
                <button onClick={handleUpload} disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
                {uploading && (
                    <div className="progress-bar">
                        <div
                            className="progress-bar-fill"
                            style={{width: `${uploadProgress}%`}}
                        ></div>
                    </div>
                )}
            </div>

            <div className="media-gallery">
                {mediaItems.map((item) => (
                    <div key={item.id} className="media-card">
                        <img
                            src={item.thumbnailUrl}
                            alt={item.filename}
                            className="media-thumbnail"
                        />
                        <a
                            href={item.mediaUrl}
                            download={item.filename}
                            className="download-button"
                        >
                            Download
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MediaGallery;
