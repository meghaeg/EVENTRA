import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        const res = await login({ email, password });
        if (res.success) {
            navigate('/dashboard');
        } else {
            setError(res.error);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '500px', marginTop: '60px' }}>
            <div className="card login-card-custom" style={{ padding: '40px 32px' }}>
                <h2 className="text-center mb-2" style={{ color: 'var(--primary)', fontWeight: 700 }}>Welcome Back</h2>
                {error && <div style={{ color: 'white', backgroundColor: '#e74c3c', padding: '10px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center', fontWeight: '500' }}>{error}</div>}
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label>Email Address or Username</label>
                        <input type="text" name="email" value={email} onChange={onChange} required placeholder="user@gmail.com or admin" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={password} onChange={onChange} required placeholder="••••••••" />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1.05rem', marginTop: '10px' }}>Login</button>
                </form>
                <p className="text-center mt-3" style={{ color: 'var(--text-muted)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--secondary)', fontWeight: '600' }}>Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
