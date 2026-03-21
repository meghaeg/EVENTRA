import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Dashboard = () => {
    const { user } = useAuth();
    const [recommendedEvents, setRecommendedEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const res = await api.get('/events');
                const allEvents = res.data;
                // Simple recommendation: match categories with user interests
                const userInterests = user.interests || [];
                const filtered = allEvents.filter(event =>
                    userInterests.some(interest =>
                        event.category.toLowerCase().includes(interest.toLowerCase()) ||
                        interest.toLowerCase().includes(event.category.toLowerCase())
                    )
                );
                // Fallback to latest events if no match
                setRecommendedEvents(filtered.length > 0 ? filtered : allEvents.slice(0, 5));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecommendations();
    }, [user]);

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <h1 className="mb-2">Welcome, {user.name}! 👋</h1>

            <h2 className="mb-2" style={{ color: 'var(--secondary)' }}>Recommended for You</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {recommendedEvents.map(event => (
                    <div key={event._id} className="card">
                        <h3>{event.title}</h3>
                        <p className="mb-1" style={{ color: 'var(--text-muted)' }}>{event.category} • {event.date} at {event.time}</p>
                        <Link to={`/events/${event._id}`} className="btn btn-outline" style={{ width: '100%' }}>View Details</Link>
                    </div>
                ))}
                {recommendedEvents.length === 0 && <p>No events available right now.</p>}
            </div>
        </div>
    );
};

export default Dashboard;
