import { useState } from 'react';

const openings = [
  {
    id: 1, title: 'Senior Frontend Developer', dept: 'Engineering', location: 'Remote / Mumbai',
    type: 'Full-time', salary: '₹18–28 LPA',
    desc: 'Lead our React frontend, build beautiful UIs, and set the bar for code quality across the team.',
    skills: ['React', 'TypeScript', 'Firebase', 'CSS Animation'],
  },
  {
    id: 2, title: 'Backend Engineer (Node.js)', dept: 'Engineering', location: 'Bangalore',
    type: 'Full-time', salary: '₹15–24 LPA',
    desc: 'Design scalable APIs, manage Firebase infrastructure, and ensure our platform handles millions of bookings.',
    skills: ['Node.js', 'Firebase', 'REST APIs', 'Cloud Functions'],
  },
  {
    id: 3, title: 'Product Designer (UI/UX)', dept: 'Design', location: 'Remote',
    type: 'Full-time', salary: '₹12–20 LPA',
    desc: 'Own the entire design system — from wireframes to polished handoffs. Shape how India books event talent.',
    skills: ['Figma', 'Prototyping', 'Design Systems', 'User Research'],
  },
  {
    id: 4, title: 'Growth & Marketing Manager', dept: 'Marketing', location: 'Delhi / Remote',
    type: 'Full-time', salary: '₹10–18 LPA',
    desc: 'Drive user acquisition, run performance campaigns, and build TalentConnect into a household name.',
    skills: ['Performance Marketing', 'SEO', 'Analytics', 'Content Strategy'],
  },
  {
    id: 5, title: 'Artist Partnerships (BD)', dept: 'Business', location: 'Pan India',
    type: 'Full-time', salary: '₹8–14 LPA',
    desc: 'Onboard top artists, build relationships with wedding planners, and grow our verified network.',
    skills: ['Business Development', 'CRM', 'Negotiation', 'Events Industry'],
  },
  {
    id: 6, title: 'Customer Experience Lead', dept: 'Support', location: 'Remote',
    type: 'Full-time', salary: '₹6–10 LPA',
    desc: 'Be the voice of TalentConnect. Resolve issues fast, build processes, and turn customers into fans.',
    skills: ['Customer Success', 'Zendesk', 'Communication', 'Hindi/English'],
  },
];

const perks = [
  { icon: '🏡', title: 'Remote First', desc: 'Work from anywhere in India. We judge output, not attendance.' },
  { icon: '📈', title: 'ESOPs for Early Team', desc: 'Own a slice of what we\'re building together.' },
  { icon: '🏥', title: 'Health Cover', desc: '₹5L GMC for you + family. Mental health included.' },
  { icon: '🎓', title: '₹20,000 Learning Budget', desc: 'Courses, books, conferences — invest in yourself.' },
  { icon: '🌴', title: 'Flexible PTO', desc: 'No leave counting. Take time when you need it.' },
  { icon: '🎉', title: 'Quarterly Offsites', desc: 'Team trips, celebrations, and real human connection.' },
  { icon: '⚡', title: 'Fast Shipping Culture', desc: 'We ship weekly. Your work is seen and used immediately.' },
  { icon: '🤝', title: 'Flat Hierarchy', desc: 'Direct access to founders. Zero politics. All craft.' },
];

const depts = ['All', 'Engineering', 'Design', 'Marketing', 'Business', 'Support'];

