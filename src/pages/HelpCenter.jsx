import { useNavigate } from 'react-router-dom';

const guides = [
  {
    emoji: '🔍', title: 'How to find an artist',
    steps: ['Go to Explore Talent', 'Filter by category, city, and budget', 'Compare profiles and reviews', 'Click Book Now'],
  },
  {
    emoji: '💳', title: 'How payments work',
    steps: ['30% advance secures your booking', 'Balance paid on/after event day', 'All payments are encrypted & safe', 'Refunds processed within 5–7 days'],
  },
  {
    emoji: '🎨', title: 'Artist registration',
    steps: ['Sign up as an Artist', 'Complete verification (email, phone, documents)', 'List your services', 'Start getting bookings'],
  },
  {
    emoji: '⭐', title: 'Getting reviews',
    steps: ['Deliver great service', 'Client gets a review prompt after event', 'Respond to every review', 'High ratings = more visibility'],
  },
];

const quickLinks = [
  { icon: '❓', title: 'FAQs', desc: 'Answers to common questions', link: '/faqs' },
  { icon: '💸', title: 'Refund Policy', desc: 'When and how refunds work', link: '/refund-policy' },
  { icon: '🚫', title: 'Cancellation Policy', desc: 'Cancellation windows explained', link: '/cancellation-policy' },
  { icon: '🔒', title: 'Privacy Policy', desc: 'How we protect your data', link: '/privacy' },
  { icon: '📋', title: 'Terms & Conditions', desc: 'Platform rules and usage', link: '/terms' },
  { icon: '🎯', title: 'Partner Resources', desc: 'Tools and guides for artists', link: '/partner-resources' },
];

const HelpCenter = () => {
  const navigate = useNavigate();

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* ── HERO split layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', minHeight: '400px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1a0533 0%, #2d1b69 100%)',
          padding: '60px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center'
        }}>
          <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '2px', marginBottom: '14px' }}>HELP CENTER</span>
          <h1 style={{ color: 'white', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.25, marginBottom: '16px' }}>
            How can we help you today?
          </h1>
          <p style={{ color: '#c4b5fd', lineHeight: 1.75, fontSize: '1rem', marginBottom: '28px' }}>
            Find guides, policies, and answers. Or reach our team directly — we reply within 2 hours.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a href="mailto:support@talentconnect.in" style={{
              background: 'var(--primary)', color: 'white', padding: '12px 28px',
              borderRadius: '30px', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem'
            }}>📧 Email Support</a>
            <a href="/faqs" style={{
              background: 'rgba(255,255,255,0.1)', color: 'white', padding: '12px 28px',
              borderRadius: '30px', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>Browse FAQs →</a>
          </div>
          {/* Trust bar */}
          <div style={{ display: 'flex', gap: '24px', marginTop: '36px', flexWrap: 'wrap' }}>
            {['⏱ 2 hr response', '✅ 98% resolved', '🌐 Hindi & English'].map(t => (
              <div key={t} style={{ color: '#a78bfa', fontSize: '0.83rem', fontWeight: 600 }}>{t}</div>
            ))}
          </div>
        </div>
        <div style={{ overflow: 'hidden', minHeight: '340px' }}>
          <img src="/help_hero.jpg" alt="TalentConnect support"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
        </div>
      </div>

      {/* ── QUICK LINKS ── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '64px 24px 0' }}>
        <h2 style={{ color: 'var(--text)', fontWeight: 800, fontSize: '1.6rem', marginBottom: '8px' }}>Browse by topic</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Jump to what you need</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px', marginBottom: '72px' }}>
          {quickLinks.map(q => (
            <a key={q.title} href={q.link} style={{
              background: 'var(--card-bg)', border: '1px solid var(--border)',
              borderRadius: '16px', padding: '22px', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: '16px', transition: '0.2s'
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                background: 'rgba(139,92,246,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem'
              }}>{q.icon}</div>
              <div>
                <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: '0.95rem' }}>{q.title}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '2px' }}>{q.desc}</div>
              </div>
              <i className="fas fa-chevron-right" style={{ color: 'var(--border)', marginLeft: 'auto' }} />
            </a>
          ))}
        </div>

        {/* ── HOW IT WORKS ── */}
        <h2 style={{ color: 'var(--text)', fontWeight: 800, fontSize: '1.6rem', marginBottom: '8px' }}>Step-by-step guides</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Common workflows explained simply</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '18px', marginBottom: '80px' }}>
          {guides.map(g => (
            <div key={g.title} style={{
              background: 'var(--card-bg)', border: '1px solid var(--border)',
              borderRadius: '18px', padding: '26px 22px'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '14px' }}>{g.emoji}</div>
              <h3 style={{ color: 'var(--text)', fontWeight: 700, fontSize: '1rem', marginBottom: '16px' }}>{g.title}</h3>
              <ol style={{ paddingLeft: '18px', margin: 0 }}>
                {g.steps.map((s, i) => (
                  <li key={i} style={{ color: 'var(--text-muted)', fontSize: '0.87rem', lineHeight: 1.7, marginBottom: '4px' }}>{s}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

      {/* ── CONTACT CTA ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(236,72,153,0.06))',
        borderTop: '1px solid var(--border)', padding: '60px 24px', textAlign: 'center'
      }}>
        <h2 style={{ color: 'var(--text)', fontWeight: 800, fontSize: '1.5rem', marginBottom: '10px' }}>Still need help?</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '440px', margin: '0 auto 24px' }}>
          Our support team is available Monday–Saturday, 9am–8pm IST. We also offer WhatsApp support.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="mailto:support@talentconnect.in" style={{
            background: 'var(--primary)', color: 'white', padding: '12px 30px',
            borderRadius: '30px', textDecoration: 'none', fontWeight: 700
          }}>📧 Email Us</a>
          <a href="https://wa.me/919999999999" style={{
            background: '#25D366', color: 'white', padding: '12px 30px',
            borderRadius: '30px', textDecoration: 'none', fontWeight: 700
          }}>💬 WhatsApp</a>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
