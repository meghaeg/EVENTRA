import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './Home.css'; // The new CSS file we just created

const Home = () => {
    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchLocation, setSearchLocation] = useState('');
    const [activeCategory, setActiveCategory] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch real events for UI
        const fetchEvents = async () => {
            try {
                const res = await api.get('/events');
                setEvents(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchEvents();

        // Cursor Logic
        const cursor = document.getElementById('cursor');
        const ring = document.getElementById('cursorRing');
        let mx = 0, my = 0, rx = 0, ry = 0;

        const onMouseMove = e => {
            mx = e.clientX;
            my = e.clientY;
            if (cursor) {
                cursor.style.left = mx + 'px';
                cursor.style.top = my + 'px';
            }
        };
        document.addEventListener('mousemove', onMouseMove);

        let req;
        const animRing = () => {
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            if (ring) {
                ring.style.left = rx + 'px';
                ring.style.top = ry + 'px';
            }
            req = requestAnimationFrame(animRing);
        };
        animRing();

        // Hover effects for cursor
        const hoverElements = document.querySelectorAll('a, button, .event-card-item, .h-card-item, .feature-card, .testimonial-card, .cat-pill, .map-pin, .event-fav');
        const hoverEnterPhase = () => {
            if (cursor) { cursor.style.width = '20px'; cursor.style.height = '20px'; }
            if (ring) { ring.style.width = '52px'; ring.style.height = '52px'; }
        };
        const hoverLeavePhase = () => {
            if (cursor) { cursor.style.width = '12px'; cursor.style.height = '12px'; }
            if (ring) { ring.style.width = '36px'; ring.style.height = '36px'; }
        };
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', hoverEnterPhase);
            el.addEventListener('mouseleave', hoverLeavePhase);
        });

        // Intersection Observer for Reveal
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
        }, { threshold: 0.12 });
        const revealEls = document.querySelectorAll('.reveal');
        revealEls.forEach(el => obs.observe(el));

        // Parallax logic
        const onScroll = () => {
            const sy = window.scrollY;
            const grid = document.querySelector('.hero-grid');
            if (grid) grid.style.transform = `translateY(${sy * 0.3}px)`;
            const heroVisual = document.querySelector('.hero-visual');
            if (heroVisual) heroVisual.style.transform = `translateY(calc(-50% + ${sy * 0.15}px))`;
        };
        window.addEventListener('scroll', onScroll);

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(req);
            hoverElements.forEach(el => {
                el.removeEventListener('mouseenter', hoverEnterPhase);
                el.removeEventListener('mouseleave', hoverLeavePhase);
            });
            revealEls.forEach(el => obs.unobserve(el));
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    const handleSearch = () => {
        navigate('/explore'); // Standard action for landing search for now
    };

    // Derived Dynamic Data
    const featuredEvents = events; // All database events
    const trendingEvents = events.slice(2, 8); // A different slice for horizontal bar

    // Helper funcs for cards
    const getGradientClass = (category) => {
        const lower = category?.toLowerCase() || '';
        if (lower.includes('music')) return 'img-music';
        if (lower.includes('tech') || lower.includes('edu')) return 'img-tech';
        if (lower.includes('food')) return 'img-food';
        if (lower.includes('art') || lower.includes('cult')) return 'img-art';
        if (lower.includes('sport')) return 'img-sport';
        if (lower.includes('workshop')) return 'img-comedy';
        return 'img-music';
    };

    const getIcon = (category) => {
        const lower = category?.toLowerCase() || '';
        if (lower.includes('music')) return '🎸';
        if (lower.includes('tech')) return '💻';
        if (lower.includes('food')) return '🍜';
        if (lower.includes('art')) return '🎨';
        if (lower.includes('sport')) return '⚽';
        if (lower.includes('workshop')) return '🛠';
        return '🎫';
    };

    const categories = ["🎵 Music", "💻 Tech", "🍽 Food & Drink", "🎨 Art & Culture", "⚽ Sports", "😂 Comedy", "🧘 Wellness", "🎭 Theater"];

    return (
        <div className="landing-wrapper">
            <div className="landing-cursor" id="cursor"></div>
            <div className="landing-cursor-ring" id="cursorRing"></div>

            {/* HERO */}
            <section className="landing-hero" id="home">
                <div className="hero-bg"></div>
                <div className="hero-grid"></div>

                {/* LEFT — Text Content */}
                <div className="hero-content">
                    <div className="hero-badge"><span></span> Your City, Your Events</div>
                    <h1 className="hero-h1">
                        Discover<br />
                        <em>Local</em><br />
                        Events
                    </h1>
                    <p className="hero-sub">
                        Find the best concerts, food fests, tech meetups &amp; hidden gems happening around you — all in one beautiful place.
                    </p>
                    <div className="hero-actions">
                        <Link to="/explore" className="btn-primary">
                            Explore Events <span>→</span>
                        </Link>
                        <Link to="/create-event" className="hero-secondary-btn">
                            Host an Event
                        </Link>
                    </div>
                    <div className="hero-stats">
                        <div className="hero-stat">
                            <strong>12K+</strong><span>Events</span>
                        </div>
                        <div className="hero-stat-divider" />
                        <div className="hero-stat">
                            <strong>2.4M</strong><span>Users</span>
                        </div>
                        <div className="hero-stat-divider" />
                        <div className="hero-stat">
                            <strong>50+</strong><span>Cities</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT — Full cards column: banner on top + deco + event cards below */}
                <div className="hero-cards-section">


                    {/* BOTTOM ROW: decorative vertical + tall card + stacked small cards */}
                    <div className="hc-lower-row">

                        {/* Left decorative vertical image */}
                        <div className="hc-deco">
                            <img src="/hero_deco.png" alt="Event vibes" />
                            <div className="hc-gradient" />
                        </div>

                        {/* Tall card */}
                        <div className="hc-tall">
                            <img
                                src="https://i.pinimg.com/736x/28/d9/d7/28d9d7f1524f3352162813c1d087c0d1.jpg"
                                alt="Live Music Festival"
                            />
                            <div className="hc-gradient" />
                            <div className="hc-top-badge">🔴 LIVE</div>
                            <div className="hc-overlay-text">
                                <span className="hc-cat">🎵 Music</span>
                                <h3 className="hc-title">HipHop Tamizha Concert</h3>
                                <p className="hc-loc">📍 Central Park, Chennai</p>
                                <span className="hc-price">₹499</span>
                            </div>
                        </div>

                        {/* Two smaller stacked cards */}
                        <div className="hc-small-stack">
                            <div className="hc-small">
                                <img
                                    src="https://images.unsplash.com/photo-1641873933980-fcff60026f50?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    alt="Street Food Carnival"
                                />
                                <div className="hc-gradient" />
                                <div className="hc-overlay-text">
                                    <span className="hc-cat food">🍽 Food</span>
                                    <h3 className="hc-title">Street Food Carnival</h3>
                                    <p className="hc-loc">📍 Heritage Square</p>
                                    <span className="hc-price free">FREE</span>
                                </div>
                            </div>
                            <div className="hc-small">
                                <img
                                    src="https://images.unsplash.com/photo-1667413443984-398360029b06?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGluZGlhJTIwZmluYWxzfGVufDB8fDB8fHww"
                                    alt="DevFest Tech Event"
                                />
                                <div className="hc-gradient" />
                                <div className="hc-overlay-text">
                                    <span className="hc-cat tech">🚀 Culture</span>
                                    <h3 className="hc-title">DevFest 2026</h3>
                                    <p className="hc-loc">📍 Trissur, Kerala</p>
                                    <span className="hc-price">₹199</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS BAR */}
            <div className="stats-bar">
                <div className="stats-scroll">
                    <span>🎉 <strong>12,000+</strong> Events Listed</span>
                    <span className="sep">✦</span>
                    <span>📍 <strong>50+</strong> Cities</span>
                    <span className="sep">✦</span>
                    <span>👥 <strong>2.4M+</strong> Users</span>
                    <span className="sep">✦</span>
                    <span>⭐ <strong>4.9</strong> App Rating</span>
                    <span className="sep">✦</span>
                    <span>🎫 <strong>800K+</strong> Tickets Sold</span>
                    <span className="sep">✦</span>
                    <span>🎉 <strong>12,000+</strong> Events Listed</span>
                    <span className="sep">✦</span>
                    <span>📍 <strong>50+</strong> Cities</span>
                    <span className="sep">✦</span>
                    <span>👥 <strong>2.4M+</strong> Users</span>
                    <span className="sep">✦</span>
                    <span>⭐ <strong>4.9</strong> App Rating</span>
                    <span className="sep">✦</span>
                    <span>🎫 <strong>800K+</strong> Tickets Sold</span>
                </div>
            </div>

            {/* MAP TEASER */}
            <section className="map-teaser-section reveal" id="map">
                <div>
                    <div className="section-label">Find Nearby</div>
                    <h2 className="section-title">Events on<br />your doorstep</h2>
                    <p style={{ fontSize: '1rem', color: '#666', lineHeight: '1.7', marginBottom: '32px', maxWidth: '460px' }}>
                        Browse an interactive local map and discover events happening just blocks away. Filter by date, type, and distance.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '600' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--coral)' }}></div> Music
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '600' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--violet)' }}></div> Tech
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '600' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--mint)' }}></div> Food
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '600' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--amber)' }}></div> Art
                        </div>
                    </div>
                    <Link to="/explore" className="btn-primary" style={{ display: 'inline-flex', background: 'var(--coral)', color: 'white', padding: '16px 36px', borderRadius: '100px', fontWeight: '700', textDecoration: 'none' }}>Open Full Map →</Link>
                </div>
                <div className="map-visual">
                    <div className="map-bg">
                        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} viewBox="0 0 500 500">
                            <line x1="0" y1="125" x2="500" y2="125" className="map-grid-line" strokeWidth="3" />
                            <line x1="0" y1="250" x2="500" y2="250" className="map-grid-line" strokeWidth="5" />
                            <line x1="0" y1="375" x2="500" y2="375" className="map-grid-line" strokeWidth="3" />
                            <line x1="125" y1="0" x2="125" y2="500" className="map-grid-line" strokeWidth="3" />
                            <line x1="250" y1="0" x2="250" y2="500" className="map-grid-line" strokeWidth="5" />
                            <line x1="375" y1="0" x2="375" y2="500" className="map-grid-line" strokeWidth="3" />
                            <line x1="0" y1="500" x2="500" y2="0" className="map-grid-line" strokeWidth="2" strokeDasharray="10,10" />
                            <rect x="130" y="130" width="115" height="115" rx="8" fill="rgba(123,92,245,0.06)" stroke="rgba(123,92,245,0.1)" strokeWidth="1" />
                            <rect x="255" y="130" width="115" height="115" rx="8" fill="rgba(0,212,164,0.06)" stroke="rgba(0,212,164,0.1)" strokeWidth="1" />
                            <rect x="130" y="255" width="115" height="115" rx="8" fill="rgba(255,92,58,0.06)" stroke="rgba(255,92,58,0.1)" strokeWidth="1" />
                            <rect x="255" y="255" width="115" height="115" rx="8" fill="rgba(255,182,39,0.06)" stroke="rgba(255,182,39,0.1)" strokeWidth="1" />
                            <circle cx="62" cy="62" r="40" fill="rgba(0,200,100,0.12)" stroke="rgba(0,200,100,0.2)" strokeWidth="1" />
                            <circle cx="438" cy="438" r="30" fill="rgba(0,200,100,0.10)" stroke="rgba(0,200,100,0.15)" strokeWidth="1" />
                        </svg>
                        <div className="map-pin" style={{ left: '47%', top: '45%' }}><div className="pin-dot"></div><div className="pin-tooltip">🎸 Indie Fest</div></div>
                        <div className="map-pin" style={{ left: '65%', top: '30%' }}><div className="pin-dot violet"></div><div className="pin-tooltip">💻 DevFest '26</div></div>
                        <div className="map-pin" style={{ left: '30%', top: '60%' }}><div className="pin-dot mint"></div><div className="pin-tooltip">🍜 Food Carnival</div></div>
                        <div className="map-pin" style={{ left: '70%', top: '65%' }}><div className="pin-dot amber"></div><div className="pin-tooltip">🎨 Neon Art Show</div></div>
                        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 4px rgba(123,92,245,0.3), 0 0 0 8px rgba(123,92,245,0.1)' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--violet)' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="features-section" id="features">
                <div className="section-label reveal">Why Eventra</div>
                <h2 className="section-title reveal" style={{ maxWidth: '500px' }}>Everything you need<br />to never miss out</h2>
                <div className="features-grid">
                    <div className="feature-card reveal reveal-delay-1">
                        <div className="feature-icon fi-coral">📍</div>
                        <div className="feature-title">Hyper-Local Discovery</div>
                        <div className="feature-desc">Find events happening within walking distance using smart GPS. Filter by distance, neighborhood, or landmark.</div>
                    </div>
                    <div className="feature-card reveal reveal-delay-2">
                        <div className="feature-icon fi-violet">🤖</div>
                        <div className="feature-title">AI-Powered Picks</div>
                        <div className="feature-desc">Our algorithm learns your taste over time and curates a personalized feed of events you'll actually love.</div>
                    </div>
                    <div className="feature-card reveal reveal-delay-3">
                        <div className="feature-icon fi-mint">🎫</div>
                        <div className="feature-title">Instant Booking</div>
                        <div className="feature-desc">Book tickets in seconds. QR code on your phone. No printing, no hassle — just show up and enjoy.</div>
                    </div>
                    <div className="feature-card reveal reveal-delay-1">
                        <div className="feature-icon fi-coral">👥</div>
                        <div className="feature-title">Go With Friends</div>
                        <div className="feature-desc">See which events your friends are attending. Plan together, split costs, and never go alone.</div>
                    </div>
                    <div className="feature-card reveal reveal-delay-2">
                        <div className="feature-icon fi-violet">🔔</div>
                        <div className="feature-title">Smart Reminders</div>
                        <div className="feature-desc">Get notified before your events sell out, or when a new event in your favorite category drops nearby.</div>
                    </div>
                    <div className="feature-card reveal reveal-delay-3">
                        <div className="feature-icon fi-mint">🌐</div>
                        <div className="feature-title">For Organizers Too</div>
                        <div className="feature-desc">Create, promote and sell tickets for your own event in minutes. Reach thousands of local people instantly.</div>
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="testimonials-section reveal" id="testimonials">
                <div className="section-label">Word on the Street</div>
                <h2 className="section-title">People love Eventra</h2>
                <div className="testimonials-track">
                    <div className="testimonial-card">
                        <div className="quote-mark">"</div>
                        <div className="stars">★★★★★</div>
                        <p className="testimonial-text">Eventra completely changed how I spend my weekends. Found a rooftop jazz night 10 minutes from my apartment that I never knew existed!</p>
                        <div className="testimonial-author">
                            <div className="author-av av-a">R</div>
                            <div><div className="author-name">Riya Mehta</div><div className="author-loc">📍 Mumbai</div></div>
                        </div>
                    </div>
                    <div className="testimonial-card">
                        <div className="quote-mark">"</div>
                        <div className="stars">★★★★★</div>
                        <p className="testimonial-text">As an event organizer, this platform is magic. I promoted a small workshop and got 200 registrations within 48 hours. Incredible reach!</p>
                        <div className="testimonial-author">
                            <div className="author-av av-b">P</div>
                            <div><div className="author-name">Prakash Iyer</div><div className="author-loc">📍 Chennai</div></div>
                        </div>
                    </div>
                    <div className="testimonial-card">
                        <div className="quote-mark">"</div>
                        <div className="stars">★★★★★</div>
                        <p className="testimonial-text">The map feature is brilliant. I scroll through it every morning and always find something fun nearby. It's my daily routine now.</p>
                        <div className="testimonial-author">
                            <div className="author-av av-c">K</div>
                            <div><div className="author-name">Kavya Singh</div><div className="author-loc">📍 Bangalore</div></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <div className="cta-section reveal" id="contact">
                <div className="cta-bg"></div>
                <div className="cta-content">
                    <div className="cta-badge">🎉 Join 2.4 Million People</div>
                    <h2 className="cta-title">Your next favorite<br /><span>memory</span> is nearby</h2>
                    <p className="cta-sub">Stop scrolling. Start experiencing. Discover events that make you say "I was actually there."</p>
                    <div className="cta-actions">
                        <Link to="/register" className="btn-white">Join Eventra Now</Link>
                        <Link to="/explore" className="btn-ghost">Browse Web App →</Link>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="landing-footer">
                <div className="footer-grid">
                    <div>
                        <div className="footer-brand-name">
                            <span style={{ color: 'var(--coral)' }}>•</span> EVENTRA
                        </div>
                        <p className="footer-desc">Your local hub for discovering incredible events, hidden gems, and unforgettable experiences — wherever you are.</p>
                        <div className="footer-social">
                            <span className="soc-btn">𝕏</span>
                            <span className="soc-btn">in</span>
                            <span className="soc-btn">ig</span>
                        </div>
                    </div>
                    <div>
                        <div className="footer-col-title">Discover</div>
                        <ul className="footer-links">
                            <li><Link to="/explore">Browse Events</Link></li>
                            <li><Link to="/explore">Events Near Me</Link></li>
                            <li><Link to="/login">Login</Link></li>
                        </ul>
                    </div>
                    <div>
                        <div className="footer-col-title">Organize</div>
                        <ul className="footer-links">
                            <li><Link to="/create-event">Create Event</Link></li>
                            <li><Link to="/dashboard">Dashboard</Link></li>
                        </ul>
                    </div>
                    <div>
                        <div className="footer-col-title">Company</div>
                        <ul className="footer-links">
                            <li><Link to="/">About Us</Link></li>
                            <li><Link to="/">Contact</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="footer-copy">© 2026 Eventra — LocalHub Event Finder. All rights reserved.</div>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem', cursor: 'pointer' }}>Privacy Policy</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
