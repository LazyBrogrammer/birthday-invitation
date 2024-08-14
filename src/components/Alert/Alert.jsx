
import '../Alert/alert.css';

export const Alert = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div className={`alert alert-${type}`}>
      <span className="alert-message">{message}</span>
      <button className="alert-close" onClick={onClose}>
        &times;
      </button>
    </div>
  );
};


