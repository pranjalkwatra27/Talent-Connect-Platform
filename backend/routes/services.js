import express from 'express';
import Service from '../models/Service.js';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all service listings (with optional query filters)
// @route   GET /api/services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, city, search } = req.query;
    const query = { status: 'active' };

    if (category) {
      query.category = category;
    }
    
    if (city) {
      query.city = new RegExp(city, 'i');
    }

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { category: new RegExp(search, 'i') },
      ];
    }

    const services = await Service.find(query).sort({ rating: -1 });
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Server error fetching services', error: error.message });
  }
});

// @desc    Get artist's own service
// @route   GET /api/services/my
// @access  Private (Artist only)
router.get('/my', protect, authorize('artist'), async (req, res) => {
  try {
    let service = await Service.findOne({ artistId: req.user._id });
    if (!service) {
      // Lazy create listing if it doesn't exist
      service = await Service.create({
        artistId: req.user._id,
        name: req.user.name,
        category: 'Singers',
        description: `Hello, I'm ${req.user.name}. Contact me for standard bookings!`,
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
        price: 5000,
        city: req.user.city || 'Mumbai',
        packages: [
          {
            name: 'Standard Package',
            price: 5000,
            description: 'Standard session booking (2 hours)',
            features: ['Live performance', 'Professional equipment']
          }
        ]
      });
    }
    res.json(service);
  } catch (error) {
    console.error('Error fetching own service:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get single service listing by ID
// @route   GET /api/services/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.id || req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ message: 'Server error fetching service detail', error: error.message });
  }
});

// @desc    Create or Update own service listing
// @route   POST /api/services
// @access  Private (Artist only)
router.post('/', protect, authorize('artist'), async (req, res) => {
  try {
    const { category, description, image, price, city, packages, images } = req.body;

    let service = await Service.findOne({ artistId: req.user._id });

    if (service) {
      // Update
      service.name = req.user.name;
      if (category) service.category = category;
      if (description) service.description = description;
      if (image) service.image = image;
      if (price) service.price = Number(price);
      if (city) service.city = city;
      if (packages) service.packages = packages;
      if (images) service.images = images;
      service.isVerified = req.user.isVerified; // Keep in sync

      const updatedService = await service.save();
      res.json(updatedService);
    } else {
      // Create
      const newService = new Service({
        artistId: req.user._id,
        name: req.user.name,
        category: category || 'Singers',
        description: description || '',
        image: image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
        price: Number(price) || 5000,
        city: city || req.user.city || 'Mumbai',
        packages: packages || [
          {
            name: 'Standard Package',
            price: Number(price) || 5000,
            description: 'Standard session booking',
            features: ['Live performance']
          }
        ],
        images: images || [],
        isVerified: req.user.isVerified
      });

      const savedService = await newService.save();
      res.status(201).json(savedService);
    }
  } catch (error) {
    console.error('Error creating/updating service:', error);
    res.status(500).json({ message: 'Server error saving service', error: error.message });
  }
});

// @desc    Add review to service listing
// @route   POST /api/services/:id/reviews
// @access  Private (Client only)
router.post('/:id/reviews', protect, authorize('client'), async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const alreadyReviewed = service.reviewsList.find(
      (r) => r.userId.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this artist' });
    }

    const review = {
      userId: req.user._id,
      userName: req.user.name,
      userAvatar: req.user.avatar,
      rating: Number(rating),
      comment,
    };

    service.reviewsList.push(review);
    service.reviewsCount = service.reviewsList.length;
    service.rating =
      service.reviewsList.reduce((acc, item) => item.rating + acc, 0) /
      service.reviewsList.length;

    await service.save();
    res.status(201).json({ message: 'Review added successfully', service });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error adding review', error: error.message });
  }
});

export default router;
