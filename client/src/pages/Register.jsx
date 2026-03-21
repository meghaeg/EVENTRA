import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
        interests: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const { name, email, password, role, interests } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        const data = {
            ...formData,
            interests: interests.split(',').map(i => i.trim()),
        };

        // Get location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    data.location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    const res = await register(data);
                    if (res.success) navigate('/dashboard');
                    else setError(res.error);
                },
                async () => {
                    const res = await register(data);
                    if (res.success) navigate('/dashboard');
                    else setError(res.error);
                }
            );
        } else {
            const res = await register(data);
            if (res.success) navigate('/dashboard');
            else setError(res.error);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '500px', marginTop: '60px', marginBottom: '60px' }}>
            <div className="card login-card-custom" style={{ padding: '40px 32px' }}>
                <h2 className="text-center mb-2" style={{ color: 'var(--primary)', fontWeight: 700 }}>Create an Account</h2>
                {error && <div style={{ color: 'white', backgroundColor: '#e74c3c', padding: '10px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center', fontWeight: '500' }}>{error}</div>}
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" name="name" value={name} onChange={onChange} required placeholder="Jane Doe" />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" value={email} onChange={onChange} required placeholder="user@gmail.com" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={password} onChange={onChange} required minLength="6" placeholder="••••••••" />
                    </div>
                    <div className="form-group">
                        <label>Interests (comma separated)</label>
                        <input type="text" name="interests" value={interests} onChange={onChange} placeholder="Sports, Music, Tech" />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1.05rem', marginTop: '10px' }}>Register</button>
                </form>
                <p className="text-center mt-3" style={{ color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--secondary)', fontWeight: '600' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
