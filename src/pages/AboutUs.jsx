import { Link } from 'react-router-dom';

const AboutUs = () => {
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
            <span style={{ color: '#10b981' }}>●</span> Redefining Event Entertainment & Artist Booking
          </div>
          <h1 style={{
            color: 'white', fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
            fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}>
            About TalentConnect
          </h1>
          <p style={{
            color: '#cbd5e1', fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            maxWidth: '700px', margin: '0 auto', lineHeight: 1.6
          }}>
            India&apos;s premier platform connecting event organizers, couples, and celebration hosts with AI & DigiLocker verified talent professionals.
          </p>
        </div>
      </section>

      {/* ── CORE STATS / HIGHLIGHTS ── */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '30px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--primary)' }}>20,000+</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Happy Event Bookings</div>
            </div>
            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#10b981' }}>100%</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>AI & DigiLocker Verified</div>
            </div>
            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#f59e0b' }}>4.9 / 5.0</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Average Client Rating</div>
            </div>
            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a' }}>12+</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Curated Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT SECTIONS ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px 80px' }}>
        
        {/* Mission Statement */}
        <div style={{
          background: '#ffffff', borderRadius: '24px', padding: '40px',
          border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)',
          marginBottom: '50px', textAlign: 'center'
        }}>
          <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Our Mission & Purpose
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '8px 0 16px' }}>
            Making Celebrations Flawless, Safe & Transparent
          </h2>
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: '850px', margin: '0 auto' }}>
            We eliminate the guesswork and stress from event planning. Every singer, makeup artist, wedding decorator, DJ, and photographer on TalentConnect is authenticated through government identity repositories and accredited credentials, ensuring 100% peace of mind for every event host.
          </p>
        </div>

        {/* Pillars / Value Props Grid */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Platform Pillars
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>
            Why Clients & Artists Choose TalentConnect
          </h2>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px', marginBottom: '60px'
        }}>
          <div style={{
            background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px',
            padding: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)'
          }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '18px' }}>
              <i className="fas fa-shield-alt"></i>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
              AI Document Trust Engine
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Automated OCR scanning inspects document signatures, tamper-evident watermarks, and validity dates with instant confidence scores.
            </p>
          </div>

          <div style={{
            background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px',
            padding: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)'
          }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(11,57,84,0.1)', color: '#0b3954', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '18px' }}>
              <i className="fas fa-lock"></i>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
              DigiLocker Integration
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Direct integration with India&apos;s National Document Gateway to cryptographically verify Aadhaar IDs and accredited vocational certifications.
            </p>
          </div>

          <div style={{
            background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px',
            padding: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)'
          }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '18px' }}>
              <i className="fas fa-hand-holding-usd"></i>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
              Escrow Protected Payments
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Your booking funds remain safely in escrow and are released only after the service is successfully executed and approved.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)',
          borderRadius: '24px', padding: '50px 30px', textAlign: 'center',
          color: 'white', boxShadow: '0 20px 40px rgba(79,70,229,0.25)'
        }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900, marginBottom: '12px' }}>
            Ready to Plan Your Next Unforgettable Event?
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#e0e7ff', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.6 }}>
            Explore certified wedding planners, singers, caterers, makeup artists, and decorators today.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link
              to="/browse"
              style={{
                background: 'white', color: '#4f46e5', padding: '12px 28px',
                borderRadius: '12px', fontWeight: 800, textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
              }}
            >
              Explore Talent
            </Link>
            <Link
              to="/login?signup=true"
              style={{
                background: 'rgba(255,255,255,0.15)', color: 'white', padding: '12px 28px',
                borderRadius: '12px', fontWeight: 800, textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              Become a Partner
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;
