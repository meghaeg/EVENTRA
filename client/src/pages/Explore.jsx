import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapPin, Calendar, Clock } from 'lucide-react';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapClickHandler = ({ setDistrictFilter, list }) => {
    useMapEvents({
        click: async (e) => {
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}&zoom=10&addressdetails=1`);
                const data = await res.json();
                if (data && data.address) {
                    const addrInfo = JSON.stringify(data.address).toLowerCase();
                    const match = list.find(d => d !== "All Districts" && d !== "Other TN" && addrInfo.includes(d.toLowerCase()));
                    if (match) {
                        setDistrictFilter(match);
                    }
                }
            } catch (err) { }
        }
    });
    return null;
};

const districtCoordinates = {
    "Chennai": { lat: 13.0827, lng: 80.2707 },
    "Coimbatore": { lat: 11.0168, lng: 76.9558 },
    "Madurai": { lat: 9.9252, lng: 78.1198 },
    "Tiruchirappalli": { lat: 10.7905, lng: 78.7047 },
    "Salem": { lat: 11.6643, lng: 78.1460 },
    "Tirunelveli": { lat: 8.7139, lng: 77.7567 },
    "Tiruppur": { lat: 11.1085, lng: 77.3411 },
    "Vellore": { lat: 12.9165, lng: 79.1325 },
    "Erode": { lat: 11.3410, lng: 77.7172 },
    "Thoothukudi": { lat: 8.7642, lng: 78.1348 },
    "Dindigul": { lat: 10.3673, lng: 77.9803 },
    "Thanjavur": { lat: 10.7870, lng: 79.1378 },
    "Ranipet": { lat: 12.9276, lng: 79.3323 },
    "Kanyakumari": { lat: 8.0883, lng: 77.5385 },
    "Karur": { lat: 10.9601, lng: 78.0766 },
    "Namakkal": { lat: 11.2189, lng: 78.1674 },
    "Nilgiris": { lat: 11.4916, lng: 76.7337 },
    "Other TN": { lat: 11.1271, lng: 78.6569 }
};

const MapRelocator = ({ districtFilter, tnCenter }) => {
    const map = useMap();
    useEffect(() => {
        if (districtFilter === 'All Districts') {
            map.flyTo(tnCenter, 7);
        } else {
            const coords = districtCoordinates[districtFilter];
            if (coords) {
                map.flyTo([coords.lat, coords.lng], 10);
            }
        }
    }, [districtFilter, map, tnCenter]);
    return null;
};

const categoriesList = [
    "All Categories", "Sports", "Cultural", "Education", "Technology", "NGO / Social", "Government", "Workshops", "Campaigns", "Politics", "Networking", "Festival", 
    "Music", "Dance", "Comedy", "Theatre", "Movies / Film", "Art & Craft", "Exhibitions", "Fashion", "Food & Drinks", "Nightlife", 
    "Business", "Startup", "Entrepreneurship", "Finance", "Marketing", "Career / Jobs", "Internships", "Conferences", "Seminars", "Webinars", 
    "Hackathons", "Coding", "AI / ML", "Data Science", "Robotics", "Research", "Competitions", "Quiz", 
    "Health", "Fitness", "Yoga", "Meditation", "Mental Health", 
    "Volunteering", "Fundraising", "Community Meetups", "Religious / Spiritual", 
    "Travel", "Adventure", "Trekking", "Camping", "Environment", 
    "Kids", "Family", "Dating", "Personal Development", "Hobbies", 
    "Online Events", "Offline Events", "Hybrid Events", "Others"
];

const tnDistrictsList = [
    "All Districts", "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem",
    "Tirunelveli", "Tiruppur", "Vellore", "Erode", "Thoothukudi", "Dindigul",
    "Thanjavur", "Kanyakumari", "Karur", "Namakkal", "Nilgiris", "Ranipet", "Other TN"
];

const Explore = () => {
    const [events, setEvents] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [districtFilter, setDistrictFilter] = useState('All Districts');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get('/events');
                setEvents(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchEvents();
    }, []);

    const filteredEvents = events.filter(e => {
        const matchCategory = categoryFilter ? e.category === categoryFilter : true;
        const matchDistrict = districtFilter !== 'All Districts' ?
            (e.location?.district === districtFilter ||
                e.location?.address.toLowerCase().includes(districtFilter.toLowerCase())) : true;

        return matchCategory && matchDistrict;
    });

    const tnCenter = [11.1271, 78.6569];
    const tnBounds = [
        [7.5, 75.5], // South West
        [14.0, 81.0] // North East
    ];

    return (
        <div className="container">
            <div className="mb-3" style={{ textAlign: 'center', marginTop: '20px' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>Discover What’s Happening Around You</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Explore the top hyperlocal events matched for you in Tamil Nadu. Join the community and make every day an adventure.</p>
            </div>

            {/* Category and District Filters Aligned */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontWeight: '600', color: 'var(--text-muted)', fontSize: '1rem' }}>🔖 Select Category:</span>
                    <select
                        className="form-group"
                        value={categoryFilter === '' ? 'All Categories' : categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value === 'All Categories' ? '' : e.target.value)}
                        style={{ marginBottom: 0, padding: '10px 16px', borderRadius: '12px', border: '2px solid #eaeaea', fontSize: '0.95rem', minWidth: '220px', cursor: 'pointer', backgroundColor: '#fff' }}
                    >
                        {categoriesList.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontWeight: '600', color: 'var(--text-muted)', fontSize: '1rem' }}><MapPin size={20} style={{ display: 'inline', verticalAlign: 'middle' }} /> Select District:</span>
                    <select
                        className="form-group"
                        value={districtFilter}
                        onChange={(e) => setDistrictFilter(e.target.value)}
                        style={{ marginBottom: 0, padding: '10px 16px', borderRadius: '12px', border: '2px solid #eaeaea', fontSize: '0.95rem', minWidth: '220px', cursor: 'pointer', backgroundColor: '#fff' }}
                    >
                        {tnDistrictsList.map(dist => (
                            <option key={dist} value={dist}>{dist}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div style={{ height: '420px', width: '100%', marginBottom: '60px', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                <MapContainer
                    center={tnCenter}
                    zoom={7}
                    scrollWheelZoom={false}
                    maxBounds={tnBounds}
                    maxBoundsViscosity={1.0}
                    minZoom={6}
                    style={{ height: '100%', width: '100%' }}
                >
                    <MapRelocator districtFilter={districtFilter} tnCenter={tnCenter} />
                    <MapClickHandler setDistrictFilter={setDistrictFilter} list={tnDistrictsList} />
                    <TileLayer
                        attribution='&copy; OpenStreetMap'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {filteredEvents.map(event => (
                        <Marker
                            key={event._id}
                            position={[event.location.lat, event.location.lng]}
                            eventHandlers={{
                                click: () => {
                                    if (event.location.district) {
                                        setDistrictFilter(event.location.district);
                                    } else {
                                        const dist = tnDistrictsList.find(d => event.location.address.toLowerCase().includes(d.toLowerCase()));
                                        if (dist) setDistrictFilter(dist);
                                    }
                                }
                            }}
                        >
                            <Popup>
                                <strong style={{ fontSize: '1.1rem' }}>{event.title}</strong><br />
                                <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{event.category}</span><br />
                                <span style={{ color: 'var(--text-muted)' }}>{event.location.district || 'Tamil Nadu'}</span><br />
                                <Link to={`/events/${event._id}`} style={{ fontWeight: '600', textDecoration: 'underline' }}>View Details</Link>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px', paddingBottom: '60px' }}>
                {filteredEvents.map(event => (
                    <div key={event._id} className="card" style={{ justifyContent: 'space-between', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        {event.image && (
                           <div style={{ width: '100%', height: '220px', flexShrink: 0, backgroundColor: '#f0f0f0' }}>
                               <img src={event.image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                           </div>
                        )}
                        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <div>
                                <div style={{ display: 'inline-block', padding: '6px 14px', backgroundColor: 'rgba(245, 135, 87, 0.1)', color: 'var(--primary)', borderRadius: '20px', fontWeight: '700', fontSize: '0.85rem', marginBottom: '16px' }}>
                                    {event.category}
                                </div>
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>{event.title}</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px' }}>
                                    <div className="flex items-center gap-2"><Calendar size={18} color="var(--secondary)" /> {event.date}</div>
                                    <div className="flex items-center gap-2"><Clock size={18} color="var(--secondary)" /> {event.time}</div>
                                    <div className="flex items-center gap-2" style={{ color: 'var(--primary)', fontWeight: '500' }}>
                                        <MapPin size={18} /> {event.location.district ? event.location.district : event.location.address}
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginTop: 'auto' }}>
                                <Link to={`/events/${event._id}`} className="btn btn-primary" style={{ width: '100%' }}>View Details</Link>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredEvents.length === 0 && <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>No events found for {districtFilter === 'All Districts' ? 'this category' : `this category in ${districtFilter}`}.</p>}
            </div>
        </div>
    );
};

export default Explore;
