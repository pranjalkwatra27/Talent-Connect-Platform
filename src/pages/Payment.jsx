import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';

const Payment = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('bookingData');
    if (!stored) {
      navigate('/browse');
      return;
    }
    try {
      setBookingData(JSON.parse(stored));
    } catch {
      navigate('/browse');
    }
  }, [navigate]);

  const formatCard = (val) => {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    return cleaned;
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (paymentMethod === 'card') {
      const rawNum = cardData.number.replace(/\s/g, '');
      if (rawNum.length < 16) return alert('Enter a valid 16-digit card number.');
      if (!cardData.name.trim()) return alert('Enter the cardholder name.');
      if (cardData.expiry.length < 5) return alert('Enter a valid expiry date (MM/YY).');
      if (cardData.cvv.length < 3) return alert('Enter a valid CVV.');
    } else if (paymentMethod === 'upi') {
      if (!upiId.includes('@')) return alert('Enter a valid UPI ID (e.g. name@upi).');
    }

    setProcessing(true);

    // Simulate payment processing (2 seconds)
    await new Promise(r => setTimeout(r, 2000));

    try {
      const payload = {
        serviceId: bookingData.serviceId,
        artistId: bookingData.artistId,
        packageName: bookingData.packageName,
        eventDate: bookingData.eventDate,
        eventLocation: bookingData.eventVenue || bookingData.eventLocation,
        amount: bookingData.packagePrice,
        paymentMethod,
        paymentId: 'pay_' + Math.random().toString(36).substring(2, 15)
      };

      const result = await api.createBooking(payload);
      const bid = result._id;

      localStorage.removeItem('bookingData');
      setBookingId(bid);
      setSuccess(true);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processed but booking save failed. Please contact support.');
    } finally {
      setProcessing(false);
    }
  };

  if (!bookingData) return null;

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '60px 40px',
          textAlign: 'center',
          maxWidth: '480px',
          width: '100%',
          boxShadow: '0 25px 60px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', fontSize: '36px', color: 'white'
          }}>✓</div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>
            Booking Confirmed! 🎉
          </h2>
          <p style={{ color: '#64748b', marginBottom: '8px' }}>
            <strong>{bookingData.eventName}</strong> has been booked successfully.
          </p>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '30px' }}>
            Booking ID: <code style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '13px' }}>{bookingId?.slice(0, 12)}...</code>
          </p>
          <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '30px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#64748b' }}>Amount Paid</span>
              <strong style={{ color: '#1e293b' }}>₹{bookingData.totalAmount}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Date</span>
              <strong style={{ color: '#1e293b' }}>{bookingData.eventDate}</strong>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
            <button
              onClick={() => navigate('/bookings')}
              style={{
                padding: '14px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: 'white', border: 'none', borderRadius: '12px',
                fontWeight: '700', fontSize: '16px', cursor: 'pointer'
              }}
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate('/browse')}
              style={{
                padding: '14px', background: 'transparent',
                color: '#4f46e5', border: '2px solid #4f46e5', borderRadius: '12px',
                fontWeight: '700', fontSize: '16px', cursor: 'pointer'
              }}
            >
              Explore More Talent
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: '90px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '30px 20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', marginBottom: '6px' }}>
          Complete Your Payment
        </h1>
        <p style={{ color: '#64748b', marginBottom: '30px' }}>
          Secure checkout — your booking will be instantly confirmed.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' }}>
          {/* Payment Form */}
          <form onSubmit={handlePayment}>
            {/* Payment Method Selector */}
            <div style={{
              background: 'white', borderRadius: '16px', padding: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '20px'
            }}>
              <h3 style={{ fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>Payment Method</h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                {['card', 'upi', 'netbanking'].map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    style={{
                      padding: '10px 20px', borderRadius: '10px', border: '2px solid',
                      borderColor: paymentMethod === method ? '#4f46e5' : '#e2e8f0',
                      background: paymentMethod === method ? '#ede9fe' : 'white',
                      color: paymentMethod === method ? '#4f46e5' : '#64748b',
                      fontWeight: '700', cursor: 'pointer', fontSize: '14px', transition: '0.2s',
                      textTransform: 'capitalize'
                    }}
                  >
                    {method === 'card' ? '💳 Card' : method === 'upi' ? '📱 UPI' : '🏦 Netbanking'}
                  </button>
                ))}
              </div>
            </div>

            {/* Card Form */}
            {paymentMethod === 'card' && (
              <div style={{
                background: 'white', borderRadius: '16px', padding: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '20px'
              }}>
                <h3 style={{ fontWeight: '700', marginBottom: '20px', color: '#1e293b' }}>Card Details</h3>

                {/* Card Preview */}
                <div style={{
                  background: 'linear-gradient(135deg, #4f46e5, #9333ea)',
                  borderRadius: '16px', padding: '28px 24px', marginBottom: '24px',
                  color: 'white', position: 'relative', overflow: 'hidden'
                }}>
                  <div style={{ opacity: 0.2, position: 'absolute', right: '-20px', top: '-20px', fontSize: '160px' }}>◎</div>
                  <div style={{ fontSize: '22px', letterSpacing: '3px', marginBottom: '20px', fontWeight: '700' }}>
                    {cardData.number || '•••• •••• •••• ••••'}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <div>
                      <div style={{ opacity: 0.7, fontSize: '11px', marginBottom: '2px' }}>CARDHOLDER</div>
                      <div style={{ fontWeight: '600', textTransform: 'uppercase' }}>{cardData.name || 'Your Name'}</div>
                    </div>
                    <div>
                      <div style={{ opacity: 0.7, fontSize: '11px', marginBottom: '2px' }}>EXPIRES</div>
                      <div style={{ fontWeight: '600' }}>{cardData.expiry || 'MM/YY'}</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#374151', fontSize: '14px' }}>
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardData.number}
                      onChange={e => setCardData({ ...cardData, number: formatCard(e.target.value) })}
                      style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#374151', fontSize: '14px' }}>
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="Name on card"
                      value={cardData.name}
                      onChange={e => setCardData({ ...cardData, name: e.target.value })}
                      style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#374151', fontSize: '14px' }}>
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardData.expiry}
                        onChange={e => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                        style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#374151', fontSize: '14px' }}>
                        CVV
                      </label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={4}
                        value={cardData.cvv}
                        onChange={e => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                        style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* UPI Form */}
            {paymentMethod === 'upi' && (
              <div style={{
                background: 'white', borderRadius: '16px', padding: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '20px'
              }}>
                <h3 style={{ fontWeight: '700', marginBottom: '20px', color: '#1e293b' }}>UPI Payment</h3>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '60px', marginBottom: '16px' }}>📱</div>
                  <p style={{ color: '#64748b', marginBottom: '20px' }}>Enter your UPI ID to complete the payment</p>
                </div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#374151', fontSize: '14px' }}>
                  UPI ID
                </label>
                <input
                  type="text"
                  placeholder="yourname@paytm / @gpay / @upi"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  style={{ width: '100%', padding: '14px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            )}

            {/* Net Banking */}
            {paymentMethod === 'netbanking' && (
              <div style={{
                background: 'white', borderRadius: '16px', padding: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '20px', textAlign: 'center'
              }}>
                <div style={{ fontSize: '60px', marginBottom: '16px' }}>🏦</div>
                <h3 style={{ fontWeight: '700', marginBottom: '12px', color: '#1e293b' }}>Net Banking</h3>
                <p style={{ color: '#64748b', marginBottom: '20px' }}>
                  You will be redirected to your bank's secure portal to complete the payment.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                  {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'Yes Bank'].map(bank => (
                    <div key={bank} style={{
                      padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: '8px',
                      fontSize: '14px', fontWeight: '600', color: '#374151', cursor: 'pointer'
                    }}>{bank}</div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={processing}
              style={{
                width: '100%', padding: '16px',
                background: processing ? '#94a3b8' : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: 'white', border: 'none', borderRadius: '14px',
                fontWeight: '800', fontSize: '18px', cursor: processing ? 'not-allowed' : 'pointer',
                boxShadow: processing ? 'none' : '0 6px 25px rgba(79, 70, 229, 0.4)',
                transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
              }}
            >
              {processing ? (
                <>
                  <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
                  Processing Payment...
                </>
              ) : (
                <>🔒 Pay ₹{bookingData.totalAmount} Securely</>
              )}
            </button>

            <div style={{ textAlign: 'center', marginTop: '12px', color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span>🛡️</span>
              <span>256-bit SSL encrypted. Your data is safe.</span>
            </div>
          </form>

          {/* Order Summary */}
          <div>
            <div style={{
              background: 'white', borderRadius: '16px', padding: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)', position: 'sticky', top: '100px'
            }}>
              <h3 style={{ fontWeight: '700', marginBottom: '20px', color: '#1e293b' }}>Booking Summary</h3>

              <div style={{
                background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
                borderRadius: '12px', padding: '16px', marginBottom: '20px'
              }}>
                <div style={{ fontWeight: '700', color: '#1e293b', marginBottom: '4px', fontSize: '16px' }}>
                  {bookingData.eventName}
                </div>
                <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>
                  📅 {bookingData.eventDate} at {bookingData.eventTime}
                </div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>
                  📍 {bookingData.eventVenue}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                {[
                  { label: 'Service Price', value: `₹${bookingData.ticketPrice}` },
                  { label: 'Platform Fee', value: `₹${bookingData.bookingFee}` },
                  { label: 'GST (18%)', value: `₹${bookingData.gstAmount}` },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                    <span style={{ color: '#64748b' }}>{label}</span>
                    <span style={{ color: '#374151', fontWeight: '600' }}>{value}</span>
                  </div>
                ))}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  borderTop: '2px solid #e2e8f0', paddingTop: '12px', marginTop: '4px'
                }}>
                  <span style={{ fontWeight: '800', color: '#1e293b', fontSize: '16px' }}>Total</span>
                  <span style={{ fontWeight: '800', color: '#4f46e5', fontSize: '20px' }}>₹{bookingData.totalAmount}</span>
                </div>
              </div>

              <div style={{ marginTop: '20px', background: '#f0fdf4', borderRadius: '10px', padding: '12px', fontSize: '13px', color: '#166534' }}>
                ✅ Free cancellation up to 48 hours before the event date
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
