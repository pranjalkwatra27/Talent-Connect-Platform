import { useState } from 'react';

const openings = [
  {
    id: 1, title: 'Senior Full Stack Engineer', dept: 'Engineering', location: 'Remote / Delhi NCR',
    type: 'Full-time', salary: '₹18–28 LPA',
    desc: 'Lead modern React & Node.js architectures, design scalable APIs, and implement AI verification tools.',
    skills: ['React', 'Node.js', 'MongoDB', 'Express', 'AI/OCR'],
  },
  {
    id: 2, title: 'Lead Product Designer (UI/UX)', dept: 'Design', location: 'Remote / Mumbai',
    type: 'Full-time', salary: '₹14–22 LPA',
    desc: 'Design intuitive, state-of-the-art experiences for event organizers, couples, and creative talent partners.',
    skills: ['Figma', 'Design Systems', 'Micro-interactions', 'User Research'],
  },
  {
    id: 3, title: 'Artist Relations & Partnerships Lead', dept: 'Business', location: 'Pan-India',
    type: 'Full-time', salary: '₹10–18 LPA',
    desc: 'Onboard top bridal makeup artists, celebrity anchors, DJs, and wedding bands across metro hubs.',
    skills: ['Talent Partnerships', 'Community Building', 'Industry Relations'],
  },
  {
    id: 4, title: 'AI & Verification Operations Specialist', dept: 'Operations', location: 'Delhi NCR',
    type: 'Full-time', salary: '₹8–14 LPA',
    desc: 'Manage cryptographic DigiLocker credentials verification and train OCR models for certificate detection.',
    skills: ['Document Verification', 'DigiLocker Gateway', 'Process Optimization'],
  },
];

const perks = [
  { icon: '🏡', title: 'Remote-First Culture', desc: 'Work from wherever you are most productive in India.' },
  { icon: '📈', title: 'Generous ESOPs', desc: 'True ownership in building India’s largest talent platform.' },
  { icon: '🏥', title: 'Premium Health Insurance', desc: 'Comprehensive medical cover for you and your family.' },
  { icon: '🎓', title: 'Annual Learning Grant', desc: '₹25,000 per year dedicated to courses, workshops, and books.' },
  { icon: '🌴', title: 'Flexible Paid Time Off', desc: 'Recharge when you need it without micromanagement.' },
  { icon: '🚀', title: 'Fast-Moving High Craft', desc: 'Direct impact with weekly shipped production features.' },
];

const depts = ['All', 'Engineering', 'Design', 'Business', 'Operations'];

const Careers = () => {
  const [filter, setFilter] = useState('All');
  const [appliedJob, setAppliedJob] = useState(null);

  const filtered = filter === 'All' ? openings : openings.filter(o => o.dept === filter);

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
            <span style={{ color: '#10b981' }}>●</span> We Are Hiring Passionate Builders
          </div>
          <h1 style={{
            color: 'white', fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
            fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.02em'
          }}>
            Careers at TalentConnect
          </h1>
          <p style={{
            color: '#cbd5e1', fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            maxWidth: '680px', margin: '0 auto', lineHeight: 1.6
          }}>
            Join us in empowering thousands of creative professionals and making event planning seamless across India.
          </p>
        </div>
      </section>

      {/* ── PERKS & CULTURE ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Why Join Us
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>
            Life, Culture & Benefits
          </h2>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px', marginBottom: '60px'
        }}>
          {perks.map((p, i) => (
            <div key={i} style={{
              background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px',
              padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{p.icon}</div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>{p.title}</h3>
              <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>

        {/* ── OPEN ROLES FILTER ── */}
        <div id="openings" style={{ textAlign: 'center', marginBottom: '30px' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Opportunities
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginTop: '6px', marginBottom: '20px' }}>
            Open Positions ({filtered.length})
          </h2>

          {/* Dept filters */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {depts.map(d => (
              <button
                key={d}
                onClick={() => setFilter(d)}
                style={{
                  padding: '8px 18px', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem',
                  border: `1.5px solid ${filter === d ? 'var(--primary)' : '#e2e8f0'}`,
                  background: filter === d ? 'var(--primary)' : '#ffffff',
                  color: filter === d ? '#ffffff' : '#475569',
                  cursor: 'pointer', transition: 'all 0.2s ease'
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Roles List */}
        <div style={{ display: 'grid', gap: '18px', maxWidth: '900px', margin: '0 auto 60px' }}>
          {filtered.map(job => (
            <div key={job.id} style={{
              background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px',
              padding: '28px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px'
            }}>
              <div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{job.title}</h3>
                  <span style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                    {job.dept}
                  </span>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '12px', maxWidth: '540px' }}>{job.desc}</p>
                <div style={{ display: 'flex', gap: '16px', color: '#475569', fontSize: '0.85rem', fontWeight: 600, flexWrap: 'wrap' }}>
                  <span>📍 {job.location}</span>
                  <span>💼 {job.type}</span>
                  <span>💰 {job.salary}</span>
                </div>
              </div>

              <button
                onClick={() => setAppliedJob(job)}
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white',
                  border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 800,
                  fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.25)'
                }}
              >
                Apply Now →
              </button>
            </div>
          ))}
        </div>

        {/* Application Modal */}
        {appliedJob && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15,23,42,0.7)',
            backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
          }}>
            <div style={{
              background: '#ffffff', borderRadius: '24px', padding: '36px', width: '100%',
              maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>Apply: {appliedJob.title}</h3>
                <button onClick={() => setAppliedJob(null)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>
                Send your resume or portfolio to our recruitment team at <strong>careers@talentconnect.in</strong> with subject &quot;Application: {appliedJob.title}&quot;.
              </p>
              <button
                onClick={() => setAppliedJob(null)}
                style={{ width: '100%', padding: '12px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}
              >
                Got It
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Careers;
