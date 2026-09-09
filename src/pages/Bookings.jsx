import { useState, useEffect } from 'react';
import { useAuth } from '../components/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Bookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadBookings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  useEffect(() => {
    filterBookings(currentFilter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings, currentFilter]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      
      const rawBookings = user.role === 'artist' 
        ? await api.getArtistBookings() 
        : await api.getClientBookings();

      const bookingsArray = (rawBookings || []).map(b => {
        const baseAmt = b.amount || 0;
        const gst = Math.round(baseAmt * 0.18);
        const platform = 50;
        return {
          id: b._id,
          bookingId: b._id,
          eventTitle: b.packageName || 'Service Booking',
          eventName: b.packageName || 'Service Booking',
          eventDate: b.eventDate ? b.eventDate.split('T')[0] : '',
          eventTime: 'Standard Session',
          eventVenue: b.eventLocation || 'At Client Location',
          eventLocation: b.eventLocation || 'At Client Location',
          eventImage: b.serviceId?.image || 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800',
          eventCategory: b.serviceId?.category || 'Talent',
          ticketCount: 1,
          tickets: 1,
          ticketPrice: baseAmt,
          pricePerTicket: baseAmt,
          bookingFee: platform,
          platformFee: platform,
          gstAmount: gst,
          totalAmount: baseAmt + platform + gst,
          totalPrice: baseAmt + platform + gst,
          razorpayPaymentId: b.paymentId || 'Mock Pay',
          transactionId: b.paymentId || 'Mock Pay',
          userId: user?._id,
          userEmail: user?.email,
          userName: user?.name || 'Client',
          customerName: b.clientId?.name || user?.name || 'Client',
          customerEmail: b.clientId?.email || user?.email,
          paymentMethod: b.paymentMethod || 'mock',
          paymentStatus: b.paymentStatus || 'success',
          bookingDate: b.createdAt || new Date().toISOString(),
          status: b.status || 'confirmed',
          artistName: b.artistId?.name || 'Artist Partner',
          artistPhone: b.artistId?.phone || 'Not provided',
          artistEmail: b.artistId?.email || ''
        };
      });
      
      // Sort by booking date (newest first)
      bookingsArray.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
      setBookings(bookingsArray);
    } catch (error) {
      console.error('Error loading bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getBookingStatus = (booking) => {
    if (booking.status === 'cancelled') return 'cancelled';
    
    const eventDate = new Date(booking.eventDate);
    const today = new Date();
    today.setHours(0,0,0,0);
    
    if (eventDate < today) {
      return 'completed';
    }
    return 'upcoming';
  };

  const filterBookings = (filter) => {
    setCurrentFilter(filter);
    
    if (filter === 'all') {
      setFilteredBookings(bookings);
    } else {
      const filtered = bookings.filter(booking => {
        const calculatedStatus = getBookingStatus(booking);
        return calculatedStatus === filter;
      });
      setFilteredBookings(filtered);
    }
  };

  const handleCancelClick = (bookingId) => {
    setBookingToCancel(bookingId);
    setCancelModalOpen(true);
  };

  const confirmCancel = async () => {
    if (!bookingToCancel || !user) return;

    try {
      await api.updateBookingStatus(bookingToCancel, 'cancelled');

      await loadBookings();
      setCancelModalOpen(false);
      setBookingToCancel(null);
      alert('Booking cancelled successfully');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const downloadReceipt = (booking) => {
    const receiptContent = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         TALENTCONNECT
       BOOKING RECEIPT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Booking ID: ${booking.id}
Date of Booking: ${new Date(booking.bookingDate).toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SERVICE & ARTIST DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Service/Artist: ${booking.eventTitle || booking.eventName || 'N/A'}
Category: ${booking.eventCategory || 'N/A'}
Service Date: ${booking.eventDate || 'TBA'}
Start Time: ${booking.eventTime || 'TBA'}
Venue / Address: ${booking.eventLocation || booking.eventVenue || 'TBA'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEES & PAYMENT SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Service Booking Fee: ₹${booking.pricePerTicket || booking.ticketPrice || 0}
${booking.gstAmount ? `GST (18%): ₹${booking.gstAmount}\n` : ''}${booking.platformFee || booking.bookingFee ? `Platform Booking Fee: ₹${booking.platformFee || booking.bookingFee}\n` : ''}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL PAID: ₹${booking.totalPrice || booking.totalAmount || 0}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Payment Method: ${booking.paymentMethod || 'Razorpay'}
Payment Status: ${booking.paymentStatus || 'Completed'}
Transaction ID: ${booking.transactionId || booking.razorpayPaymentId || booking.id}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLIENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: ${booking.customerName || booking.userName || 'N/A'}
Email: ${booking.customerEmail || booking.userEmail || user.email}
Phone: ${booking.customerPhone || 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Booking Status: ${getBookingStatus(booking).toUpperCase()}

Thank you for choosing TalentConnect to book professional talents!
For support, contact: support@talentconnect.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TalentConnect_Receipt_${booking.id.substring(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* ── UNIFIED HERO HEADER ── */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        padding: '120px 24px 60px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.2)', padding: '6px 18px',
            borderRadius: '30px', color: '#e2e8f0', fontSize: '0.85rem',
            fontWeight: 700, marginBottom: '20px'
          }}>
            <span style={{ color: '#10b981' }}>●</span> Real-time Schedule & Order Tracking
          </div>
          <h1 style={{
            color: 'white', fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
            fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}>
            My Bookings & Reservations
          </h1>
          <p style={{
            color: '#cbd5e1', fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            maxWidth: '700px', margin: '0 auto', lineHeight: 1.6
          }}>
            Track your upcoming events, download official booking receipts, and manage talent orders.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Filter Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '30px', 
        borderBottom: '2px solid #e5e7eb',
        overflowX: 'auto',
        paddingBottom: '2px'
      }}>
        {[
          { id: 'all', label: 'All Bookings', icon: 'list' },
          { id: 'upcoming', label: 'Upcoming', icon: 'clock' },
          { id: 'completed', label: 'Completed', icon: 'check-circle' },
          { id: 'cancelled', label: 'Cancelled', icon: 'times-circle' }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => filterBookings(filter.id)}
            style={{
              padding: '14px 24px',
              background: 'none',
              border: 'none',
              color: currentFilter === filter.id ? '#5b21b6' : '#6b7280',
              fontWeight: 600,
              cursor: 'pointer',
              borderBottom: `3px solid ${currentFilter === filter.id ? '#5b21b6' : 'transparent'}`,
              marginBottom: '-2px',
              transition: '0.3s',
              whiteSpace: 'nowrap'
            }}
          >
            <i className={`fas fa-${filter.icon}`} style={{ marginRight: '8px' }}></i>
            {filter.label}
          </button>
        ))}
      </div>

      {/* Bookings Grid */}
      {filteredBookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <i className="fas fa-calendar-times" style={{ fontSize: '72px', color: '#d1d5db', marginBottom: '20px' }}></i>
          <h3 style={{ color: '#1f2937', fontSize: '24px', marginBottom: '10px' }}>
            {currentFilter === 'all' ? 'No Bookings Yet' : `No ${currentFilter} bookings`}
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            {currentFilter === 'all' ? "You haven't booked any artists yet. Start exploring amazing talent!" : `You don't have any ${currentFilter} bookings.`}
          </p>
          <button 
            onClick={() => navigate('/browse')}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            <i className="fas fa-search" style={{ marginRight: '8px' }}></i>
            Browse Talents
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
          gap: '24px' 
        }}>
          {filteredBookings.map(booking => {
            const status = getBookingStatus(booking);
            const canCancel = status === 'upcoming' && booking.status !== 'cancelled';

            return (
              <div 
                key={booking.id}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  transition: '0.3s',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
                }}
              >
                {/* Event Image */}
                <div style={{
                  width: '100%',
                  height: '160px',
                  background: booking.eventImage 
                    ? `url(${booking.eventImage}) center/cover` 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '48px'
                }}>
                  {!booking.eventImage && <i className="fas fa-calendar-alt"></i>}
                </div>

                {/* Card Content */}
                <div style={{ padding: '20px' }}>
                  {/* Status Badge */}
                  <span style={{
                    display: 'inline-block',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 600,
                    marginBottom: '12px',
                    background: status === 'upcoming' ? '#dbeafe' : status === 'completed' ? '#d1fae5' : '#fee2e2',
                    color: status === 'upcoming' ? '#1e40af' : status === 'completed' ? '#065f46' : '#991b1b'
                  }}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>

                  <h3 style={{ color: '#1f2937', fontSize: '20px', marginBottom: '12px' }}>
                    {booking.eventTitle || booking.eventName || 'Service / Talent'}
                  </h3>

                  {/* Event Details */}
                  <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '14px' }}>
                    <i className="fas fa-calendar-alt" style={{ color: '#5b21b6', width: '18px' }}></i>
                    <span>Service Date: {booking.eventDate || 'Date TBA'}</span>
                  </div>

                  <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '14px' }}>
                    <i className="fas fa-clock" style={{ color: '#5b21b6', width: '18px' }}></i>
                    <span>Start Time: {booking.eventTime || 'Time TBA'}</span>
                  </div>

                  <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '14px' }}>
                    <i className="fas fa-map-marker-alt" style={{ color: '#5b21b6', width: '18px' }}></i>
                    <span>Venue / Address: {booking.eventLocation || booking.eventVenue || 'Location TBA'}</span>
                  </div>

                  <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '14px' }}>
                    <i className="fas fa-tags" style={{ color: '#5b21b6', width: '18px' }}></i>
                    <span>Category: {booking.eventCategory || 'Talent'}</span>
                  </div>

                  {/* Price */}
                  <div style={{
                    background: '#f3f4f6',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#1f2937',
                    fontWeight: 600,
                    marginTop: '12px'
                  }}>
                    Total: ₹{booking.totalPrice || booking.totalAmount || 0}
                  </div>

                  {/* Booking ID */}
                  <div style={{
                    background: '#f3f4f6',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#6b7280',
                    fontFamily: 'monospace',
                    marginTop: '12px'
                  }}>
                    ID: {booking.id.substring(0, 16)}...
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                    <button
                      onClick={() => downloadReceipt(booking)}
                      style={{
                        flex: 1,
                        padding: '10px 18px',
                        background: '#5b21b6',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: '0.3s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#7c3aed'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#5b21b6'}
                    >
                      <i className="fas fa-download" style={{ marginRight: '6px' }}></i>
                      Receipt
                    </button>
                    <button
                      onClick={() => handleCancelClick(booking.id)}
                      disabled={!canCancel}
                      style={{
                        flex: 1,
                        padding: '10px 18px',
                        background: canCancel ? '#fee2e2' : '#f3f4f6',
                        color: canCancel ? '#991b1b' : '#9ca3af',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: canCancel ? 'pointer' : 'not-allowed',
                        fontSize: '14px',
                        transition: '0.3s',
                        opacity: canCancel ? 1 : 0.5
                      }}
                      onMouseEnter={(e) => {
                        if (canCancel) e.currentTarget.style.background = '#fecaca';
                      }}
                      onMouseLeave={(e) => {
                        if (canCancel) e.currentTarget.style.background = '#fee2e2';
                      }}
                    >
                      <i className="fas fa-times" style={{ marginRight: '6px' }}></i>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
          onClick={() => setCancelModalOpen(false)}
        >
          <div 
            style={{
              background: '#fff',
              padding: '30px',
              borderRadius: '16px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#1f2937', fontSize: '24px', margin: 0 }}>Cancel Booking</h2>
              <button
                onClick={() => setCancelModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                &times;
              </button>
            </div>
            <p style={{ color: '#6b7280', marginBottom: '24px', lineHeight: '1.6' }}>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setCancelModalOpen(false)}
                style={{
                  padding: '10px 24px',
                  background: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: '0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#d1d5db'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#e5e7eb'}
              >
                Keep Booking
              </button>
              <button
                onClick={confirmCancel}
                style={{
                  padding: '10px 24px',
                  background: '#fee2e2',
                  color: '#991b1b',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: '0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Bookings;
