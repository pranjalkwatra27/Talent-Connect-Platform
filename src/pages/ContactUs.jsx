import { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ show: false, type: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setStatus({
        show: true,
        type: 'success',
        message: 'Thank you! Your message has been received. Our team will contact you within 24 hours.'
      });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setLoading(false);
      setTimeout(() => setStatus({ show: false, type: '', message: '' }), 5000);
    }, 600);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
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
            <span style={{ color: '#10b981' }}>●</span> 24/7 Dedicated Support Team
          </div>
          <h1 style={{
            color: 'white', fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
            fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.02em'
          }}>
            Get in Touch with TalentConnect
          </h1>
          <p style={{
            color: '#cbd5e1', fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            maxWidth: '650px', margin: '0 auto', lineHeight: 1.6
          }}>
            Have questions about artist bookings, verification status, or custom package escrow? We&apos;re here to help.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT & FORM GRID ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
          
          {/* Contact Info Card */}
          <div style={{
            background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px',
            padding: '40px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)',
            display: 'flex', flexDirection: 'column', gap: '30px'
          }}>
            <div>
              <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Direct Channels
              </span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>
                Contact Details
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                <i className="fas fa-envelope"></i>
              </div>
              <div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem' }}>Email Support</div>
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>support@talentconnect.in</div>
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>partners@talentconnect.in</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                <i className="fas fa-phone-alt"></i>
              </div>
              <div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem' }}>Phone & WhatsApp</div>
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>+91 98765 43210</div>
                <div style={{ color: '#64748b', fontSize: '0.82rem' }}>Mon–Sat, 9:00 AM – 8:00 PM IST</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem' }}>Headquarters</div>
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>TalentConnect Tower, Cyber City</div>
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Delhi NCR & Mumbai, India</div>
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div style={{
            background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px',
            padding: '40px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)'
          }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>
              Send a Message
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px' }}>
              Fill in your inquiry details and our specialist will respond promptly.
            </p>

            {status.show && (
              <div style={{
                background: status.type === 'success' ? '#dcfce7' : '#fee2e2',
                color: status.type === 'success' ? '#15803d' : '#991b1b',
                padding: '14px 18px', borderRadius: '12px', marginBottom: '20px',
                fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                <i className={`fas fa-${status.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Full Name *
                </label>
                <input
                  type="text" required placeholder="Your Name"
                  value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email" required placeholder="you@example.com"
                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Mobile Phone
                  </label>
                  <input
                    type="tel" placeholder="10-digit number"
                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Subject *
                </label>
                <input
                  type="text" required placeholder="Booking assistance, partnership, etc."
                  value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Your Message *
                </label>
                <textarea
                  rows="4" required placeholder="How can we help with your celebration?"
                  value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', resize: 'vertical' }}
                />
              </div>

              <button
                type="submit" disabled={loading}
                style={{
                  width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white',
                  fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(99,102,241,0.3)', marginTop: '8px'
                }}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactUs;
