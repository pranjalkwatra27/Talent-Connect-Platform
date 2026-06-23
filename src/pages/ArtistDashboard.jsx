import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';
import * as api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ArtistDashboard = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState('overview');
  const [userEvents, setUserEvents] = useState([]); // This will store our Service listing
  const [userBookings, setUserBookings] = useState([]);
  const [allAttendees, setAllAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsForm, setSettingsForm] = useState({ name: '', email: '', phone: '', city: '' });
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch the artist's own service
      const service = await api.getOwnService();
      if (service) {
        setUserEvents([service]);
      } else {
        setUserEvents([]);
      }

      // Fetch the artist's bookings
      const bookings = await api.getArtistBookings();
      setUserBookings(bookings || []);

      // Calculate unique clients
      const attendeeMap = new Map();
      bookings.forEach((booking) => {
        const client = booking.clientId;
        if (client && !attendeeMap.has(client._id)) {
          attendeeMap.set(client._id, {
            userId: client._id,
            userName: client.name || 'Unknown Client',
            userEmail: client.email || '',
            userPhone: client.phone || '',
            userCity: client.city || '',
            totalBookings: 0,
            totalSpent: 0
          });
        }
        if (client) {
          const attendee = attendeeMap.get(client._id);
          attendee.totalBookings += 1;
          attendee.totalSpent += booking.amount || 0;
        }
      });
      setAllAttendees(Array.from(attendeeMap.values()));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      showToast('Error loading dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'artist') {
      showToast('Access denied. This page is for artists only.', 'error');
      navigate('/');
      return;
    }

    setSettingsForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      city: user.city || ''
    });

    loadDashboardData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const saveSettings = async () => {
    if (!settingsForm.name) {
      showToast('Name is required', 'error');
      return;
    }

    try {
      setLoading(true);
      await updateProfile({
        name: settingsForm.name,
        phone: settingsForm.phone,
        city: settingsForm.city
      });
      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      showToast('Error saving settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await api.updateBookingStatus(bookingId, newStatus);
      showToast(`Booking status updated to ${newStatus}`, 'success');
      loadDashboardData();
    } catch (error) {
      console.error('Status update failed:', error);
      showToast('Failed to update booking status', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  if (loading) return <LoadingSpinner />;

  const activeEvents = userEvents.length;
  const totalBookings = userBookings.filter(b => b.status === 'confirmed' || b.status === 'completed').length;
  const totalRevenue = userBookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + (b.amount || 0), 0);
  const totalAttendees = allAttendees.length;

  const firstName = user?.name?.split(' ')[0] || 'Artist';

  return (
    <div className="organizer-dashboard" style={{ paddingTop: '100px' }}>
      {/* Dashboard Top Bar */}
      <div style={{
        position: 'fixed', top: '70px', left: 0, right: 0, zIndex: 90,
        background: 'var(--card-bg)', borderBottom: '1px solid var(--border)',
        padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setSidebarOpen(o => !o)}
            style={{ background: 'none', border: 'none', color: 'var(--text)', fontSize: '1.2rem', cursor: 'pointer' }}
          >
            <i className={`fas fa-${sidebarOpen ? 'times' : 'bars'}`}></i>
          </button>
          <span style={{ color: 'var(--text)', fontWeight: 700, fontSize: '1.1rem' }}>Artist Partner Hub</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user?.isVerified ? (
            <span style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
              🛡️ Verified Partner
            </span>
          ) : (
            <span onClick={() => navigate('/artist-verification')} style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
              ⚠️ Unverified - Click to Verify
            </span>
          )}
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'var(--primary)', color: 'white', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem'
          }}>{firstName[0]}</div>
        </div>
      </div>

      <div className="dashboard-wrapper" style={{ display: 'flex', minHeight: 'calc(100vh - 120px)' }}>
        {/* Sidebar */}
        <aside style={{
          width: sidebarOpen ? '240px' : '0',
          minWidth: sidebarOpen ? '240px' : '0',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          background: 'var(--card-bg)',
          borderRight: '1px solid var(--border)',
          height: 'calc(100vh - 120px)',
          overflowY: 'auto',
          flexShrink: 0,
        }}>
          {/* Profile card in sidebar */}
          <div style={{ padding: '24px 16px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'linear-gradient(135deg,var(--primary),var(--secondary))',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem', fontWeight: 800, margin: '0 auto 10px'
            }}>{firstName[0]}</div>
            <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: '0.92rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '3px' }}>Artist Partner</div>
          </div>
          <div className="nav-menu" style={{ padding: '12px 0' }}>
            {[
              { id: 'overview', icon: 'fa-th-large', label: 'Overview' },
              { id: 'events', icon: 'fa-user-cog', label: 'My Service Profile' },
              { id: 'bookings', icon: 'fa-ticket-alt', label: 'Client Bookings' },
              { id: 'attendees', icon: 'fa-users', label: 'My Clients' },
              { id: 'settings', icon: 'fa-cog', label: 'Settings' },
            ].map(item => (
              <a key={item.id}
                className={`nav-link ${currentSection === item.id ? 'current' : ''}`}
                onClick={() => setCurrentSection(item.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', whiteSpace: 'nowrap', cursor: 'pointer' }}
              >
                <i className={`fas ${item.icon}`} style={{ width: '18px', textAlign: 'center' }}></i>
                <span>{item.label}</span>
              </a>
            ))}
            <a className="nav-link" onClick={() => navigate('/host-event')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', whiteSpace: 'nowrap', cursor: 'pointer' }}
            >
              <i className="fas fa-plus-circle" style={{ width: '18px', textAlign: 'center' }}></i>
              <span>Edit Listing Details</span>
            </a>
            <a className="nav-link" onClick={() => navigate('/artist-verification')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', whiteSpace: 'nowrap', cursor: 'pointer' }}
            >
              <i className="fas fa-shield-alt" style={{ width: '18px', textAlign: 'center' }}></i>
              <span>Get Verified Badge</span>
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="content-area" style={{ flex: 1, overflowX: 'hidden', padding: '24px' }}>
          {/* Overview Section */}
          {currentSection === 'overview' && (
            <div className="section-content active">
              <div className="welcome-section" style={{ marginBottom: '24px' }}>
                <h1>Welcome back, {firstName}! 👋</h1>
                <p>Manage your professional talent service and reviews from one central dashboard.</p>
              </div>

              <div className="stats-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div className="stat-box" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '20px', borderRadius: '12px' }}>
                  <div className="stat-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="stat-number" style={{ fontSize: '2rem', fontWeight: 800 }}>{activeEvents}</div>
                      <div className="stat-title" style={{ color: 'var(--text-muted)' }}>Active Profiles</div>
                    </div>
                    <div className="stat-badge purple-bg" style={{ fontSize: '1.5rem' }}>💼</div>
                  </div>
                </div>

                <div className="stat-box" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '20px', borderRadius: '12px' }}>
                  <div className="stat-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="stat-number" style={{ fontSize: '2rem', fontWeight: 800 }}>{totalBookings}</div>
                      <div className="stat-title" style={{ color: 'var(--text-muted)' }}>Total Bookings</div>
                    </div>
                    <div className="stat-badge orange-bg" style={{ fontSize: '1.5rem' }}>📅</div>
                  </div>
                </div>

                <div className="stat-box" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '20px', borderRadius: '12px' }}>
                  <div className="stat-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="stat-number" style={{ fontSize: '2rem', fontWeight: 800 }}>₹{totalRevenue.toLocaleString('en-IN')}</div>
                      <div className="stat-title" style={{ color: 'var(--text-muted)' }}>Total Earnings</div>
                    </div>
                    <div className="stat-badge green-bg" style={{ fontSize: '1.5rem' }}>💰</div>
                  </div>
                </div>

                <div className="stat-box" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '20px', borderRadius: '12px' }}>
                  <div className="stat-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="stat-number" style={{ fontSize: '2rem', fontWeight: 800 }}>{totalAttendees}</div>
                      <div className="stat-title" style={{ color: 'var(--text-muted)' }}>Total Clients</div>
                    </div>
                    <div className="stat-badge blue-bg" style={{ fontSize: '1.5rem' }}>👥</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="dashboard-card" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
                <h2>Quick Actions</h2>
                <div className="quick-access" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
                  <div className="access-card" onClick={() => navigate('/host-event')} style={{ padding: '16px', background: 'rgba(99,102,241,0.05)', border: '1px solid var(--border)', borderRadius: '10px', cursor: 'pointer', textAlign: 'center' }}>
                    <div className="icon" style={{ fontSize: '2rem', marginBottom: '8px' }}>📝</div>
                    <h3>Edit Profile Details</h3>
                    <p>Update packages and descriptions</p>
                  </div>
                  <div className="access-card" onClick={() => setCurrentSection('bookings')} style={{ padding: '16px', background: 'rgba(236,72,153,0.05)', border: '1px solid var(--border)', borderRadius: '10px', cursor: 'pointer', textAlign: 'center' }}>
                    <div className="icon" style={{ fontSize: '2rem', marginBottom: '8px' }}>📅</div>
                    <h3>View Bookings</h3>
                    <p>Manage bookings & statuses</p>
                  </div>
                  <div className="access-card" onClick={() => navigate('/artist-verification')} style={{ padding: '16px', background: 'rgba(16,185,129,0.05)', border: '1px solid var(--border)', borderRadius: '10px', cursor: 'pointer', textAlign: 'center' }}>
                    <div className="icon" style={{ fontSize: '2rem', marginBottom: '8px' }}>🛡️</div>
                    <h3>Verify Identity</h3>
                    <p>Unlock the Verified badge</p>
                  </div>
                </div>
              </div>

              {/* Active Listing Profile Summary */}
              {userEvents.map(service => (
                <div key={service._id} style={{ display: 'flex', gap: '20px', background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '20px', borderRadius: '12px' }}>
                  <img src={service.image} alt={service.name} style={{ width: '180px', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{service.name} ({service.category})</h3>
                    <p style={{ color: 'var(--text-muted)', margin: '8px 0' }}>{service.description}</p>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '0.9rem', fontWeight: 600 }}>
                      <span>📍 {service.city}</span>
                      <span>💰 Base Price: ₹{service.price}</span>
                      <span>⭐ Rating: {service.rating} ({service.reviewsCount} reviews)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Service Profile Section */}
          {currentSection === 'events' && (
            <div className="section-content active">
              <h1>Service Listings</h1>
              <div style={{ marginTop: '20px' }}>
                {userEvents.length === 0 ? (
                  <p>No active service listing profiles found.</p>
                ) : (
                  userEvents.map(service => (
                    <div key={service._id} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '24px', borderRadius: '12px', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h2>{service.name}</h2>
                          <p style={{ color: 'var(--primary)', fontWeight: 700 }}>{service.category}</p>
                        </div>
                        <button className="btn-primary" onClick={() => navigate('/host-event')}>Edit Profile</button>
                      </div>
                      <hr style={{ margin: '16px 0', borderColor: 'var(--border)' }} />
                      <p><strong>Description:</strong> {service.description}</p>
                      <p style={{ marginTop: '10px' }}><strong>Base Package Cost:</strong> ₹{service.price}</p>
                      <p><strong>Service City:</strong> {service.city}</p>
                      
                      <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>Included Packages</h3>
                      {service.packages?.map((pkg, idx) => (
                        <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', marginBottom: '8px' }}>
                          <h4>{pkg.name} - ₹{pkg.price}</h4>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{pkg.description}</p>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                            {pkg.features?.map((f, i) => (
                              <span key={i} style={{ background: 'rgba(99,102,241,0.1)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>✓ {f}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Bookings Section */}
          {currentSection === 'bookings' && (
            <div className="section-content active">
              <h1>Client Bookings</h1>
              <div style={{ marginTop: '20px' }}>
                {userBookings.length === 0 ? (
                  <p>No bookings received yet.</p>
                ) : (
                  <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                          <th style={{ padding: '16px' }}>Client</th>
                          <th style={{ padding: '16px' }}>Package</th>
                          <th style={{ padding: '16px' }}>Date</th>
                          <th style={{ padding: '16px' }}>Location</th>
                          <th style={{ padding: '16px' }}>Amount</th>
                          <th style={{ padding: '16px' }}>Status</th>
                          <th style={{ padding: '16px' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userBookings.map(booking => (
                          <tr key={booking._id} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '16px' }}>
                              <strong>{booking.clientId?.name}</strong>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{booking.clientId?.email}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{booking.clientId?.phone}</div>
                            </td>
                            <td style={{ padding: '16px' }}>{booking.packageName}</td>
                            <td style={{ padding: '16px' }}>{new Date(booking.eventDate).toLocaleDateString()}</td>
                            <td style={{ padding: '16px' }}>{booking.eventLocation}</td>
                            <td style={{ padding: '16px' }}>₹{booking.amount}</td>
                            <td style={{ padding: '16px' }}>
                              <span className={`badge ${booking.status}`} style={{
                                textTransform: 'capitalize',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                background: booking.status === 'confirmed' ? 'rgba(34,197,94,0.15)' : booking.status === 'pending' ? 'rgba(234,179,8,0.15)' : 'rgba(239,68,68,0.15)',
                                color: booking.status === 'confirmed' ? '#22c55e' : booking.status === 'pending' ? '#eab308' : '#ef4444'
                              }}>{booking.status}</span>
                            </td>
                            <td style={{ padding: '16px' }}>
                              {booking.status === 'pending' && (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button onClick={() => handleUpdateStatus(booking._id, 'confirmed')} style={{ padding: '4px 10px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Confirm</button>
                                  <button onClick={() => handleUpdateStatus(booking._id, 'cancelled')} style={{ padding: '4px 10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Decline</button>
                                </div>
                              )}
                              {booking.status === 'confirmed' && (
                                <button onClick={() => handleUpdateStatus(booking._id, 'completed')} style={{ padding: '4px 10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Mark Complete</button>
                              )}
                              {booking.status === 'completed' && <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Booking finished</span>}
                              {booking.status === 'cancelled' && <span style={{ color: '#ef4444', fontSize: '0.9rem' }}>Cancelled</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Attendees / Clients Section */}
          {currentSection === 'attendees' && (
            <div className="section-content active">
              <h1>My Clients</h1>
              <div style={{ marginTop: '20px' }}>
                {allAttendees.length === 0 ? (
                  <p>No client records found.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    {allAttendees.map(attendee => (
                      <div key={attendee.userId} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '20px', borderRadius: '12px' }}>
                        <h3>{attendee.userName}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>📧 {attendee.userEmail}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>📞 {attendee.userPhone || 'No Phone Number'}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>📍 {attendee.userCity || 'No City Specified'}</p>
                        <hr style={{ margin: '12px 0', borderColor: 'var(--border)' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600 }}>
                          <span>Bookings: {attendee.totalBookings}</span>
                          <span style={{ color: 'var(--primary)' }}>Spent: ₹{attendee.totalSpent}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Section */}
          {currentSection === 'settings' && (
            <div className="section-content active">
              <h1>Account Settings</h1>
              <div style={{ maxWidth: '500px', marginTop: '20px', background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '24px', borderRadius: '12px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Artist Name</label>
                  <input type="text" value={settingsForm.name} onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.1)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)' }} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Contact Email</label>
                  <input type="email" value={settingsForm.email} disabled style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'not-allowed' }} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Contact Phone</label>
                  <input type="text" value={settingsForm.phone} onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.1)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)' }} />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Location City</label>
                  <input type="text" value={settingsForm.city} onChange={(e) => setSettingsForm({ ...settingsForm, city: e.target.value })} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.1)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)' }} />
                </div>
                <button className="btn-primary" onClick={saveSettings} style={{ width: '100%' }}>Save Profile Details</button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Toast Alert */}
      {toast.show && (
        <div style={{
          position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000,
          background: toast.type === 'error' ? '#ef4444' : '#22c55e', color: 'white',
          padding: '12px 24px', borderRadius: '8px', fontWeight: 700, boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default ArtistDashboard;
