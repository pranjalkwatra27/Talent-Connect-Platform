const Press = () => {
  const coverage = [
    {
      outlet: 'Economic Times',
      headline: 'TalentConnect raises seed round to disrupt India\'s ₹2,000 Cr event industry',
      date: 'June 2026',
      logo: 'ET',
      color: '#f59e0b',
    },
    {
      outlet: 'YourStory',
      headline: 'Meet TalentConnect — the app making it effortless to book verified event artists anywhere in India',
      date: 'May 2026',
      logo: 'YS',
      color: '#ec4899',
    },
    {
      outlet: 'Inc42',
      headline: 'How TalentConnect is building trust in India\'s fragmented event services market',
      date: 'April 2026',
      logo: '42',
      color: '#3b82f6',
    },
    {
      outlet: 'Business Standard',
      headline: 'Event professionals earn 3x more after listing on TalentConnect, platform data shows',
      date: 'March 2026',
      logo: 'BS',
      color: '#8b5cf6',
    },
  ];

  const facts = [
    { value: '10,000+', label: 'Verified Artists' },
    { value: '50,000+', label: 'Bookings Done' },
    { value: '100+', label: 'Cities' },
    { value: '₹5 Cr+', label: 'Paid to Artists' },
  ];

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
            <span style={{ color: '#38bdf8' }}>●</span> Media, News & Press Releases
          </div>
          <h1 style={{
            color: 'white', fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
            fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}>
            TalentConnect in the News
          </h1>
          <p style={{
            color: '#cbd5e1', fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            maxWidth: '700px', margin: '0 auto', lineHeight: 1.6
          }}>
            Official brand stories, industry milestones, and media kit resources for journalists and creators.
          </p>
        </div>
      </section>

      {/* ── NUMBERS ── */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '56px 24px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {facts.map(f => (
            <div key={f.label} style={{
              background: 'var(--card-bg)', border: '1px solid var(--border)',
              borderRadius: '16px', padding: '28px 20px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{f.value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>{f.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── COVERAGE ── */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 24px' }}>
        <h2 style={{ color: 'var(--text)', fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px' }}>Featured Coverage</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '0.95rem' }}>What the media is saying about us</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '60px' }}>
          {coverage.map(c => (
            <div key={c.outlet} style={{
              background: 'var(--card-bg)', border: '1px solid var(--border)',
              borderRadius: '16px', padding: '22px 26px',
              display: 'flex', alignItems: 'center', gap: '20px'
            }}>
              {/* Outlet logo placeholder */}
              <div style={{
                width: '52px', height: '52px', borderRadius: '12px', flexShrink: 0,
                background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 900, fontSize: '1rem', letterSpacing: '-0.5px'
              }}>{c.logo}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ color: c.color, fontWeight: 700, fontSize: '0.85rem' }}>{c.outlet}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{c.date}</span>
                </div>
                <p style={{ color: 'var(--text)', fontWeight: 500, fontSize: '0.97rem', lineHeight: 1.5 }}>{c.headline}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Brand assets + contact */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {/* Brand kit */}
          <div style={{
            background: 'var(--card-bg)', border: '1px solid var(--border)',
            borderRadius: '20px', padding: '32px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '14px' }}>🎨</div>
            <h3 style={{ color: 'var(--text)', fontWeight: 700, marginBottom: '8px' }}>Brand Kit</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: '20px' }}>
              Logos, colour palettes, typography, and brand usage guidelines for media use.
            </p>
            <a href="mailto:press@talentconnect.in?subject=Brand Kit Request" style={{
              background: 'var(--primary)', color: 'white', padding: '10px 24px',
              borderRadius: '30px', textDecoration: 'none', fontWeight: 700, fontSize: '0.88rem'
            }}>Request Brand Kit</a>
          </div>
          {/* Press contact */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(236,72,153,0.08))',
            border: '1px solid var(--border)', borderRadius: '20px', padding: '32px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '14px' }}>📨</div>
            <h3 style={{ color: 'var(--text)', fontWeight: 700, marginBottom: '8px' }}>Press Enquiries</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: '8px' }}>
              For interviews, comments, or embargo requests, reach our PR team directly.
            </p>
            <p style={{ color: 'var(--text)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '20px' }}>
              press@talentconnect.in
            </p>
            <a href="mailto:press@talentconnect.in" style={{
              background: 'var(--primary)', color: 'white', padding: '10px 24px',
              borderRadius: '30px', textDecoration: 'none', fontWeight: 700, fontSize: '0.88rem'
            }}>Email Press Team</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Press;
