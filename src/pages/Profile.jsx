import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/context/AuthContext';
import * as api from '../services/api';
import { formatCurrency } from '../components/utils/helpers';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingEvents: 0,
    completedEvents: 0,
    totalSpent: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      navigate('/login');
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      let bookingsArray = [];
      if (user.role === 'client') {
        bookingsArray = await api.getClientBookings();
      } else if (user.role === 'artist') {
        bookingsArray = await api.getArtistBookings();
      }

      // Calculate stats
      const today = new Date();
      const upcoming = bookingsArray.filter(b => {
        const eventDate = new Date(b.eventDate);
        return eventDate > today && b.status !== 'cancelled';
      });
      const completed = bookingsArray.filter(b => {
        const eventDate = new Date(b.eventDate);
        return eventDate <= today && b.status !== 'cancelled';
      });
      const totalSpent = bookingsArray
        .filter(b => b.status !== 'cancelled')
        .reduce((sum, b) => sum + (b.amount || 0), 0);

      setStats({
        totalBookings: bookingsArray.length,
        upcomingEvents: upcoming.length,
        completedEvents: completed.length,
        totalSpent
      });

      // Get recent bookings (last 3)
      setRecentBookings(bookingsArray.slice(0, 3));
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const getMemberSince = () => {
    if (!user?.createdAt) return 'Recently';
    const date = new Date(user.createdAt);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="profile-page" style={{ paddingTop: '100px' }}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="profile-page-new" style={{ paddingTop: '90px' }}>
      {/* Profile Header with Cover */}
      <div className="profile-cover">
        <div className="cover-gradient"></div>
        <div className="profile-header-content">
          <div className="profile-avatar-large">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <div className="avatar-placeholder-large">
                {getInitials(user?.name)}
              </div>
            )}
            {user?.isVerified && (
              <div className="avatar-badge">
                <i className="fas fa-check"></i>
              </div>
            )}
          </div>
          <div className="profile-header-info">
            <h1>{user?.name || 'User'}</h1>
            <p className="profile-email">
              <i className="fas fa-envelope"></i> {user?.email}
            </p>
            <p className="profile-member-since">
              <i className="fas fa-calendar-alt"></i> Member since {getMemberSince()}
            </p>
            <span className="user-type-badge">
              <i className={user?.role === 'artist' ? 'fas fa-theater-masks' : 'fas fa-user'}></i>
              {user?.role === 'artist' ? 'Artist Partner' : 'Client'}
            </span>
          </div>
        </div>
      </div>

      <div className="profile-content-wrapper">
        {/* Stats Cards */}
        <section className="profile-stats-section">
          <div className="stats-row">
            <div className="stat-card-modern">
              <div className="stat-icon-wrapper purple">
                <i className="fas fa-ticket-alt"></i>
              </div>
              <div className="stat-details">
                <h3>{stats.totalBookings}</h3>
                <p>Total Bookings</p>
              </div>
            </div>
            
            <div className="stat-card-modern">
              <div className="stat-icon-wrapper blue">
                <i className="fas fa-calendar-check"></i>
              </div>
              <div className="stat-details">
                <h3>{stats.upcomingEvents}</h3>
                <p>Upcoming Events</p>
              </div>
            </div>
            
            <div className="stat-card-modern">
              <div className="stat-icon-wrapper green">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-details">
                <h3>{stats.completedEvents}</h3>
                <p>Events Completed</p>
              </div>
            </div>
            
            <div className="stat-card-modern">
              <div className="stat-icon-wrapper orange">
                <i className="fas fa-wallet"></i>
              </div>
              <div className="stat-details">
                <h3>{formatCurrency(stats.totalSpent)}</h3>
                <p>Total Bookings Value</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="profile-grid-layout">
          {/* Left Column - Account Info */}
          <div className="profile-left-column">
            <div className="profile-card">
              <div className="card-header">
                <h2>Account Information</h2>
              </div>
              <div className="card-body">
                <div className="info-row">
                  <span className="info-label">
                    <i className="fas fa-user"></i> Full Name
                  </span>
                  <span className="info-value">{user?.name || 'Not Set'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">
                    <i className="fas fa-envelope"></i> Email
                  </span>
                  <span className="info-value">{user?.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">
                    <i className="fas fa-phone"></i> Phone
                  </span>
                  <span className="info-value">{user?.phone || 'Not Set'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">
                    <i className="fas fa-map-marker-alt"></i> Location City
                  </span>
                  <span className="info-value">{user?.city || 'Not Set'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">
                    <i className="fas fa-shield-alt"></i> Account Status
                  </span>
                  <span className="info-value">
                    {user?.isVerified ? 
                      <span style={{color: '#10b981'}}><i className="fas fa-check-circle"></i> Verified</span> : 
                      <span style={{color: '#64748b'}}><i className="fas fa-clock"></i> Unverified</span>
                    }
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-card">
              <div className="card-header">
                <h2>Quick Actions</h2>
              </div>
              <div className="card-body">
                <button className="action-btn" onClick={() => navigate('/browse')}>
                  <i className="fas fa-search"></i>
                  <span>Explore Talents</span>
                </button>
                <button className="action-btn" onClick={() => navigate('/bookings')}>
                  <i className="fas fa-ticket-alt"></i>
                  <span>View All Bookings</span>
                </button>
                {user?.role === 'artist' && (
                  <>
                    <button className="action-btn" onClick={() => navigate('/host-event')}>
                      <i className="fas fa-edit"></i>
                      <span>Manage Service Profile</span>
                    </button>
                    <button className="action-btn" onClick={() => navigate('/artist-dashboard')}>
                      <i className="fas fa-chart-line"></i>
                      <span>Artist Dashboard</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Activity */}
          <div className="profile-right-column">
            <div className="profile-card">
              <div className="card-header">
                <h2>Recent Activity</h2>
                <button className="view-all-link" onClick={() => navigate('/bookings')}>
                  View All →
                </button>
              </div>
              <div className="card-body">
                {recentBookings.length > 0 ? (
                  <div className="activity-list">
                    {recentBookings.map(booking => (
                      <div key={booking._id} className="activity-item">
                        <div className="activity-icon">
                          <i className="fas fa-ticket-alt"></i>
                        </div>
                        <div className="activity-details">
                          <h4>{booking.packageName || 'Service Package'}</h4>
                          <p className="activity-meta">
                            <i className="fas fa-tag"></i> {booking.serviceId?.name || 'Talent Booking'} 
                            <span className="separator">•</span>
                            <i className="fas fa-rupee-sign"></i> {formatCurrency(booking.amount)}
                          </p>
                          <p className="activity-date">
                            <i className="fas fa-clock"></i> {new Date(booking.eventDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`activity-status ${booking.status}`}>
                          {booking.status === 'confirmed' ? 
                            <i className="fas fa-check-circle"></i> : 
                            booking.status === 'cancelled' ? 
                            <i className="fas fa-times-circle"></i> : 
                            <i className="fas fa-clock"></i>
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-activity">
                    <i className="fas fa-inbox empty-icon"></i>
                    <p>No bookings yet</p>
                    <button className="btn-primary-small" onClick={() => navigate('/browse')}>
                      <i className="fas fa-search"></i> Browse Talent
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="profile-card">
              <div className="card-header">
                <h2>Achievements</h2>
              </div>
              <div className="card-body">
                <div className="achievements-grid">
                  <div className={`achievement-badge ${stats.totalBookings >= 1 ? 'earned' : 'locked'}`}>
                    <span className="badge-icon">
                      <i className="fas fa-star"></i>
                    </span>
                    <p>First Booking</p>
                  </div>
                  <div className={`achievement-badge ${stats.totalBookings >= 5 ? 'earned' : 'locked'}`}>
                    <span className="badge-icon">
                      <i className="fas fa-medal"></i>
                    </span>
                    <p>Platform Regular</p>
                  </div>
                  <div className={`achievement-badge ${stats.totalBookings >= 10 ? 'earned' : 'locked'}`}>
                    <span className="badge-icon">
                      <i className="fas fa-crown"></i>
                    </span>
                    <p>VIP Patron</p>
                  </div>
                  <div className={`achievement-badge ${stats.completedEvents >= 5 ? 'earned' : 'locked'}`}>
                    <span className="badge-icon">
                      <i className="fas fa-theater-masks"></i>
                    </span>
                    <p>Completed Bookings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
