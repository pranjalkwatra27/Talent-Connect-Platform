const CancellationPolicy = () => (
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
          <span style={{ color: '#ef4444' }}>●</span> Booking Flexibility & Modifications
        </div>
        <h1 style={{
          color: 'white', fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
          fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.02em',
          lineHeight: 1.2
        }}>
          Cancellation Policy
        </h1>
        <p style={{
          color: '#cbd5e1', fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          maxWidth: '700px', margin: '0 auto', lineHeight: 1.6
        }}>
          Understand your rights and terms when rescheduling, cancelling, or modifying an artist booking.
        </p>
      </div>
    </section>

    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px 80px' }}>
      {/* Quick Summary Table */}
      <div style={{
        background: 'var(--card-bg)', border: '1.5px solid var(--primary)', borderRadius: '20px',
        padding: '32px', marginBottom: '32px'
      }}>
        <h2 style={{ color: 'var(--text)', fontWeight: 700, fontSize: '1.2rem', marginBottom: '20px' }}>⚡ Quick Summary</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>Cancellation Time</th>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>Refund</th>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>Artist Gets</th>
            </tr>
          </thead>
          <tbody>
            {[
              { time: 'More than 72 hrs before', refund: '100% refund', artist: '0%' },
              { time: '24–72 hrs before', refund: '50% refund', artist: '50%' },
              { time: 'Less than 24 hrs before', refund: 'No refund', artist: '100%' },
              { time: 'After event started', refund: 'No refund', artist: '100%' },
            ].map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 12px', fontWeight: 500 }}>{row.time}</td>
                <td style={{ padding: '12px 12px', color: row.refund === 'No refund' ? '#ef4444' : '#22c55e', fontWeight: 600 }}>{row.refund}</td>
                <td style={{ padding: '12px 12px', color: 'var(--text-muted)' }}>{row.artist}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {[
        {
          title: '1. How to Cancel a Booking',
          body: 'You can cancel a booking from My Bookings → select booking → click "Cancel Booking". You will be shown your refund eligibility before confirming. Alternatively, contact support at support@talentconnect.in.'
        },
        {
          title: '2. Rescheduling a Booking',
          body: 'Rescheduling is allowed once per booking, free of charge, if requested at least 72 hours before the event. Reschedule requests are subject to the artist\'s availability. A second reschedule may incur a ₹200 administrative fee.'
        },
        {
          title: '3. Artist-Initiated Cancellations',
          body: 'If an artist cancels your confirmed booking, you will receive:\n• A 100% refund of all payments made\n• A ₹500 TalentConnect credit to your account\n• Priority assistance to find a replacement artist at no extra charge.'
        },
        {
          title: '4. Force Majeure',
          body: 'In the event of natural disasters, government-imposed restrictions (e.g., lockdowns), or other force majeure events, both parties may cancel with no penalty. TalentConnect will issue full refunds in such cases.'
        },
        {
          title: '5. Subscription Plans',
          body: 'Artist subscription plans (Basic, Professional, Premium) are billed monthly or annually. Monthly plans can be cancelled anytime; the subscription remains active until the end of the billing period. Annual plans are non-refundable after 7 days of purchase.'
        },
      ].map(s => (
        <div key={s.title} style={{
          background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px',
          padding: '28px 30px', marginBottom: '18px'
        }}>
          <h2 style={{ color: 'var(--text)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '12px' }}>{s.title}</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{s.body}</p>
        </div>
      ))}
    </div>
  </div>
);

export default CancellationPolicy;
