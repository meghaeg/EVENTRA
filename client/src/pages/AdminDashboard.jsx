import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminDashboard = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await api.get('/admin/events');
            setEvents(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await api.put(`/admin/events/${id}`, { status });
            // Update local state
            setEvents(events.map(event => event._id === id ? { ...event, status } : event));
        } catch (err) {
            alert('Error updating status');
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <h1 className="mb-2" style={{ color: 'var(--primary)' }}>Admin Dashboard</h1>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'var(--card-bg)', boxShadow: 'var(--shadow-sm)', borderRadius: '12px', overflow: 'hidden' }}>
                <thead style={{ backgroundColor: '#f1f1f1', textAlign: 'left' }}>
                    <tr>
                        <th style={{ padding: '16px' }}>Title</th>
                        <th style={{ padding: '16px' }}>Category</th>
                        <th style={{ padding: '16px' }}>Date</th>
                        <th style={{ padding: '16px' }}>Status</th>
                        <th style={{ padding: '16px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map(event => (
                        <tr key={event._id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                            <td style={{ padding: '16px' }}>{event.title}</td>
                            <td style={{ padding: '16px' }}>{event.category}</td>
                            <td style={{ padding: '16px' }}>{event.date}</td>
                            <td style={{ padding: '16px' }}>
                                <span style={{
                                    padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold',
                                    backgroundColor: event.status === 'approved' ? '#d4edda' : event.status === 'rejected' ? '#f8d7da' : '#fff3cd',
                                    color: event.status === 'approved' ? '#155724' : event.status === 'rejected' ? '#721c24' : '#856404'
                                }}>
                                    {event.status.toUpperCase()}
                                </span>
                            </td>
                            <td style={{ padding: '16px', display: 'flex', gap: '8px' }}>
                                {event.status === 'pending' && (
                                    <>
                                        <button onClick={() => handleStatusChange(event._id, 'approved')} className="btn" style={{ padding: '6px 12px', backgroundColor: '#28a745', color: '#fff' }}>Approve</button>
                                        <button onClick={() => handleStatusChange(event._id, 'rejected')} className="btn" style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: '#fff' }}>Reject</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
