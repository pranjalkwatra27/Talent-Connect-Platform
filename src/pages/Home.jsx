import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [locationSearch, setLocationSearch] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1800&auto=format&fit=crop',
      title: 'Book Verified Event Professionals with Confidence',
      subtitle: 'Connecting premium talents with every celebration — Makeup artists, caterers, decorators, and planners.'
    },
    {
      image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1800&auto=format&fit=crop',
      title: 'Find, Book & Manage Event Services Easily',
      subtitle: 'Compare prices, check availability in real-time, and process payments securely.'
    },
    {
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1800&auto=format&fit=crop',
      title: 'Where Talent Meets Opportunity',
      subtitle: 'Register your service profile, undergo verification, and grow your events business today.'
    }
  ];

  const [categories, setCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  useEffect(() => {
    loadCategories();
    const saved = localStorage.getItem('userCity');
    if (saved && saved !== 'Unknown') {
      setLocationSearch(saved);
    }
  }, []);

  const loadCategories = async () => {
    try {
      const cats = await api.getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setIsAddingCategory(true);
    try {
      const slug = newCategoryName.trim().toLowerCase().replace(/\s+/g, '-');
      const newCat = await api.createCategory({
        name: newCategoryName.trim(),
        icon: 'sparkles',
        color: '#6366f1',
        slug: slug
      });
      setCategories(prev => [...prev, newCat]);
      setNewCategoryName('');
      setShowAddCategory(false);
      alert('Category added successfully!');
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category');
    } finally {
      setIsAddingCategory(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const detectUserCity = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const addr = data.address || {};
          let city = (addr.city || addr.town || addr.village || addr.county || addr.state || '').trim();
          
          const tricity = ['pinjore', 'panchkula', 'mohali', 'tricity'];
          if (tricity.some(m => city.toLowerCase().includes(m))) {
            city = 'Chandigarh';
          }
          
          if (!city) city = addr.county || addr.state || 'Unknown';
          
          setLocationSearch(city);
          localStorage.setItem('userCity', city);
        } catch (error) {
          console.error('Error detecting location:', error);
          alert('Unable to detect city');
        }
      },
      () => alert('Location permission denied'),
      { timeout: 10000 }
    );
  };

  const searchEvents = () => {
    if (!locationSearch.trim()) {
      navigate(`/browse`);
      return;
    }
    navigate(`/browse?location=${encodeURIComponent(locationSearch)}`);
  };

  return (
    <div className="home-page">
      {/* Hero Carousel */}
      <div className="carousel">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="carousel-content">
              <h1 style={{ textShadow: '0 4px 25px rgba(0,0,0,0.5)' }}>{slide.title}</h1>
              <p style={{ textShadow: '0 3px 15px rgba(0,0,0,0.5)' }}>{slide.subtitle}</p>
            </div>
          </div>
        ))}
        <div className="carousel-dots">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Location Detection Section */}
      <section className="detect-section">
        <div className="container">
          <h2>Find Premium Event Professionals Near You</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder="Find makeup artists, photographers, decorators near you..."
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchEvents()}
            />
            <button className="detect-btn" onClick={detectUserCity}>
              📍 Detect Location
            </button>
            <button className="find-btn" onClick={searchEvents}>
              Find Talents
            </button>
          </div>
        </div>
      </section>



      {/* Pricing Plans Section */}
      <section id="pricing" style={{ padding: '80px 0', background: '#ffffff' }}>
        <div className="container">
          <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '10px', textAlign: 'center' }}>Simple, Transparent Pricing</h2>
          <p className="section-desc" style={{ marginBottom: '50px', textAlign: 'center', color: '#64748b' }}>
            Flexible options built for both customers booking events and professional partners.
          </p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '30px',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {/* Plan 1: Customer Booking Fee */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '40px 30px',
              width: '100%',
              maxWidth: '440px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              <div>
                <span style={{ background: '#e0e7ff', color: 'var(--primary)', fontWeight: '700', fontSize: '12px', padding: '6px 12px', borderRadius: '20px', textTransform: 'uppercase' }}>For Clients</span>
                <h3 style={{ fontSize: '24px', fontWeight: '800', marginTop: '16px', marginBottom: '8px' }}>Book Services</h3>
                <p style={{ color: '#64748b', fontSize: '14px' }}>Hire verified decorators, makeup artists, photographers and pay securely.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '42px', fontWeight: '900', color: '#0f172a' }}>₹50</span>
                <span style={{ color: '#64748b', fontWeight: '600' }}>/ platform booking fee</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', color: '#334155', fontSize: '14px' }}>
                <li><i className="fas fa-check-circle" style={{ color: '#10b981', marginRight: '8px' }}></i> Browse & compare profiles for free</li>
                <li><i className="fas fa-check-circle" style={{ color: '#10b981', marginRight: '8px' }}></i> 100% secure advance payments via Razorpay</li>
                <li><i className="fas fa-check-circle" style={{ color: '#10b981', marginRight: '8px' }}></i> Free cancellations up to 48 hours prior</li>
                <li><i className="fas fa-check-circle" style={{ color: '#10b981', marginRight: '8px' }}></i> Verified work portfolios and review ratings</li>
              </ul>
              <Link to="/browse" className="btn btn-primary" style={{ marginTop: 'auto', padding: '14px' }}>Explore Talent</Link>
            </div>

            {/* Plan 2: Partner Verification Plan */}
            <div style={{
              background: '#ffffff',
              border: '2px solid var(--primary)',
              borderRadius: '20px',
              padding: '40px 30px',
              width: '100%',
              maxWidth: '440px',
              boxShadow: '0 10px 30px rgba(79, 70, 229, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              position: 'relative'
            }}>
              <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--primary)', color: 'white', fontWeight: '700', fontSize: '11px', padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase' }}>Most Popular</div>
              <div>
                <span style={{ background: '#fef08a', color: '#a16207', fontWeight: '700', fontSize: '12px', padding: '6px 12px', borderRadius: '20px', textTransform: 'uppercase' }}>For Professionals</span>
                <h3 style={{ fontSize: '24px', fontWeight: '800', marginTop: '16px', marginBottom: '8px' }}>Verification Badge</h3>
                <p style={{ color: '#64748b', fontSize: '14px' }}>Undergo proper verification, gain customer trust, and unlock bookings.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '42px', fontWeight: '900', color: '#0f172a' }}>₹499</span>
                <span style={{ color: '#64748b', fontWeight: '600' }}>/ one-time setup fee</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', color: '#334155', fontSize: '14px' }}>
                <li><i className="fas fa-check-circle" style={{ color: '#10b981', marginRight: '8px' }}></i> Green **Verified Partner Badge** on profile</li>
                <li><i className="fas fa-check-circle" style={{ color: '#10b981', marginRight: '8px' }}></i> Top-of-search placement priority</li>
                <li><i className="fas fa-check-circle" style={{ color: '#10b981', marginRight: '8px' }}></i> Unlock client booking slots & direct messages</li>
                <li><i className="fas fa-check-circle" style={{ color: '#10b981', marginRight: '8px' }}></i> Grow business with verified listings & analytics</li>
              </ul>
              <Link to="/login?signup=true" className="btn btn-primary" style={{ marginTop: 'auto', padding: '14px', background: 'var(--gradient-brand)' }}>Register as Partner</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ background: '#f8fafc', padding: '80px 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Everything You Need to Book & Register <span style={{ color: 'var(--primary)' }}>Talents</span></h2>
          <p className="section-desc" style={{ textAlign: 'center', color: '#64748b', marginBottom: '50px' }}>
            Whether you are booking a photographer or listing your wedding planning profile, we've got you covered with intuitive tools and seamless experiences.
          </p>
          <div className="AboutUs-grid">
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Easy Service Registration</h3>
              <p>Create and list your service details in minutes with our profile builder.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Proper Verification</h3>
              <p>Our talents undergo proper verification checks to build trust and security.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Reach Local Clients</h3>
              <p>Connect with thousands of potential customers in your local area looking for services.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Booking Protection</h3>
              <p>Both talents and clients are protected with our robust booking guarantee.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Secure Payments</h3>
              <p>We process all payments securely via Razorpay, so you can focus on your work.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Service Booking</h3>
              <p>Clients can select a date, book, and secure talent instantly with a few clicks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>How <span style={{ color: 'var(--primary)' }}>It Works</span></h2>
          <p className="section-desc" style={{ textAlign: 'center', color: '#64748b', marginBottom: '50px' }}>Simple steps to find and book the perfect talent for your needs</p>
          <div className="steps">
            <div className="step">
              <div className="step-icon">🔍</div>
              <h3>1. Search</h3>
              <p>Browse local talents by category (makeup, mehndi, photographers, caterers, planners) and location.</p>
            </div>
            <div className="step">
              <div className="step-icon">✓</div>
              <h3>2. Select</h3>
              <p>Choose from verified talent profiles, check their portfolios, pricing, and ratings.</p>
            </div>
            <div className="step">
              <div className="step-icon">💳</div>
              <h3>3. Book & Pay</h3>
              <p>Secure the artist for your specific date and pay the booking fee securely.</p>
            </div>
            <div className="step">
              <div className="step-icon">😊</div>
              <h3>4. Enjoy</h3>
              <p>Receive premium professional services at your venue and rate the talent.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Are You a Professional Event Partner?</h2>
          <p>Register on TalentConnect, get verified, and start receiving client bookings today</p>
          <Link to="/login?signup=true" className="btn btn-primary btn-lg" style={{ background: 'var(--gradient-brand)' }}>
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
