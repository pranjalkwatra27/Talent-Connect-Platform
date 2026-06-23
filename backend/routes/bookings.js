import express from 'express';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Client only)
router.post('/', protect, authorize('client'), async (req, res) => {
  try {
    const { serviceId, artistId, packageName, eventDate, eventLocation, amount, paymentMethod, paymentId } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const booking = await Booking.create({
      clientId: req.user._id,
      serviceId,
      artistId,
      packageName,
      eventDate,
      eventLocation,
      amount,
      paymentMethod: paymentMethod || 'Mock Card',
      paymentId: paymentId || '',
      paymentStatus: paymentId ? 'paid' : 'pending',
      status: 'pending',
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Booking Creation Error:', error);
    res.status(500).json({ message: 'Server error during booking', error: error.message });
  }
});

// @desc    Get client's bookings
// @route   GET /api/bookings/my
// @access  Private (Client only)
router.get('/my', protect, authorize('client'), async (req, res) => {
  try {
    // Populate service and artist details
    const bookings = await Booking.find({ clientId: req.user._id })
      .populate({
        path: 'serviceId',
        select: 'name category image rating city',
      })
      .populate({
        path: 'artistId',
        select: 'name email avatar phone',
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching client bookings:', error);
    res.status(500).json({ message: 'Server error fetching bookings', error: error.message });
  }
});

// @desc    Get artist's received bookings
// @route   GET /api/bookings/artist
// @access  Private (Artist only)
router.get('/artist', protect, authorize('artist'), async (req, res) => {
  try {
    // Populate client details and service info
    const bookings = await Booking.find({ artistId: req.user._id })
      .populate({
        path: 'clientId',
        select: 'name email avatar phone city',
      })
      .populate({
        path: 'serviceId',
        select: 'name category image rating',
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching artist bookings:', error);
    res.status(500).json({ message: 'Server error fetching booking requests', error: error.message });
  }
});

// @desc    Update booking status (Confirm, Complete, Cancel)
// @route   PUT /api/bookings/:id/status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify authorized user (must be the client or the artist)
    const isClient = booking.clientId.toString() === req.user._id.toString();
    const isArtist = booking.artistId.toString() === req.user._id.toString();

    if (!isClient && !isArtist) {
      return res.status(403).json({ message: 'Not authorized to modify this booking' });
    }

    booking.status = status;
    
    // Automatically set payment status to paid if completed
    if (status === 'completed') {
      booking.paymentStatus = 'paid';
    }

    await booking.save();
    res.json(booking);
  } catch (error) {
    console.error('Update Booking Status Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Update booking payment status
// @route   PUT /api/bookings/:id/payment
// @access  Private
router.put('/:id/payment', protect, async (req, res) => {
  try {
    const { paymentStatus, paymentId, paymentMethod } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (paymentStatus) booking.paymentStatus = paymentStatus;
    if (paymentId) booking.paymentId = paymentId;
    if (paymentMethod) booking.paymentMethod = paymentMethod;

    if (paymentStatus === 'paid' && booking.status === 'pending') {
      booking.status = 'confirmed'; // Auto-confirm on payment
    }

    await booking.save();
    res.json(booking);
  } catch (error) {
    console.error('Update Payment Error:', error);
    res.status(500).json({ message: 'Server error updating payment status', error: error.message });
  }
});

export default router;
