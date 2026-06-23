import { useNavigate } from 'react-router-dom';

const resources = [
  {
    category: '📸 Profile & Portfolio',
    items: [
      { icon: '✍️', title: 'Writing a Killer Bio', desc: 'How to describe your service in 3 lines that make clients want to book you.', badge: 'Guide' },
      { icon: '📷', title: 'Portfolio Photo Tips', desc: 'How to photograph your work to stand out in search results.', badge: 'Tips' },
      { icon: '💰', title: 'Pricing Your Services', desc: 'Market-rate data and frameworks to charge what you\'re truly worth.', badge: 'Guide' },
    ],
  },
  {
    category: '📅 Managing Bookings',
    items: [
      { icon: '🗓️', title: 'Blocking Your Calendar', desc: 'Step-by-step: set unavailable dates so you never get double-booked.', badge: 'How-to' },
      { icon: '💬', title: 'Client Message Templates', desc: 'Ready-to-copy replies for inquiries, confirmations, and follow-ups.', badge: 'Templates' },
      { icon: '⭐', title: 'Earning 5-Star Reviews', desc: 'What top-rated artists do differently to consistently get great reviews.', badge: 'Strategy' },
    ],
  },
  {
    category: '📣 Growing Your Business',
    items: [
      { icon: '📱', title: 'Social Media Promotion', desc: 'How to share your TalentConnect profile on Instagram, WhatsApp, and more.', badge: 'Marketing' },
      { icon: '🤝', title: 'Referral Programme', desc: 'Earn ₹500 for every artist you refer who gets verified and books their first job.', badge: 'Earn More' },
      { icon: '📦', title: 'Creating Service Packages', desc: 'Bundle your offerings to increase booking value and average order size.', badge: 'Strategy' },
    ],
  },
];

const faqs = [
  { q: 'How do I update my pricing?', a: 'Dashboard → My Services → Edit Service → Update pricing.' },
  { q: 'How do I withdraw earnings?', a: 'Dashboard → Total Earnings → Withdraw. Bank transfer in 2–3 days.' },
  { q: 'Can I offer multiple packages?', a: 'Yes — add Basic, Standard, and Premium tiers when listing your service.' },
  { q: 'How do I respond to a booking request?', a: 'You\'ll get a notification. Go to Client Bookings to accept, message, or decline.' },
];

const PartnerResources = () => {
  const navigate = useNavigate();

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f0c29 0%, #2d1b69 100%)',
        padding: '80px 24px 64px', textAlign: 'center'
      }}>
        <span style={{
          display: 'inline-block', background: 'rgba(139,92,246,0.25)',
          color: '#a78bfa', padding: '5px 16px', borderRadius: '20px',
          fontSize: '0.78rem', fontWeight: 700, letterSpacing: '1.5px', marginBottom: '18px'
        }}>FOR ARTISTS & PROFESSIONALS</span>
        <h1 style={{ color: 'white', fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', fontWeight: 800, marginBottom: '14px', lineHeight: 1.2 }}>
          Everything you need to grow your business on TalentConnect
        </h1>
        <p style={{ color: '#c4b5fd', maxWidth: '580px', margin: '0 auto 36px', fontSize: '1.02rem', lineHeight: 1.7 }}>
          Guides, templates, strategies, and tools — curated by our team of event industry experts.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/organizer-verification')} style={{
            background: 'var(--primary)', color: 'white', padding: '13px 32px',
            borderRadius: '30px', border: 'none', fontWeight: 700, fontSize: '0.97rem', cursor: 'pointer'
          }}>Get Verified & Start Earning</button>
          <button onClick={() => navigate('/organizer-dashboard')} style={{
            background: 'rgba(255,255,255,0.1)', color: 'white', padding: '13px 32px',
            borderRadius: '30px', border: '1px solid rgba(255,255,255,0.25)',
            fontWeight: 700, fontSize: '0.97rem', cursor: 'pointer'
          }}>Go to Dashboard</button>
        </div>

        {/* Stat strip */}
        <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', marginTop: '48px', flexWrap: 'wrap' }}>
          {[
            { v: '₹5 Cr+', l: 'Paid to artists' },
            { v: '10,000+', l: 'Verified artists' },
            { v: '3.2x', l: 'Avg earnings increase' },
          ].map(s => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <div style={{ color: 'white', fontWeight: 800, fontSize: '1.5rem' }}>{s.v}</div>
              <div style={{ color: '#a78bfa', fontSize: '0.82rem', marginTop: '2px' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RESOURCE SECTIONS ── */}
      {resources.map(section => (
        <div key={section.category} style={{ maxWidth: '1100px', margin: '0 auto', padding: '56px 24px 0' }}>
          <h2 style={{ color: 'var(--text)', fontWeight: 800, fontSize: '1.4rem', marginBottom: '24px' }}>{section.category}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {section.items.map(r => (
              <div key={r.title} style={{
                background: 'var(--card-bg)', border: '1px solid var(--border)',
                borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px'
              }}>
                <div style={{ fontSize: '1.8rem' }}>{r.icon}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ color: 'var(--text)', fontWeight: 700, fontSize: '0.97rem', flex: 1 }}>{r.title}</h3>
                  <span style={{
                    background: 'rgba(139,92,246,0.12)', color: 'var(--primary)',
                    padding: '3px 10px', borderRadius: '16px', fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap'
                  }}>{r.badge}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.87rem', lineHeight: 1.65 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* ── QUICK ANSWERS ── */}
      <div style={{ maxWidth: '1100px', margin: '60px auto 0', padding: '0 24px' }}>
        <h2 style={{ color: 'var(--text)', fontWeight: 800, fontSize: '1.4rem', marginBottom: '20px' }}>Quick Answers</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px', marginBottom: '72px' }}>
          {faqs.map(f => (
            <div key={f.q} style={{
              background: 'var(--card-bg)', border: '1px solid var(--border)',
              borderRadius: '14px', padding: '18px 20px'
            }}>
              <p style={{ color: 'var(--text)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px' }}>Q: {f.q}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.87rem', lineHeight: 1.65 }}>A: {f.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA FOOTER ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(236,72,153,0.06))',
        borderTop: '1px solid var(--border)', padding: '60px 24px', textAlign: 'center'
      }}>
        <h2 style={{ color: 'var(--text)', fontWeight: 800, fontSize: '1.4rem', marginBottom: '10px' }}>Got a question not covered here?</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Our artist support team responds within 2 hours.</p>
        <a href="mailto:artists@talentconnect.in" style={{
          background: 'var(--primary)', color: 'white', padding: '13px 32px',
          borderRadius: '30px', textDecoration: 'none', fontWeight: 700
        }}>📩 Contact Artist Support</a>
      </div>
    </div>
  );
};

export default PartnerResources;