const Careers = () => {
  const [filter, setFilter] = useState('All');
  const [openJob, setOpenJob] = useState(null);
  const filtered = filter === 'All' ? openings : openings.filter(o => o.dept === filter);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

      {/* ── HERO ── */}
      <div style={{ position: 'relative', height: '520px', overflow: 'hidden' }}>
        <img
          src="/careers_team.jpg"
          alt="TalentConnect team"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
        />
        {/* dark gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(10,10,30,0.82) 0%, rgba(80,20,80,0.6) 100%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px'
        }}>
          <span style={{
            display: 'inline-block', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)',
            color: 'white', padding: '6px 18px', borderRadius: '30px', fontSize: '0.82rem', fontWeight: 700,
            letterSpacing: '1.5px', marginBottom: '18px', border: '1px solid rgba(255,255,255,0.25)'
          }}>WE'RE HIRING</span>
          <h1 style={{ color: 'white', fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '16px', maxWidth: '700px' }}>
            Build something that matters with us
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '1.1rem', maxWidth: '540px', marginBottom: '32px', lineHeight: 1.7 }}>
            We're building India's most trusted platform for event professionals. Come shape it.
          </p>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="#openings" style={{
              background: 'var(--primary)', color: 'white', padding: '14px 34px',
              borderRadius: '50px', fontWeight: 700, textDecoration: 'none', fontSize: '1rem'
            }}>See Open Roles ↓</a>
            <a href="mailto:careers@talentconnect.in" style={{
              background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
              color: 'white', padding: '14px 34px', borderRadius: '50px',
              fontWeight: 700, textDecoration: 'none', fontSize: '1rem',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>Send Your Resume</a>
          </div>
        </div>
      </div>

      {/* ── NUMBERS STRIP ── */}
      <div style={{ background: 'var(--primary)', padding: '28px 24px' }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px', textAlign: 'center'
        }}>
          {[
            { value: '3 yrs', label: 'Founded' },
            { value: '47', label: 'Team members' },
            { value: '10K+', label: 'Artists listed' },
            { value: '50K+', label: 'Bookings completed' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ color: 'white', fontSize: '1.7rem', fontWeight: 800 }}>{s.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PERKS ── */}
      <section style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <h2 style={{ color: 'var(--text)', fontSize: '2rem', fontWeight: 800, marginBottom: '10px' }}>Why join us?</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
            We treat people like adults and invest in them accordingly.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '20px' }}>
          {perks.map(p => (
            <div key={p.title} style={{
              background: 'var(--card-bg)', border: '1px solid var(--border)',
              borderRadius: '16px', padding: '26px 22px',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{p.icon}</div>
              <h3 style={{ color: 'var(--text)', fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>{p.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.65 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── OPEN ROLES ── */}
      <section id="openings" style={{ padding: '0 24px 100px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
          <div>
            <h2 style={{ color: 'var(--text)', fontSize: '2rem', fontWeight: 800, marginBottom: '4px' }}>Open positions</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{filtered.length} role{filtered.length !== 1 ? 's' : ''} available</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {depts.map(d => (
              <button key={d} onClick={() => setFilter(d)} style={{
                padding: '7px 18px', borderRadius: '30px', border: '1.5px solid',
                borderColor: filter === d ? 'var(--primary)' : 'var(--border)',
                background: filter === d ? 'var(--primary)' : 'transparent',
                color: filter === d ? 'white' : 'var(--text-muted)',
                fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: '0.2s'
              }}>{d}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.map(job => (
            <div key={job.id}>
              <div
                onClick={() => setOpenJob(openJob === job.id ? null : job.id)}
                style={{
                  background: 'var(--card-bg)', border: `1.5px solid ${openJob === job.id ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: openJob === job.id ? '16px 16px 0 0' : '16px',
                  padding: '22px 28px', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px'
                }}>
                <div>
                  <h3 style={{ color: 'var(--text)', fontWeight: 700, fontSize: '1.08rem', marginBottom: '6px' }}>{job.title}</h3>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ background: 'rgba(139,92,246,0.12)', color: 'var(--primary)', padding: '3px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 }}>{job.dept}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.83rem' }}>📍 {job.location}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.83rem' }}>⏰ {job.type}</span>
                    <span style={{ color: '#22c55e', fontSize: '0.83rem', fontWeight: 600 }}>💰 {job.salary}</span>
                  </div>
                </div>
                <i className={`fas fa-chevron-${openJob === job.id ? 'up' : 'down'}`} style={{ color: 'var(--primary)' }} />
              </div>
              {openJob === job.id && (
                <div style={{
                  background: 'var(--card-bg)', border: '1.5px solid var(--primary)',
                  borderTop: '1px solid var(--border)', borderRadius: '0 0 16px 16px',
                  padding: '24px 28px'
                }}>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: '18px' }}>{job.desc}</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                    {job.skills.map(s => (
                      <span key={s} style={{
                        background: 'var(--border)', color: 'var(--text)',
                        padding: '4px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600
                      }}>{s}</span>
                    ))}
                  </div>
                  <a href={`mailto:careers@talentconnect.in?subject=Application — ${job.title}`} style={{
                    background: 'var(--primary)', color: 'white', padding: '11px 28px',
                    borderRadius: '30px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem'
                  }}>Apply for this role →</a>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '56px', background: 'var(--card-bg)', border: '1px solid var(--border)',
          borderRadius: '20px', padding: '40px', textAlign: 'center'
        }}>
          <p style={{ color: 'var(--text)', fontWeight: 700, fontSize: '1.15rem', marginBottom: '8px' }}>Don't see your role?</p>
          <p style={{ color: 'var(--text-muted)', marginBottom: '22px', fontSize: '0.95rem' }}>
            We love proactive people. Send us your work and why you'd be a great fit.
          </p>
          <a href="mailto:careers@talentconnect.in" style={{
            background: 'var(--primary)', color: 'white', padding: '12px 32px',
            borderRadius: '50px', textDecoration: 'none', fontWeight: 700
          }}>careers@talentconnect.in</a>
        </div>
      </section>
    </div>
  );
};

export default Careers;
