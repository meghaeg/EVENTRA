import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get(`/events/${id}`);
                setEvent(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchEvent();
    }, [id]);

    const handleRegister = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await api.post(`/events/register/${id}`);
            alert('Successfully registered!');
            navigate('/my-events');
        } catch (err) {
            alert(err.response?.data?.msg || 'Error registering');
        }
    };

    if (!event) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <div className="card">
                <h1 style={{ color: 'var(--primary)', marginBottom: '10px' }}>{event.title}</h1>
                {event.image && (
                    <div style={{ width: '100%', maxHeight: '400px', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px', backgroundColor: '#f0f0f0' }}>
                        <img src={event.image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover', maxHeight: '400px' }} />
                    </div>
                )}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <span style={{ padding: '4px 12px', backgroundColor: 'var(--highlight)', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600 }}>{event.category}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{event.date} at {event.time}</span>
                </div>
                <p className="mb-2">{event.description}</p>
                <div className="mb-2">
                    <strong>Location:</strong> {event.location.address}
                </div>
                <div className="mb-3">
                    <strong>Organizer Contact:</strong> {event.organizer}
                </div>

                <div style={{ height: '300px', width: '100%', marginBottom: '20px', borderRadius: '12px', overflow: 'hidden' }}>
                    <MapContainer center={[event.location.lat, event.location.lng]} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; OpenStreetMap contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[event.location.lat, event.location.lng]}>
                            <Popup>{event.location.address}</Popup>
                        </Marker>
                    </MapContainer>
                </div>

                <button onClick={handleRegister} className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '12px 32px' }}>
                    Register for Event
                </button>
            </div>
        </div>
    );
};

export default EventDetails;
