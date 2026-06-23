import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { useAuth } from '../components/context/AuthContext';
import '../components/styles/global.css';

const EventBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [artistService, setArtistService] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [processing, setProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    termsAccepted: false
  });

  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=/booking/${id}`);
      return;
    }
    loadArtistService();
  }, [id, user]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  const loadArtistService = async () => {
    try {
      setLoading(true);
      const data = await api.getServiceById(id);
      setArtistService(data);
      if (data && data.packages && data.packages.length > 0) {
        setSelectedPackage(data.packages[0]); // Default to first package
      }
    } catch (error) {
      console.error('Error loading service details:', error);
      alert('Artist service profile not found.');
      navigate('/browse');
    } finally {
      setLoading(false);
    }
  };

  const calculatePricing = () => {
    const basePrice = selectedPackage ? selectedPackage.price : (artistService?.price || 0);
    const bookingFee = 50;
    const gst = Math.round((basePrice + bookingFee) * 0.18);
    const total = basePrice + bookingFee + gst;
    
    return { basePrice, bookingFee, gst, total };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.termsAccepted) {
      alert('Please accept the terms and conditions');
      return;
    }

    if (!bookingDate) {
      alert('Please select a booking date');
      return;
    }

    if (!bookingTime) {
      alert('Please select a booking start time');
      return;
    }

    if (!venueAddress.trim()) {
      alert('Please enter your event venue address');
      return;
    }

    if (!selectedPackage) {
      alert('Please select a package first');
      return;
    }

    setProcessing(true);
    const pricing = calculatePricing();
    
    const checkoutData = {
      serviceId: artistService._id,
      artistId: artistService.artistId,
      eventName: artistService.name,
      eventDate: bookingDate,
      eventTime: bookingTime,
      eventVenue: venueAddress,
      eventImage: artistService.image,
      eventCategory: artistService.category,
      packageName: selectedPackage.name,
      packagePrice: pricing.basePrice,
      bookingFee: pricing.bookingFee,
      gstAmount: pricing.gst,
      totalAmount: pricing.total,
      attendeeName: formData.name,
      attendeeEmail: formData.email,
      attendeePhone: formData.phone,
      bookingDate: new Date().toISOString()
    };

    localStorage.setItem('bookingData', JSON.stringify(checkoutData));
    
    setTimeout(() => {
      navigate('/payment');
    }, 400);
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', color: '#6366f1' }}></i>
        <p style={{ marginTop: '16px', color: '#64748b' }}>Retrieving artist portfolio and pricing...</p>
      </div>
    );
  }

  if (!artistService) {
    return (
      <div className="error-container" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <p>Service profile not found</p>
      </div>
    );
  }

  const pricing = calculatePricing();

  return (
    <div className="booking-page">
      <div className="container-booking">
        <div className="booking-wrapper">
          {/* Left Side: Service Details & Package Options */}
          <div className="event-details-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="event-image-container" style={{ borderRadius: '16px', overflow: 'hidden', height: '240px' }}>
              <img 
                src={artistService.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'} 
                alt={artistService.name}
                className="event-image"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <h1 className="event-title" style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>{artistService.name}</h1>
                {artistService.isVerified && (
                  <span style={{ background: '#10b981', color: 'white', padding: '2px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 800 }}>Verified</span>
                )}
              </div>
              <p style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fas fa-map-marker-alt"></i> {artistService.city} • <i className="fas fa-tag"></i> {artistService.category}
              </p>
            </div>

            <div className="event-description" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: '#1e293b' }}>About the Artist</h3>
              <p style={{ color: '#475569', fontSize: '0.93rem', lineHeight: 1.6 }}>{artistService.description}</p>
            </div>

            {/* Packages Selection List */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px', color: '#1e293b' }}>Choose booking package</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {artistService.packages && artistService.packages.map((pkg, i) => {
                  const isSelected = selectedPackage?._id === pkg._id || selectedPackage?.name === pkg.name;
                  return (
                    <div 
                      key={pkg._id || i}
                      onClick={() => setSelectedPackage(pkg)}
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                        background: isSelected ? 'rgba(79, 70, 229, 0.02)' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.96rem' }}>{pkg.name}</span>
                        <span style={{ fontWeight: 800, color: '#4f46e5', fontSize: '1rem' }}>₹{pkg.price.toLocaleString('en-IN')}</span>
                      </div>
                      <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 10px 0', lineHeight: 1.4 }}>{pkg.description}</p>
                      {pkg.features && pkg.features.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {pkg.features.map((feat, fi) => (
                            <span key={fi} style={{ background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600 }}>✓ {feat}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Side: Schedule & Booking Details Form */}
          <div className="booking-form-card">
            <form onSubmit={handleSubmit} id="bookingForm">
              <div className="form-section">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
                  <i className="fas fa-calendar-alt" style={{ marginRight: '8px', color: '#4f46e5' }}></i>
                  Schedule Service
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                  <div className="form-group">
                    <label htmlFor="bookingDateInput" style={{ fontWeight: 600, fontSize: '0.85rem', color: '#475569' }}>Booking Date *</label>
                    <input 
                      type="date" 
                      id="bookingDateInput"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="bookingTimeInput" style={{ fontWeight: 600, fontSize: '0.85rem', color: '#475569' }}>Service Start Time *</label>
                    <input 
                      type="time" 
                      id="bookingTimeInput"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      required
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="venueAddressInput" style={{ fontWeight: 600, fontSize: '0.85rem', color: '#475569' }}>Venue Location Details *</label>
                    <input 
                      type="text" 
                      id="venueAddressInput"
                      placeholder="E.g., Banquet Hall, Street Address, City"
                      value={venueAddress}
                      onChange={(e) => setVenueAddress(e.target.value)}
                      required
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section" style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
                  <i className="fas fa-user" style={{ marginRight: '8px', color: '#4f46e5' }}></i>
                  Client Contact
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                  <div className="form-group">
                    <label htmlFor="name" style={{ fontWeight: 600, fontSize: '0.85rem', color: '#475569' }}>Full Name *</label>
                    <input 
                      type="text" 
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" style={{ fontWeight: 600, fontSize: '0.85rem', color: '#475569' }}>Email Address *</label>
                    <input 
                      type="email" 
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone" style={{ fontWeight: 600, fontSize: '0.85rem', color: '#475569' }}>Phone Number *</label>
                    <input 
                      type="tel" 
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>

              {/* Invoice breakdown */}
              <div className="price-breakdown" style={{ marginTop: '24px', background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <h3 style={{ marginBottom: '15px', color: '#4f46e5', fontSize: '1rem', fontWeight: 800 }}>Invoice Summary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                  <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                    <span>{selectedPackage ? selectedPackage.name : 'Package Price'}</span>
                    <strong style={{ color: '#0f172a' }}>₹{pricing.basePrice.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                    <span>Platform Booking Fee</span>
                    <strong style={{ color: '#0f172a' }}>₹50</strong>
                  </div>
                  <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                    <span>GST (18%)</span>
                    <strong style={{ color: '#0f172a' }}>₹{pricing.gst.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="price-row total" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px dashed #cbd5e1', paddingTop: '10px', marginTop: '5px', fontSize: '1.05rem', fontWeight: 800 }}>
                    <span style={{ color: '#0f172a' }}>Amount Payable</span>
                    <span style={{ color: '#4f46e5' }}>₹{pricing.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="form-group checkbox-group" style={{ marginTop: '20px' }}>
                <label className="checkbox-label" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    id="termsCheckbox"
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})}
                    required
                    style={{ marginTop: '4px' }}
                  />
                  <span className="checkbox-text" style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.4 }}>
                    I agree to the <a href="/terms" target="_blank" className="terms-link" style={{ color: '#4f46e5', fontWeight: 600 }}>terms and conditions</a>
                  </span>
                </label>
              </div>

              <button 
                type="submit" 
                className="book-button"
                disabled={processing}
                style={{
                  width: '100%', padding: '14px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '1rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: '0 4px 14px rgba(99,102,241,0.3)', marginTop: '20px'
                }}
              >
                {processing ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-lock"></i>
                    Proceed to Payment - ₹{pricing.total.toLocaleString('en-IN')}
                  </>
                )}
              </button>

              <div className="secure-badge" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#10b981', fontSize: '0.8rem', fontWeight: 700, marginTop: '12px' }}>
                <i className="fas fa-shield-alt"></i>
                <span>SSL Encrypted Transaction Guarantee</span>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {processing && (
        <div className="loading-overlay active" style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="loading-spinner" style={{ background: 'white', padding: '30px 40px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', color: '#4f46e5' }}></i>
            <p style={{ marginTop: '15px', color: '#1e293b', fontWeight: 800 }}>Directing to checkout screen...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventBooking;
