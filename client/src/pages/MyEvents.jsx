import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const MyEvents = () => {
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [createdEvents, setCreatedEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const [regRes, createdRes] = await Promise.all([
                    api.get('/events/user/registered'),
                    api.get('/events/user/created')
                ]);
                setRegisteredEvents(regRes.data.map(r => r.eventId));
                setCreatedEvents(createdRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <h2 className="mb-2" style={{ color: 'var(--primary)' }}>Registered Events</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                {registeredEvents.map(event => event && (
                    <div key={event._id} className="card">
                        <h3>{event.title}</h3>
                        <p className="mb-1" style={{ color: 'var(--text-muted)' }}>{event.category} • {event.date} at {event.time}</p>
                        <Link to={`/events/${event._id}`} className="btn btn-outline" style={{ width: '100%' }}>View Details</Link>
                    </div>
                ))}
                {registeredEvents.length === 0 && <p>You haven't registered for any events yet.</p>}
            </div>

            <h2 className="mb-2" style={{ color: 'var(--secondary)' }}>Hosting Events</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {createdEvents.map(event => (
                    <div key={event._id} className="card">
                        <h3>{event.title}</h3>
                        <p className="mb-1" style={{ color: 'var(--text-muted)' }}>Status: <span style={{ fontWeight: 'bold' }}>{event.status.toUpperCase()}</span></p>
                        <p className="mb-1">{event.date} at {event.time}</p>
                        {event.status === 'approved' && <Link to={`/events/${event._id}`} className="btn btn-primary" style={{ width: '100%' }}>View Details</Link>}
                    </div>
                ))}
                {createdEvents.length === 0 && <p>You haven't created any events yet.</p>}
            </div>
        </div>
    );
};

export default MyEvents;
