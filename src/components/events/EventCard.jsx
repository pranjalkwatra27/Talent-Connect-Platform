import { Link } from 'react-router-dom';
import { formatDate, formatCurrency } from '../utils/helpers';

const EventCard = ({ event }) => {
  return (
    <div className="event-card">
      <div className="event-image">
        <img src={event.imageUrl} alt={event.title} />
        <span className="event-badge">{event.type}</span>
      </div>
      
      <div className="event-content">
        <div className="event-category">{event.category}</div>
        <h3>{event.title}</h3>
        <p className="event-description">{event.description}</p>
        
        <div className="event-details">
          <div className="event-info">
            <span className="icon">📅</span>
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="event-info">
            <span className="icon">📍</span>
            <span>{event.location}</span>
          </div>
          <div className="event-info">
            <span className="icon">👥</span>
            <span>{event.availableSeats || event.capacity || 'Unlimited'} slots available</span>
          </div>
        </div>
        
        <div className="event-footer">
          <div className="event-price">
            {event.price === 0 ? 'Free' : formatCurrency(event.price)}
          </div>
          <Link to={`/booking/${event.id}`} className="btn btn-primary">
            Book Service
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
