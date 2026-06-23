const CancellationPolicy = () => (
  <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
    <section style={{
      background: 'linear-gradient(135deg,#1a1a2e,#16213e)',
      padding: '100px 24px 70px', textAlign: 'center'
    }}>
      <h1 style={{ color: 'white', fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 800, marginBottom: '12px' }}>Cancellation Policy 🚫</h1>
      <p style={{ color: '#94a3b8', maxWidth: '560px', margin: '0 auto', fontSize: '1rem' }}>
        Understand your rights and responsibilities when cancelling or modifying a booking.
      </p>
      <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '16px' }}>Last Updated: June 2026</p>
    </section>

    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '60px 24px 80px' }}>
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
