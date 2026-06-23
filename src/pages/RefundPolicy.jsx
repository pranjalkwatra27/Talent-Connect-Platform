const RefundPolicy = () => (
  <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
    <section style={{
      background: 'linear-gradient(135deg,var(--primary),var(--secondary))',
      padding: '100px 24px 70px', textAlign: 'center', color: 'white'
    }}>
      <h1 style={{ fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 800, marginBottom: '12px' }}>Refund Policy 💸</h1>
      <p style={{ opacity: 0.9, maxWidth: '560px', margin: '0 auto', fontSize: '1rem' }}>
        We believe in a fair and transparent refund process. Please read our policy carefully.
      </p>
      <p style={{ opacity: 0.7, fontSize: '0.85rem', marginTop: '16px' }}>Last Updated: June 2026</p>
    </section>

    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '60px 24px 80px' }}>
      {[
        {
          title: '1. Advance Payment',
          body: 'When you book an artist or service on TalentConnect, a 30% advance payment is required to confirm the booking. This holds your slot and compensates the professional for blocked availability.'
        },
        {
          title: '2. Cancellation Refund Window',
          body: 'Full Refund (100%): Cancellations made more than 72 hours before the scheduled event date will receive a full refund of the advance payment.\n\nPartial Refund (50%): Cancellations made between 24–72 hours before the event will receive a 50% refund.\n\nNo Refund: Cancellations made less than 24 hours before the event are non-refundable, as the artist has already committed time and resources.'
        },
        {
          title: '3. Artist No-Show',
          body: 'If a verified artist fails to show up for a confirmed event without prior notice, you will receive a 100% refund of all payments made, plus a ₹500 compensation credit to your account for the inconvenience.'
        },
        {
          title: '4. Service Quality Dispute',
          body: 'If you believe the service delivered was significantly below the agreed standard, you can raise a dispute within 48 hours of the event. Our team will review evidence from both parties and issue a refund of up to 100% based on our findings.'
        },
        {
          title: '5. How to Claim a Refund',
          body: 'To request a refund, go to My Bookings → select your booking → click "Request Cancellation or Refund". Alternatively, email us at support@talentconnect.in with your Booking ID and reason.'
        },
        {
          title: '6. Refund Timeline',
          body: 'Approved refunds are processed within 5–7 business days. The amount will be credited back to the original payment method (card, UPI, bank account). UPI refunds typically arrive within 2–3 business days.'
        },
        {
          title: '7. Non-Refundable Items',
          body: 'The TalentConnect platform fee (if separately charged) and the Artist Verification fee (paid during registration) are non-refundable under any circumstances.'
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

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <p style={{ color: 'var(--text-muted)' }}>Questions? Contact us at <a href="mailto:support@talentconnect.in" style={{ color: 'var(--primary)', fontWeight: 600 }}>support@talentconnect.in</a></p>
      </div>
    </div>
  </div>
);

export default RefundPolicy;
