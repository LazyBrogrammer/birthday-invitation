export const getIdFromPath = () => {
    const path = window.location.pathname;
    const parts = path.split('/');
    const lastPart = parts[parts.length - 1];
    const eventId = parseInt(lastPart, 10);
    return isNaN(eventId) ? null : eventId;
};