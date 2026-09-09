import { useState } from 'react';

const faqSections = [
  {
    label: '📅 Booking',
    color: '#8b5cf6',
    faqs: [
      {
        q: 'How do I book an artist on TalentConnect?',
        a: 'Browse artists on Explore Talent, open a profile you like, pick your event date, and click Book Now. You\'ll complete a quick checkout with a 30% advance payment to confirm your slot.'
      },
      {
        q: 'Can I see the artist\'s portfolio before booking?',
        a: 'Absolutely. Every artist profile includes a portfolio gallery, client reviews, service packages, pricing, and a verified badge if they\'ve cleared our identity check.'
      },
      {
        q: 'How far in advance should I book?',
        a: 'We recommend at least 4–8 weeks for weddings and 1–2 weeks for smaller events. Popular artists fill up fast during peak wedding season (Oct–Feb).'
      },
      {
        q: 'Can I book multiple artists in one order?',
        a: 'Yes. You can book a photographer, decorator, and DJ in separate transactions. We\'re working on a bundle checkout to make it even smoother.'
      },
    ],
  },
  {
    label: '💳 Payments & Refunds',
    color: '#ec4899',
    faqs: [
      {
        q: 'How much advance payment is required?',
        a: 'We collect 30% of the total at booking to hold your slot. The remaining 70% is settled on or after the event day, directly to the artist through our secure system.'
      },
      {
        q: 'What payment methods are accepted?',
        a: 'All major cards (Visa, Mastercard, Amex), UPI (GPay, PhonePe, Paytm), net banking, and select wallets. All transactions are SSL encrypted.'
      },
      {
        q: 'Can I cancel and get a refund?',
        a: '72+ hours before: 100% refund. 24–72 hours before: 50% refund. Under 24 hours: no refund. If the artist cancels, you get 100% back plus ₹500 credit.'
      },
      {
        q: 'How long do refunds take?',
        a: 'Approved refunds are credited within 5–7 business days to the original payment method. UPI refunds often arrive within 2–3 days.'
      },
    ],
  },
  {
    label: '🎨 For Artists',
    color: '#f59e0b',
    faqs: [
      {
        q: 'How do I list my services on TalentConnect?',
        a: 'Create an account, select "Artist" as your role, then complete the verification process (email, phone, document upload or DigiLocker). Once approved, go to Register Service to list your first profile.'
      },
      {
        q: 'What documents do I need for verification?',
        a: 'Any one of: Aadhaar Card, PAN Card, Voter ID, Passport, or Driving Licence. You can upload a scan/photo, or verify instantly via DigiLocker.'
      },
      {
        q: 'How long does verification take?',
        a: 'DigiLocker is instant. Manual document uploads are reviewed within 24–48 hours. You\'ll get an email and in-app notification when approved.'
      },
      {
        q: 'What commission does TalentConnect take?',
        a: 'We charge 10% on each confirmed booking. This covers payment processing, fraud protection, insurance, and platform maintenance.'
      },
      {
        q: 'When do I receive my earnings?',
        a: 'Earnings are transferred to your registered bank account within 2–3 business days after the event is marked complete.'
      },
    ],
  },
  {
    label: '🔒 Account & Security',
    color: '#10b981',
    faqs: [
      {
        q: 'I forgot my password. How do I reset it?',
        a: 'Click "Forgot Password" on the login page. Enter your email and we\'ll send a reset link instantly. Check your spam folder if you don\'t see it.'
      },
      {
        q: 'Can I change my account type from Client to Artist?',
        a: 'Contact support at support@talentconnect.in with your registered email. We can assist with role changes manually (you may need to re-verify).'
      },
      {
        q: 'Is my personal data safe?',
        a: 'Yes. All data is encrypted at rest and in transit. We never sell your data. See our Privacy Policy for full details.'
      },
    ],
  },
];

const FAQs = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [openQ, setOpenQ] = useState(null);

  const section = faqSections[activeSection];

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
            <span style={{ color: '#8b5cf6' }}>●</span> Help & Knowledge Center
          </div>
          <h1 style={{
            color: 'white', fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
            fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}>
            Frequently Asked Questions
          </h1>
          <p style={{
            color: '#cbd5e1', fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            maxWidth: '700px', margin: '0 auto', lineHeight: 1.6
          }}>
            Everything you need to know about booking, payments, verification, and artist listings.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* ── SECTION TABS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '10px', marginBottom: '40px' }}>
          {faqSections.map((s, i) => (
            <button key={i} onClick={() => { setActiveSection(i); setOpenQ(null); }}
              style={{
                padding: '14px 16px', borderRadius: '14px', border: '2px solid',
                borderColor: activeSection === i ? s.color : 'var(--border)',
                background: activeSection === i ? `${s.color}18` : 'var(--card-bg)',
                color: activeSection === i ? s.color : 'var(--text-muted)',
                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left',
                transition: '0.2s'
              }}>
              {s.label}
              <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 400, marginTop: '2px', color: 'var(--text-muted)' }}>
                {s.faqs.length} questions
              </span>
            </button>
          ))}
        </div>

        {/* ── ACCORDION ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {section.faqs.map((faq, i) => (
            <div key={i} style={{
              background: 'var(--card-bg)',
              border: `1.5px solid ${openQ === i ? section.color : 'var(--border)'}`,
              borderRadius: '14px', overflow: 'hidden', transition: '0.25s'
            }}>
              <button onClick={() => setOpenQ(openQ === i ? null : i)} style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer',
                textAlign: 'left', gap: '12px'
              }}>
                <span style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.97rem', flex: 1, lineHeight: 1.45 }}>
                  {faq.q}
                </span>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  background: openQ === i ? section.color : 'var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: '0.2s'
                }}>
                  <i className={`fas fa-chevron-${openQ === i ? 'up' : 'down'}`}
                    style={{ color: openQ === i ? 'white' : 'var(--text-muted)', fontSize: '0.75rem' }} />
                </div>
              </button>
              {openQ === i && (
                <div style={{
                  padding: '0 22px 20px',
                  borderTop: `1px solid ${section.color}30`
                }}>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem', marginTop: '14px' }}>
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── STILL NEED HELP ── */}
        <div style={{
          marginTop: '56px',
          background: 'var(--card-bg)', border: '1px solid var(--border)',
          borderRadius: '20px', padding: '36px', textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🤝</div>
          <h3 style={{ color: 'var(--text)', fontWeight: 700, fontSize: '1.15rem', marginBottom: '8px' }}>Still have a question?</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '22px', fontSize: '0.93rem' }}>
            Our support team is available Mon–Sat, 9am–8pm IST.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:support@talentconnect.in" style={{
              background: 'var(--primary)', color: 'white', padding: '11px 28px',
              borderRadius: '30px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem'
            }}>📧 Email Support</a>
            <a href="https://wa.me/919999999999" style={{
              background: '#25D366', color: 'white', padding: '11px 28px',
              borderRadius: '30px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem'
            }}>💬 WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
