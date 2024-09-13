import {useState, useEffect} from 'react';
import axios from 'axios';
import {toast} from 'react-hot-toast';
import './media-gallery.css';
import {getIdFromPath} from "../../utils/getIdFromPath.js";

export const MediaGallery = () => {
    const [mediaItems, setMediaItems] = useState([]);
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');
    const uploaderEmail = localStorage.getItem('email');
    const eventId = getIdFromPath();

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

            if (response.data.success) {
                setMediaItems(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to fetch media.');
        }
    };

    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
    };

    const handleUpload = async () => {
        if (!files.length) {
            toast.error('Please select files to upload.', {
                position: "bottom-right",
                autoClose: 3000,
            });
            return;
        }

        const formData = new FormData();
        files.forEach((file) => formData.append('file', file));
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

            toast.success('Files uploaded successfully!', {
                position: "bottom-right",
                autoClose: 3000,
            });
            setFiles([]);
            fetchMedia();
        } catch (error) {
            toast.error('Failed to upload files.');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="media-gallery-container">
            <div className="upload-section">
                <label className="file-input-label">
                    Select Files
                    <input
                        type="file"
                        accept="image/*, video/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                        multiple
                        hidden
                    />
                </label>
                {files.length > 0 && (
                    <div className="selected-files">
                        {files.map((file, index) => (
                            <span key={index} className="file-name">{file.name}</span>
                        ))}
                    </div>
                )}
                <button className={`upload-button ${uploading ? 'uploading' : ''}`} onClick={handleUpload}
                        disabled={uploading}>
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
                {mediaItems.length === 0 ? (
                    Array.from({length: files.length || 6}).map((_, index) => (
                        <div key={index} className="media-skeleton"></div>
                    ))
                ) : (
                    mediaItems.map((item) => (
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
                    ))
                )}
            </div>
        </div>
    );
};
