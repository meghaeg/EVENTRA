import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="flex justify-between items-center" style={{ height: '70px', width: '100%', padding: '0 40px' }}>
                <Link to="/" className="navbar-brand">
                    <MapPin size={28} color="var(--primary)" />
                    EVENTRA
                </Link>
                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/explore" className="nav-link">Explore Events</Link>
                    {user ? (
                        <>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="nav-link">Admin Dashboard</Link>
                            )}
                            {user.role === 'user' && (
                                <>
                                    <Link to="/my-events" className="nav-link">My Events</Link>
                                    <Link to="/create-event" className="btn btn-primary">Create Event</Link>
                                </>
                            )}
                            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '6px 16px' }}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="btn btn-primary">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
