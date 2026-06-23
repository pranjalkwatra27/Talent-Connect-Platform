import { formatDateTime, formatCurrency } from '../utils/helpers';

const BookingCard = ({ booking, event, onCancel }) => {
  const isPast = new Date(event?.date) < new Date();
  const canCancel = booking.status === 'confirmed' && !isPast;

  return (
    <div className={`booking-card ${booking.status}`}>
      <div className="booking-image">
        <img src={event?.imageUrl} alt={event?.title} />
        <span className={`status-badge ${booking.status}`}>{booking.status}</span>
      </div>
      
      <div className="booking-content">
        <h3>{event?.title}</h3>
        <div className="booking-details">
          <p><strong>Date:</strong> {formatDateTime(event?.date)}</p>
          <p><strong>Location:</strong> {event?.location}</p>
          <p><strong>Tickets:</strong> {booking.numberOfTickets}</p>
          <p><strong>Total:</strong> {formatCurrency(booking.totalAmount)}</p>
          <p><strong>Booking ID:</strong> {booking.id}</p>
        </div>
        
        {canCancel && (
          <button 
            onClick={() => onCancel(booking.id)}
            className="btn btn-outline btn-sm"
          >
            Cancel Booking
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
