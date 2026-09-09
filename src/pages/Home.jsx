import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../services/api';

const categoryIcons = {
  'Makeup Artists': '💄', 'Mehndi Artists': '🌿', 'Decorators': '🎀',
  'Caterers': '🍽️', 'Photographers': '📸', 'Videographers': '🎬',
  'DJs': '🎧', 'Singers': '🎤', 'Dancers': '💃', 'Anchors': '🎙️',
  'Wedding Planners': '💍', 'Event Organizers': '📋',
};

const categoryGradients = {
  'Makeup Artists': 'linear-gradient(135deg, #ec4899, #f43f5e)',
  'Mehndi Artists': 'linear-gradient(135deg, #f59e0b, #d97706)',
  'Decorators': 'linear-gradient(135deg, #10b981, #059669)',
  'Caterers': 'linear-gradient(135deg, #ef4444, #dc2626)',
  'Photographers': 'linear-gradient(135deg, #3b82f6, #2563eb)',
  'Videographers': 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  'DJs': 'linear-gradient(135deg, #a855f7, #9333ea)',
  'Singers': 'linear-gradient(135deg, #f43f5e, #e11d48)',
  'Dancers': 'linear-gradient(135deg, #fb7185, #e11d48)',
  'Anchors': 'linear-gradient(135deg, #06b6d4, #0891b2)',
  'Wedding Planners': 'linear-gradient(135deg, #ec4899, #8b5cf6)',
  'Event Organizers': 'linear-gradient(135deg, #6366f1, #4f46e5)',
};

