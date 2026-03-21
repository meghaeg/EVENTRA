import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Sports',
        address: '',
        district: 'Chennai',
        date: '',
        time: '',
        organizer: '',
        image: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const onImageChange = e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setFormData({ ...formData, image: reader.result });
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async e => {
        e.preventDefault();
        try {
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

            // Add a small random offset so markers don't overlap exactly
            const coords = districtCoordinates[formData.district] || districtCoordinates["Chennai"];
            const latOffset = (Math.random() - 0.5) * 0.05;
            const lngOffset = (Math.random() - 0.5) * 0.05;

            const location = {
                lat: coords.lat + latOffset,
                lng: coords.lng + lngOffset,
                address: formData.address,
                district: formData.district
            };

            const res = await api.post('/events', {
                ...formData,
                location
            });
            alert('Event submitted successfully! Waiting for admin approval.');
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Error creating event');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px', marginBottom: '40px' }}>
            <div className="card">
                <h2 className="text-center mb-2" style={{ color: 'var(--primary)' }}>Host an Event</h2>
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input type="text" name="title" value={formData.title} onChange={onChange} required />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={onChange} required rows="3" />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select name="category" value={formData.category} onChange={onChange}>
                            {[
                                "Sports", "Cultural", "Education", "Technology", "NGO / Social", "Government", "Workshops", "Campaigns", "Politics", "Networking", "Festival", 
                                "Music", "Dance", "Comedy", "Theatre", "Movies / Film", "Art & Craft", "Exhibitions", "Fashion", "Food & Drinks", "Nightlife", 
                                "Business", "Startup", "Entrepreneurship", "Finance", "Marketing", "Career / Jobs", "Internships", "Conferences", "Seminars", "Webinars", 
                                "Hackathons", "Coding", "AI / ML", "Data Science", "Robotics", "Research", "Competitions", "Quiz", 
                                "Health", "Fitness", "Yoga", "Meditation", "Mental Health", 
                                "Volunteering", "Fundraising", "Community Meetups", "Religious / Spiritual", 
                                "Travel", "Adventure", "Trekking", "Camping", "Environment", 
                                "Kids", "Family", "Dating", "Personal Development", "Hobbies", 
                                "Online Events", "Offline Events", "Hybrid Events", "Others"
                            ].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div className="flex gap-4 mb-2">
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>District (Tamil Nadu)</label>
                            <select name="district" value={formData.district} onChange={onChange}>
                                <option value="Chennai">Chennai</option>
                                <option value="Coimbatore">Coimbatore</option>
                                <option value="Madurai">Madurai</option>
                                <option value="Tiruchirappalli">Tiruchirappalli</option>
                                <option value="Salem">Salem</option>
                                <option value="Tirunelveli">Tirunelveli</option>
                                <option value="Tiruppur">Tiruppur</option>
                                <option value="Vellore">Vellore</option>
                                <option value="Erode">Erode</option>
                                <option value="Thoothukudi">Thoothukudi</option>
                                <option value="Dindigul">Dindigul</option>
                                <option value="Thanjavur">Thanjavur</option>
                                <option value="Kanyakumari">Kanyakumari</option>
                                <option value="Karur">Karur</option>
                                <option value="Namakkal">Namakkal</option>
                                <option value="Nilgiris">Nilgiris</option>
                                <option value="Ranipet">Ranipet</option>
                                <option value="Other TN">Other TN</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Address</label>
                            <input type="text" name="address" value={formData.address} onChange={onChange} required placeholder="e.g. Marina Beach" />
                        </div>
                    </div>
                    <div className="flex gap-4 mb-2">
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Date</label>
                            <input type="date" name="date" value={formData.date} onChange={onChange} required />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Time</label>
                            <input type="time" name="time" value={formData.time} onChange={onChange} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Organizer Contact</label>
                        <input type="text" name="organizer" value={formData.organizer} onChange={onChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Submit Event Request</button>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;
