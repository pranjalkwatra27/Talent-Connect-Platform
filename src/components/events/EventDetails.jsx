import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getServiceById } from '../../services/api';
import { formatDateTime, formatCurrency } from '../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const data = await getServiceById(id);
        setEvent(data);
      } catch (error) {
        console.error('Error loading event:', error);
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

  if (loading) return <LoadingSpinner />;
  if (!event) return <div className="error">Talent / Service not found</div>;

  return (
    <div className="event-details-page">
      <div className="event-header">
        <img src={event.image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'} alt={event.name} className="event-banner" />
        <div className="event-header-overlay">
          <div className="container">
            <span className="event-badge">{event.category || 'Talent'}</span>
            <h1>{event.name}</h1>
            <div className="event-meta">
              <span>📅 Added: {formatDateTime(event.createdAt || event.date)}</span>
              <span>📍 {event.city}</span>
              <span>By {event.name || 'Verified Artist'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="event-details-content">
          <div className="event-main">
            <section>
              <h2>About This Service</h2>
              <p>{event.description}</p>
            </section>

            <section>
              <h2>Service Details</h2>
              <ul className="details-list">
                <li><strong>Talent Category:</strong> {event.category}</li>
                <li><strong>Service Type:</strong> {event.eventType || event.type || 'Standard'}</li>
                <li><strong>Availability Slots:</strong> Flexible</li>
                <li><strong>Verification Status:</strong> Verified</li>
              </ul>
            </section>
          </div>

          <div className="event-sidebar">
            <div className="booking-card">
              <div className="price-tag">
                {event.price === 0 ? 'Free Consultation' : formatCurrency(event.price)}
              </div>
              <button 
                className="btn btn-primary btn-block"
                onClick={handleBookNow}
              >
                Book Service
              </button>
              <p className="seats-info">
                Secure your booking slot now
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