const Home = () => {
  const navigate = useNavigate();
  const [locationSearch, setLocationSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [keywordSearch, setKeywordSearch] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState([]);
  const [featuredArtists, setFeaturedArtists] = useState([]);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationToast, setLocationToast] = useState('');

  const quickCities = ['Delhi', 'Mumbai', 'Bangalore', 'Jaipur', 'Chandigarh', 'Hyderabad', 'Pune', 'Kolkata'];

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1800&auto=format&fit=crop',
      title: 'Book Verified Event Professionals with AI Trust Guarantee',
      subtitle: 'Connect directly with top bridal makeup artists, wedding decorators, DJs, photographers & caterers.'
    },
    {
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1800&auto=format&fit=crop',
      title: 'Flawless Celebrations, Backed by DigiLocker Security',
      subtitle: 'Compare transparent prices, inspect certified qualifications, and lock booking dates securely.'
    },
    {
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1800&auto=format&fit=crop',
      title: 'Where Creative Talents Meet Grand Celebrations',
      subtitle: 'Thousands of verified artists ready to turn your weddings, summits, and parties into lifelong memories.'
    }
  ];

  useEffect(() => {
    loadCategories();
    loadFeaturedArtists();
    const saved = localStorage.getItem('userCity');
    if (saved && saved !== 'Unknown') {
      setLocationSearch(saved);
    }
  }, []);

  const loadCategories = async () => {
    try {
      const cats = await api.getCategories();
      setCategories(cats || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadFeaturedArtists = async () => {
    try {
      setLoadingArtists(true);
      const services = await api.getServices();
      setFeaturedArtists(services?.slice(0, 6) || []);
    } catch (error) {
      console.error('Error loading featured artists:', error);
    } finally {
      setLoadingArtists(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const detectUserCity = async () => {
    setDetectingLocation(true);
    setLocationToast('Detecting your location...');

    const fallbackToIp = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        const city = data.city || data.region || 'Delhi';
        setLocationSearch(city);
        localStorage.setItem('userCity', city);
        setLocationToast(`📍 Located: ${city}, ${data.region || 'India'}`);
        setTimeout(() => setLocationToast(''), 4000);
      } catch {
        try {
          const res2 = await fetch('https://ipwhois.app/json/');
          const data2 = await res2.json();
          const city2 = data2.city || 'Delhi';
          setLocationSearch(city2);
          localStorage.setItem('userCity', city2);
          setLocationToast(`📍 Located: ${city2}`);
          setTimeout(() => setLocationToast(''), 4000);
        } catch {
          setLocationSearch('Delhi');
          setLocationToast('📍 Set to default: Delhi NCR');
          setTimeout(() => setLocationToast(''), 4000);
        }
      } finally {
        setDetectingLocation(false);
      }
    };

    if (!navigator.geolocation) {
      await fallbackToIp();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          let city = '';
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            city = data.city || data.locality || data.principalSubdivision || '';
          } catch {
            const resNom = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const dataNom = await resNom.json();
            const addr = dataNom.address || {};
            city = addr.city || addr.town || addr.village || addr.county || addr.state || '';
          }

          if (city) {
            const tricity = ['pinjore', 'panchkula', 'mohali', 'tricity'];
            if (tricity.some(m => city.toLowerCase().includes(m))) {
              city = 'Chandigarh';
            }
            setLocationSearch(city);
            localStorage.setItem('userCity', city);
            setLocationToast(`📍 Located: ${city}`);
            setTimeout(() => setLocationToast(''), 4000);
            setDetectingLocation(false);
          } else {
            await fallbackToIp();
          }
        } catch {
          await fallbackToIp();
        }
      },
      async () => {
        await fallbackToIp();
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (keywordSearch.trim()) params.append('search', keywordSearch.trim());
    if (categorySearch) params.append('category', categorySearch);
    if (locationSearch.trim()) params.append('location', locationSearch.trim());
    navigate(`/browse?${params.toString()}`);
  };

  return (
    <div className="home-page" style={{ background: '#f8fafc', overflowX: 'hidden' }}>
      {/* ── 1. CINEMATIC HERO SECTION ── */}
      <section style={{ position: 'relative', minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {/* Slides Background */}
        {slides.map((slide, index) => (
          <div
            key={index}
            style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              opacity: index === currentSlide ? 1 : 0,
              transition: 'opacity 1.2s ease-in-out',
              transform: index === currentSlide ? 'scale(1.02)' : 'scale(1)',
              transitionDuration: '1.2s'
            }}
          />
        ))}

        {/* Dark Luxury Gradient Overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.75) 50%, rgba(15,23,42,0.95) 100%)',
        }} />

        {/* Hero Content */}
        <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '100px 20px 60px', maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* Trust Floating Pills */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 18px', borderRadius: '30px', color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 700, marginBottom: '24px' }}>
            <span style={{ color: '#10b981' }}>●</span> India&apos;s #1 AI & DigiLocker Verified Talent Platform
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 900, color: '#ffffff',
            lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '18px',
            textShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}>
            {slides[currentSlide].title}
          </h1>

          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: '#cbd5e1',
            maxWidth: '750px', margin: '0 auto 36px', lineHeight: 1.6,
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}>
            {slides[currentSlide].subtitle}
          </p>

          {/* Master Glassmorphic Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '12px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255,255,255,0.2)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) auto',
              gap: '12px',
              alignItems: 'center',
              maxWidth: '960px',
              margin: '0 auto 20px'
            }}
          >
            {/* Category Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '1.2rem' }}>🎭</span>
              <select
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontWeight: 600, color: '#1e293b', fontSize: '0.92rem', cursor: 'pointer' }}
              >
                <option value="">All Talent Categories</option>
                {categories.map((c) => (
                  <option key={c._id || c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Keyword Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <i className="fas fa-search" style={{ color: '#64748b' }}></i>
              <input
                type="text"
                placeholder="Artist name, service, style..."
                value={keywordSearch}
                onChange={(e) => setKeywordSearch(e.target.value)}
                style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontWeight: 600, color: '#1e293b', fontSize: '0.92rem' }}
              />
            </div>

            {/* Location with Auto-Detect Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', position: 'relative' }}>
              <i className="fas fa-map-marker-alt" style={{ color: '#ef4444' }}></i>
              <input
                type="text"
                placeholder="City (e.g. Delhi, Mumbai)"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontWeight: 600, color: '#1e293b', fontSize: '0.92rem' }}
              />
              <button
                type="button"
                onClick={detectUserCity}
                disabled={detectingLocation}
                title="Detect My Current Location"
                style={{
                  background: 'none', border: 'none', color: '#6366f1',
                  cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800,
                  whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px'
                }}
              >
                {detectingLocation ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-crosshairs"></i>}
                {detectingLocation ? 'Locating...' : 'Detect'}
              </button>
            </div>

            {/* Search CTA */}
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: 'white', border: 'none', borderRadius: '16px',
                padding: '14px 28px', fontWeight: 800, fontSize: '1rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.5)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span>Explore Talents</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          </form>

          {/* Location Toast feedback */}
          {locationToast && (
            <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.9rem', marginBottom: '14px', textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
              {locationToast}
            </div>
          )}

          {/* Quick City Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Popular Cities:</span>
            {quickCities.map((city) => (
              <button
                key={city}
                onClick={() => {
                  setLocationSearch(city);
                  localStorage.setItem('userCity', city);
                  navigate(`/browse?location=${encodeURIComponent(city)}`);
                }}
                style={{
                  background: locationSearch.toLowerCase() === city.toLowerCase() ? '#6366f1' : 'rgba(255, 255, 255, 0.12)',
                  color: 'white', border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '20px', padding: '5px 14px', fontSize: '0.8rem',
                  fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease',
                  backdropFilter: 'blur(8px)'
                }}
              >
                {city}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ── 2. VALUE PROPOSITION STATS BAR ── */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '24px 0' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                <i className="fas fa-shield-alt"></i>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem' }}>AI & DigiLocker Verified</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Every artist identity & certificate checked</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99,102,241,0.1)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                <i className="fas fa-lock"></i>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem' }}>Escrow Protected Booking</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Funds released only after satisfaction</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                <i className="fas fa-star"></i>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem' }}>4.9/5 Rating Standard</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Over 20,000+ happy event bookings</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. VISUAL CATEGORIES SECTION ── */}
      <section style={{ padding: '80px 0 60px' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ color: '#6366f1', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Curated Specializations
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', marginTop: '8px' }}>
              Explore Top Event Categories
            </h2>
            <p style={{ color: '#64748b', maxWidth: '600px', margin: '8px auto 0', fontSize: '1rem' }}>
              Discover accredited talent for weddings, birthdays, corporate summits, and intimate concerts.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
            gap: '16px'
          }}>
            {Object.keys(categoryIcons).map((catName) => {
              const icon = categoryIcons[catName] || '🎭';
              const gradient = categoryGradients[catName] || 'linear-gradient(135deg, #6366f1, #4f46e5)';

              return (
                <div
                  key={catName}
                  onClick={() => navigate(`/browse?category=${encodeURIComponent(catName)}`)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '24px 16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 15px 30px -5px rgba(99, 102, 241, 0.15)';
                    e.currentTarget.style.borderColor = '#6366f1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    background: gradient, color: 'white', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem',
                    margin: '0 auto 12px', boxShadow: '0 6px 15px rgba(0,0,0,0.12)'
                  }}>
                    {icon}
                  </div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                    {catName}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#6366f1', fontWeight: 700 }}>
                    Browse Experts →
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. FEATURED VERIFIED ARTISTS SPOTLIGHT ── */}
      <section style={{ padding: '60px 0 80px', background: '#f1f5f9' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ color: '#10b981', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                ⭐ Highest Rated Talent
              </span>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>
                Featured Verified Artists
              </h2>
            </div>
            <Link
              to="/browse"
              style={{
                color: '#4f46e5', fontWeight: 800, fontSize: '0.95rem',
                display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none'
              }}
            >
              View All 100+ Artists <i className="fas fa-arrow-right"></i>
            </Link>
          </div>

          {loadingArtists ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ width: '40px', height: '40px', border: '4px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
              <p style={{ color: '#64748b', fontWeight: 600 }}>Loading verified partners...</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {featuredArtists.map((artist) => (
                <div
                  key={artist._id}
                  onClick={() => navigate(`/events/${artist._id}`)}
                  style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(99, 102, 241, 0.15)';
                    e.currentTarget.style.borderColor = '#6366f1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  <div style={{ position: 'relative', height: '200px' }}>
                    <img
                      src={artist.image}
                      alt={artist.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                      <span style={{ background: '#10b981', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <i className="fas fa-shield-check"></i> Verified
                      </span>
                      {artist.digilockerVerified && (
                        <span style={{ background: '#0b3954', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 800 }}>
                          🔒 DigiLocker
                        </span>
                      )}
                    </div>
                    <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 }}>
                      ₹{artist.price?.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>{artist.name}</h3>
                      <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: '0.9rem' }}>
                        ★ {artist.rating ? artist.rating.toFixed(1) : '5.0'}
                      </span>
                    </div>
                    <p style={{ color: '#6366f1', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px' }}>
                      {artist.category}
                    </p>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.5', height: '40px', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '14px' }}>
                      {artist.description}
                    </p>

                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>📍 {artist.city || 'India'}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/booking/${artist._id}`);
                        }}
                        style={{
                          background: 'rgba(99,102,241,0.1)', color: '#4f46e5',
                          border: 'none', padding: '6px 14px', borderRadius: '8px',
                          fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer'
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 5. HOW TALENTCONNECT WORKS ── */}
      <section style={{ padding: '80px 0', background: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <span style={{ color: '#6366f1', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Simple 3-Step Process
          </span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', marginTop: '6px', marginBottom: '40px' }}>
            How TalentConnect Works
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            <div style={{ padding: '30px 24px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 900, margin: '0 auto 16px' }}>
                1
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>Discover Verified Talent</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Browse hundreds of professionals with AI verified documents, DigiLocker credentials, and live portfolio pictures.
              </p>
            </div>

            <div style={{ padding: '30px 24px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ec4899', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 900, margin: '0 auto 16px' }}>
                2
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>Book & Customize Package</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Choose standard or custom packages, select event slots, and communicate directly with your preferred artist.
              </p>
            </div>

            <div style={{ padding: '30px 24px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 900, margin: '0 auto 16px' }}>
                3
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>Escrow Protected Delivery</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Enjoy your event with 100% peace of mind. Payments are securely held in escrow and released upon client sign-off.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. TRANSPARENT PRICING PLANS ── */}
      <section id="pricing" style={{ padding: '80px 0', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <span style={{ color: '#6366f1', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Fair & Transparent
          </span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', marginTop: '6px', marginBottom: '12px' }}>
            Simple Platform Pricing
          </h2>
          <p style={{ color: '#64748b', marginBottom: '40px' }}>
            Built to provide total security for clients and maximum profitability for verified partners.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {/* Client Plan */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '40px 30px', textAlign: 'left', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
              <span style={{ background: '#e0e7ff', color: '#4f46e5', fontWeight: 800, fontSize: '0.75rem', padding: '6px 14px', borderRadius: '20px', textTransform: 'uppercase' }}>For Event Clients</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginTop: '16px', marginBottom: '8px' }}>Direct Booking Protection</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>Hire verified talent with 100% money-back escrow protection.</p>
              
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '24px' }}>
                <span style={{ fontSize: '3rem', fontWeight: 900, color: '#0f172a' }}>₹50</span>
                <span style={{ color: '#64748b', fontWeight: 600 }}>/ booking fee</span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '12px', fontSize: '0.9rem', color: '#334155', marginBottom: '30px' }}>
                <li>✓ 100% Escrow Protection</li>
                <li>✓ Direct messaging with artist</li>
                <li>✓ Automated invoice & digital contracts</li>
                <li>✓ Free cancellation support</li>
              </ul>

              <button onClick={() => navigate('/browse')} style={{ width: '100%', padding: '12px', background: '#0f172a', color: 'white', borderRadius: '12px', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
                Browse Talent Listings
              </button>
            </div>

            {/* Artist Partner Plan */}
            <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #0f172a)', border: '1px solid #4338ca', borderRadius: '24px', padding: '40px 30px', textAlign: 'left', color: 'white', boxShadow: '0 20px 40px rgba(99,102,241,0.2)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'linear-gradient(135deg, #ec4899, #f43f5e)', color: 'white', fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: '20px' }}>
                POPULAR
              </div>
              <span style={{ background: 'rgba(99,102,241,0.3)', color: '#a5b4fc', fontWeight: 800, fontSize: '0.75rem', padding: '6px 14px', borderRadius: '20px', textTransform: 'uppercase' }}>For Artist Partners</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginTop: '16px', marginBottom: '8px', color: 'white' }}>Verified Partner Tier</h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '20px' }}>List your service, receive direct client bookings and grow your business.</p>
              
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '24px' }}>
                <span style={{ fontSize: '3rem', fontWeight: 900, color: 'white' }}>0%</span>
                <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Commission on bookings</span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '12px', fontSize: '0.9rem', color: '#e2e8f0', marginBottom: '30px' }}>
                <li>✓ AI & DigiLocker Verified Profile Badge</li>
                <li>✓ Unlimited client leads and booking requests</li>
                <li>✓ Manage calendar & custom packages</li>
                <li>✓ Instant automated payouts</li>
              </ul>

              <button onClick={() => navigate('/login?signup=true')} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', borderRadius: '12px', border: 'none', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}>
                Become an Artist Partner
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. BECOME A PARTNER CTA BANNER ── */}
      <section style={{ padding: '80px 0 100px', background: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5, #9333ea)',
            borderRadius: '28px', padding: '60px 40px', textAlign: 'center', color: 'white',
            boxShadow: '0 20px 50px rgba(79, 70, 229, 0.3)'
          }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '14px' }}>
              Are You a Creative Event Professional?
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#e0e7ff', maxWidth: '650px', margin: '0 auto 30px', lineHeight: '1.6' }}>
              Join thousands of certified artists across India. Get verified in under 2 minutes with AI and DigiLocker, and start receiving direct event bookings.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/login?signup=true')}
                style={{
                  background: 'white', color: '#4f46e5', border: 'none',
                  borderRadius: '16px', padding: '14px 32px', fontWeight: 800,
                  fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}
              >
                Register as Artist Partner
              </button>
              <button
                onClick={() => navigate('/about')}
                style={{
                  background: 'rgba(255,255,255,0.15)', color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)', borderRadius: '16px',
                  padding: '14px 32px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer'
                }}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
