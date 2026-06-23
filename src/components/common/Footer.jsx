import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer" style={{ padding: '60px 0 30px' }}>
      <div className="container">
        {/* Top footer with 5 grids */}
        <div className="footer-content" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '30px',
          marginBottom: '40px'
        }}>
          {/* Column 1: TalentConnect */}
          <div className="footer-section">
            <h4 style={{ color: 'white', fontWeight: '700', marginBottom: '20px', fontSize: '18px' }}>TalentConnect</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '10px' }}><Link to="/about" style={{ color: '#94a3b8', textDecoration: 'none', transition: '0.3s' }}>About Us</Link></li>
              <li style={{ marginBottom: '10px' }}><Link to="/careers" style={{ color: '#94a3b8', textDecoration: 'none', transition: '0.3s' }}>Careers</Link></li>
              <li style={{ marginBottom: '10px' }}><Link to="/blog" style={{ color: '#94a3b8', textDecoration: 'none', transition: '0.3s' }}>Blog</Link></li>
              <li style={{ marginBottom: '10px' }}><Link to="/press" style={{ color: '#94a3b8', textDecoration: 'none', transition: '0.3s' }}>Press</Link></li>
            </ul>
          </div>

          
          {/* Column 3: Support */}
          <div className="footer-section">
            <h4 style={{ color: 'white', fontWeight: '700', marginBottom: '20px', fontSize: '18px' }}>Support</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '10px' }}><Link to="/help" style={{ color: '#94a3b8', textDecoration: 'none', transition: '0.3s' }}>Help Center</Link></li>
              <li style={{ marginBottom: '10px' }}><Link to="/faqs" style={{ color: '#94a3b8', textDecoration: 'none', transition: '0.3s' }}>FAQs</Link></li>
              <li style={{ marginBottom: '10px' }}><Link to="/contact" style={{ color: '#94a3b8', textDecoration: 'none', transition: '0.3s' }}>Contact Us</Link></li>
            </ul>
          </div>

          
          {/* Column 4: Legal */}
          <div className="footer-section">
            <h4 style={{ color: 'white', fontWeight: '700', marginBottom: '20px', fontSize: '18px' }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '10px' }}><Link to="/privacy" style={{ color: '#94a3b8', textDecoration: 'none', transition: '0.3s' }}>Privacy Policy</Link></li>
              <li style={{ marginBottom: '10px' }}><Link to="/terms" style={{ color: '#94a3b8', textDecoration: 'none', transition: '0.3s' }}>Terms & Conditions</Link></li>
              <li style={{ marginBottom: '10px' }}><Link to="/refund-policy" style={{ color: '#94a3b8', textDecoration: 'none', transition: '0.3s' }}>Refund Policy</Link></li>
              <li style={{ marginBottom: '10px' }}><Link to="/cancellation-policy" style={{ color: '#94a3b8', textDecoration: 'none', transition: '0.3s' }}>Cancellation Policy</Link></li>
            </ul>
          </div>
          
          {/* Column 5: Partners */}
          <div className="footer-section">
            <h4 style={{ color: 'white', fontWeight: '700', marginBottom: '20px', fontSize: '18px' }}>Partners</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '10px' }}><Link to="/login?signup=true" style={{ color: '#94a3b8', textDecoration: 'none', transition: '0.3s' }}>Register as Professional</Link></li>
              <li style={{ marginBottom: '10px' }}><Link to="/organizer-verification" style={{ color: '#94a3b8', textDecoration: 'none', transition: '0.3s' }}>Verification Process</Link></li>
              <li style={{ marginBottom: '10px' }}><Link to="/#pricing" style={{ color: '#94a3b8', textDecoration: 'none', transition: '0.3s' }}>Subscription Plans</Link></li>
              <li style={{ marginBottom: '10px' }}><Link to="/partner-resources" style={{ color: '#94a3b8', textDecoration: 'none', transition: '0.3s' }}>Partner Resources</Link></li>
            </ul>
          </div>

        </div>

        {/* Social media & Newsletter Banner */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '30px 0',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* Follow Us */}
          <div>
            <h5 style={{ color: 'white', fontWeight: '700', marginBottom: '15px', fontSize: '16px' }}>Follow Us</h5>
            <div style={{ display: 'flex', gap: '15px' }}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white', background: 'rgba(255,255,255,0.08)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' }}><i className="fab fa-instagram"></i></a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white', background: 'rgba(255,255,255,0.08)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' }}><i className="fab fa-facebook-f"></i></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white', background: 'rgba(255,255,255,0.08)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' }}><i className="fab fa-youtube"></i></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white', background: 'rgba(255,255,255,0.08)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' }}><i className="fab fa-linkedin-in"></i></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white', background: 'rgba(255,255,255,0.08)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' }}><i className="fab fa-twitter"></i></a>
            </div>
          </div>

          {/* Newsletter Section */}
          <div style={{ maxWidth: '450px' }}>
            <h5 style={{ color: 'white', fontWeight: '700', marginBottom: '8px', fontSize: '16px' }}>Newsletter</h5>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '12px' }}>
              "Get event planning tips, offers, and updates directly in your inbox."
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }} style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                required 
                style={{
                  padding: '10px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '30px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  flex: 1
                }}
              />
              <button 
                type="submit" 
                style={{
                  padding: '10px 20px',
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: '0.3s'
                }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="footer-bottom" style={{ textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
          <p>© 2026 TalentConnect. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
