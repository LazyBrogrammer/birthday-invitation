import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./events.css"; // Rename the CSS file as well

const apiUrl = import.meta.env.VITE_API_URL;

export const Events = () => {
  const [eventDate, setEventDate] = useState("");
  const [eventName, setEventName] = useState("");
  const [guests, setGuests] = useState([
    { email: "", name: "", role: "GUEST" },
  ]);
  const [instructions, setInstructions] = useState("");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");
  //   const [organizerEmail, setOrganizerEmail] = useState("");

  const handleGuestChange = (index, e) => {
    const newGuests = [...guests];
    newGuests[index][e.target.name] = e.target.value;
    setGuests(newGuests);
  };

  const addGuest = () => {
    setGuests([...guests, { email: "", name: "", role: "GUEST" }]);
  };

  const removeGuest = (index) => {
    const newGuests = guests.filter((_, i) => i !== index);
    setGuests(newGuests);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventData = {
      eventDate,
      eventName,
      guests,
      instructions,
      location,
      note,
      //   organizerEmail,
    };

    try {
      const response = await axios.post(
        apiUrl + "invitations/invitation",
        eventData
      );
      if (response.data.success) {
        toast.success("Event created successfully!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error("Failed to create event: " + response.data.message, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(
        "An error occurred while creating the event. Please try again.",
        {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    }
  };

  return (
    <div className="events-container">
      <div className="events">
        <h2>Create an Event</h2>
        <form className="event-form" onSubmit={handleSubmit}>
          <div className="event-form_top">
            <div>
              <label htmlFor="event-date">Event Date:</label>
              <input
                id="event-date"
                type="datetime-local"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="event-name">Event Name:</label>
              <input
                id="event-name"
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="location">Location:</label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="event-form_middle">
            <div>
              <label htmlFor="note">Note:</label>
              <textarea
                id="note"
                required
                rows={5}
                cols={30}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className="full-width">
              <label htmlFor="instructions">Instructions:</label>
              <textarea
                id="instructions"
                rows={5}
                cols={30}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                required
              />
            </div>
          </div>

          <h3>Guests</h3>
          <button type="button" className="add-button" onClick={addGuest}>
            Add Guest
          </button>
          <div className="guests-container full-width">
            {guests.map((guest, index) => (
              <div key={index} className="guest-item">
                <label htmlFor={`guest-email-${index}`}>Guest Email:</label>
                <input
                  id={`guest-email-${index}`}
                  type="email"
                  name="email"
                  placeholder="Guest Email"
                  value={guest.email}
                  onChange={(e) => handleGuestChange(index, e)}
                  required
                />
                <label htmlFor={`guest-name-${index}`}>Guest Name:</label>
                <input
                  id={`guest-name-${index}`}
                  type="text"
                  name="name"
                  placeholder="Guest Name"
                  value={guest.name}
                  onChange={(e) => handleGuestChange(index, e)}
                  required
                />
                <label htmlFor={`guest-role-${index}`}>Role:</label>
                <select
                  id={`guest-role-${index}`}
                  name="role"
                  value={guest.role}
                  onChange={(e) => handleGuestChange(index, e)}
                  required
                >
                  <option value="GUEST">GUEST</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                {guests.length > 1 && (
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => removeGuest(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <button className="create-event" type="submit">Create Event</button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};
