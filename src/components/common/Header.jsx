import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout, upgradeToArtist } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleBecomePartner = async () => {
    try {
      setMenuOpen(false);
      await upgradeToArtist();
      alert('Congratulations! Your account has been upgraded to an Artist Partner. Redirecting to verification...');
      navigate('/artist-verification');
    } catch (err) {
      console.error('Upgrade failed:', err);
      alert('Failed to upgrade account. Please try again.');
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (dropdownOpen) setDropdownOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);

  const isArtistUser = user && user.role === 'artist';

  return (
    <header className="header">
      <Link to="/" className="logo-container">
        <span className="logo-text">Talent</span>
        <img src="/logo.svg" alt="TalentConnect Logo" />
        <span className="logo-text">Connect</span>
      </Link>
      
      <button className={`menu-toggle ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <nav className={`nav ${menuOpen ? 'active' : ''}`}>
        {isArtistUser ? (
          <>
            <Link to="/" className={isActive('/') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/artist-dashboard" className={isActive('/artist-dashboard') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Artist Dashboard</Link>
            <Link to="/host-event" className={isActive('/host-event') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Manage Profile</Link>
            <Link to="/artist-verification" className={isActive('/artist-verification') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Verification</Link>
            <Link to="/bookings" className={isActive('/bookings') ? 'active' : ''} onClick={() => setMenuOpen(false)}>My Bookings</Link>
          </>
        ) : (
          <>
            <Link to="/" className={isActive('/') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/browse" className={isActive('/browse') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Explore Talent</Link>
            {!user && (
              <>
                <a href="/#pricing" onClick={() => setMenuOpen(false)}>Pricing Plans</a>
                <Link to="/login" onClick={() => setMenuOpen(false)}>Become a Partner</Link>
              </>
            )}
            {user && (
              <Link to="/bookings" className={isActive('/bookings') ? 'active' : ''} onClick={() => setMenuOpen(false)}>My Bookings</Link>
            )}
            {user && user.role === 'client' && (
              <a href="#" onClick={(e) => { e.preventDefault(); handleBecomePartner(); }}>Become a Partner</a>
            )}
          </>
        )}
      </nav>

      <div className="auth-buttons">
        {user ? (
          <div className="user-welcome active" onClick={toggleDropdown}>
            <i className="fas fa-user-circle"></i>
            <span>{user.name || 'User'}</span>
            <i className="fas fa-chevron-down" style={{ fontSize: '12px' }}></i>
            
            <div className={`user-dropdown ${dropdownOpen ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
              <div className="user-dropdown-header">
                <h4>{user.name || 'User'}</h4>
                <p>{user.email}</p>
                <span className="user-badge" style={{
                  display: 'inline-block',
                  fontSize: '10px',
                  background: user.role === 'artist' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                  color: user.role === 'artist' ? '#ec4899' : '#6366f1',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  marginTop: '4px',
                  textTransform: 'capitalize'
                }}>{user.role}</span>
              </div>
              <div className="user-dropdown-menu">
                <Link to="/profile" className="user-dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <i className="fas fa-user"></i>
                  <span>My Profile</span>
                </Link>
                 {user.role === 'client' && (
                  <>
                    <Link to="/bookings" className="user-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <i className="fas fa-ticket-alt"></i>
                      <span>My Bookings</span>
                    </Link>
                    <a href="#" className="user-dropdown-item" onClick={(e) => { e.preventDefault(); setDropdownOpen(false); handleBecomePartner(); }}>
                      <i className="fas fa-handshake"></i>
                      <span>Become a Partner</span>
                    </a>
                  </>
                )}
                {user.role === 'artist' && (
                  <>
                    <Link to="/host-event" className="user-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <i className="fas fa-edit"></i>
                      <span>Manage Service</span>
                    </Link>
                    <Link to="/artist-dashboard" className="user-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <i className="fas fa-chart-line"></i>
                      <span>Artist Dashboard</span>
                    </Link>
                    <Link to="/artist-verification" className="user-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <i className="fas fa-shield-alt"></i>
                      <span>Verification</span>
                    </Link>
                  </>
                )}
                <div className="user-dropdown-divider"></div>
                <a href="#" className="user-dropdown-item danger" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </a>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn login">Login</Link>
            <Link to="/login?signup=true" className="btn signup">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
