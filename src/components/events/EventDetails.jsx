import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getServiceById, addServiceReview } from '../../services/api';
import { formatCurrency } from '../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about'); // 'about' | 'packages' | 'credentials' | 'reviews'
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const data = await getServiceById(id);
        setEvent(data);
        if (data.packages && data.packages.length > 0) {
          setSelectedPackage(data.packages[0]);
        }
      } catch (error) {
        console.error('Error loading service:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  const handleBookNow = () => {
    if (!user) {
      navigate('/login?redirect=/events/' + id);
      return;
    }
    navigate(`/booking/${id}`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'client') {
      setReviewMsg('Only clients can post reviews.');
      return;
    }
    setReviewSubmitting(true);
    try {
      const res = await addServiceReview(id, { rating, comment: reviewComment });
      setEvent(res.service);
      setReviewComment('');
      setReviewMsg('Thank you! Your review has been published.');
    } catch (err) {
      setReviewMsg(err.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!event) return <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}><h2>Talent Service not found</h2></div>;

  const qualifications = event.qualifications || [];
  const certificates = event.certificates || [];
  const packages = event.packages || [];
  const reviews = event.reviewsList || [];

  return (
    <div className="event-details-page" style={{ paddingTop: '80px', background: 'var(--bg)', minHeight: '90vh' }}>
      {/* Hero Header */}
      <div style={{ position: 'relative', height: '360px', overflow: 'hidden' }}>
        <img
          src={event.image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80'}
          alt={event.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(15,23,42,0.95) 10%, rgba(15,23,42,0.4) 60%, rgba(15,23,42,0.2) 100%)',
          display: 'flex', alignItems: 'flex-end', paddingBottom: '32px'
        }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <span style={{ background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
                {event.category || 'Professional Talent'}
              </span>
              {event.isVerified && (
                <span style={{ background: '#10b981', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <i className="fas fa-shield-check"></i> AI & Identity Verified
                </span>
              )}
              {event.digilockerVerified && (
                <span style={{ background: '#0b3954', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <i className="fas fa-lock"></i> DigiLocker Certified
                </span>
              )}
            </div>

            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', marginBottom: '10px' }}>{event.name}</h1>

            <div style={{ display: 'flex', gap: '20px', color: '#cbd5e1', fontSize: '0.95rem', flexWrap: 'wrap' }}>
              <span>📍 {event.city || 'Pan-India Available'}</span>
              <span>⭐ {event.rating ? event.rating.toFixed(1) : '5.0'} ({event.reviewsCount || reviews.length} client reviews)</span>
              <span>📅 Available for upcoming events</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Booking Panel */}
      <div className="container" style={{ maxWidth: '1200px', margin: '32px auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }}>
          
          {/* Left Column: Tabs & Details */}
          <div>
            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', marginBottom: '24px', overflowX: 'auto' }}>
              {[
                { id: 'about', label: 'About & Services', icon: 'fa-info-circle' },
                { id: 'packages', label: `Packages (${packages.length})`, icon: 'fa-box-open' },
                { id: 'credentials', label: `Credentials & Certs (${qualifications.length + certificates.length})`, icon: 'fa-award' },
                { id: 'reviews', label: `Reviews (${reviews.length})`, icon: 'fa-star' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    padding: '12px 20px', background: 'none', border: 'none',
                    borderBottom: activeTab === t.id ? '3px solid var(--primary)' : '3px solid transparent',
                    color: activeTab === t.id ? 'var(--primary)' : 'var(--text-muted)',
                    fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem',
                    display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'
                  }}
                >
                  <i className={`fas ${t.icon}`}></i> {t.label}
                </button>
              ))}
            </div>

            {/* TAB 1: About */}
            {activeTab === 'about' && (
              <div>
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px' }}>Professional Biography</h2>
                  <p style={{ lineHeight: '1.7', color: 'var(--text-muted)', fontSize: '1rem' }}>
                    {event.description || 'Professional artist dedicated to delivering exceptional event performances and styling experiences.'}
                  </p>
                </div>

                {/* Gallery Images */}
                {event.images && event.images.length > 0 && (
                  <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '16px' }}>Portfolio Showcase</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                      {event.images.map((imgUrl, i) => (
                        <img key={i} src={imgUrl} alt={`Portfolio ${i}`} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '10px' }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Packages */}
            {activeTab === 'packages' && (
              <div style={{ display: 'grid', gap: '16px' }}>
                {packages.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>No detailed packages listed. Standard consultation rate applies.</p>
                ) : (
                  packages.map((pkg, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedPackage(pkg)}
                      style={{
                        background: selectedPackage?.name === pkg.name ? 'rgba(99,102,241,0.06)' : 'var(--card-bg)',
                        border: selectedPackage?.name === pkg.name ? '2px solid var(--primary)' : '1px solid var(--border)',
                        borderRadius: '16px', padding: '20px', cursor: 'pointer', transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{pkg.name}</h3>
                        <span style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--primary)' }}>₹{pkg.price?.toLocaleString('en-IN')}</span>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>{pkg.description}</p>
                      {pkg.features && pkg.features.length > 0 && (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {pkg.features.map((f, fi) => (
                            <span key={fi} style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>
                              ✓ {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: Credentials & Qualifications */}
            {activeTab === 'credentials' && (
              <div>
                <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(11,57,84,0.1))', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '16px', padding: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>AI & DigiLocker Verified Profile</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      All documents, institute qualifications, and professional skill badges are authentic and verified.
                    </p>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '12px' }}>Academic & Professional Qualifications</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '28px' }}>
                  {qualifications.length === 0 ? (
                    <div style={{ background: 'var(--card-bg)', border: '1px dashed var(--border)', borderRadius: '12px', padding: '20px', color: 'var(--text-muted)', textAlign: 'center' }}>
                      No formal degree attached.
                    </div>
                  ) : (
                    qualifications.map((q, qi) => (
                      <div key={qi} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
                        <div style={{ fontWeight: 800, fontSize: '1rem' }}>{q.title}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{q.issuer} ({q.year})</div>
                        <span style={{ display: 'inline-block', marginTop: '6px', background: '#dcfce7', color: '#16a34a', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                          🛡️ AI Verified (Score: {q.score || 96}%)
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '12px' }}>Accredited Skill Certifications</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                  {certificates.length === 0 ? (
                    <div style={{ background: 'var(--card-bg)', border: '1px dashed var(--border)', borderRadius: '12px', padding: '20px', color: 'var(--text-muted)', textAlign: 'center' }}>
                      No certificates attached.
                    </div>
                  ) : (
                    certificates.map((c, ci) => (
                      <div key={ci} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
                        <div style={{ fontWeight: 800, fontSize: '1rem' }}>{c.title}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{c.issuer} • {c.category}</div>
                        <span style={{ display: 'inline-block', marginTop: '6px', background: 'rgba(99,102,241,0.15)', color: '#818cf8', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                          ⭐ {c.verifiedBadge || 'DigiLocker & AI Verified'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: Reviews */}
            {activeTab === 'reviews' && (
              <div>
                {/* Client Review Box */}
                {user && user.role === 'client' && (
                  <form onSubmit={handleReviewSubmit} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px' }}>Leave a Verified Review</h3>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Rating (1 to 5 Stars)</label>
                      <select value={rating} onChange={(e) => setRating(Number(e.target.value))} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}>
                        <option value="5">⭐⭐⭐⭐⭐ 5 Stars - Exceptional</option>
                        <option value="4">⭐⭐⭐⭐ 4 Stars - Very Good</option>
                        <option value="3">⭐⭐⭐ 3 Stars - Average</option>
                        <option value="2">⭐⭐ 2 Stars - Below Expectations</option>
                        <option value="1">⭐ 1 Star - Unsatisfactory</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <textarea
                        required
                        placeholder="Share your experience working with this artist..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        style={{ width: '100%', height: '80px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                      />
                    </div>
                    {reviewMsg && <p style={{ fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '10px' }}>{reviewMsg}</p>}
                    <button type="submit" disabled={reviewSubmitting} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                      {reviewSubmitting ? 'Posting...' : 'Post Review'}
                    </button>
                  </form>
                )}

                {/* Reviews List */}
                <div style={{ display: 'grid', gap: '14px' }}>
                  {reviews.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first to book and review!</p>
                  ) : (
                    reviews.map((r, ri) => (
                      <div key={ri} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 800 }}>{r.userName || 'Verified Client'}</span>
                          <span style={{ color: '#f59e0b' }}>{'★'.repeat(r.rating || 5)}</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{r.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Booking Widget */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '20px', padding: '24px', position: 'sticky', top: '90px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Starting from</span>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text)' }}>
                {formatCurrency(selectedPackage ? selectedPackage.price : event.price)}
              </div>
              {selectedPackage && <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700 }}>Package: {selectedPackage.name}</span>}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '16px 0', margin: '16px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Booking Guarantee</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>100% Protected</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Payment</span>
                <span>Secure Escrow / Razorpay</span>
              </div>
            </div>

            <button
              onClick={handleBookNow}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 800, borderRadius: '12px' }}
            >
              Book Service Now
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '12px' }}>
              Instant booking confirmation & artist direct chat
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetails;
