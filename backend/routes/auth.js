import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Service from '../models/Service.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user (Client or Artist)
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, city, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'client',
      city: city || '',
      phone: phone || '',
    });

    if (user) {
      // If they are registering as an artist, pre-create their Service listing
      if (user.role === 'artist') {
        await Service.create({
          artistId: user._id,
          name: user.name,
          category: 'Singers', // default category
          description: `Hello, I'm ${user.name}. I am a professional artist. Contact me for standard bookings!`,
          image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
          price: 5000,
          city: user.city || 'Mumbai',
          isVerified: false,
          packages: [
            {
              name: 'Standard Package',
              price: 5000,
              description: 'Standard event booking (2-3 hours)',
              features: ['Sound equipment', 'Performance sets', '1 setup assistant']
            }
          ]
        });
      }

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city,
        phone: user.phone,
        avatar: user.avatar,
        isVerified: user.isVerified,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city,
        phone: user.phone,
        avatar: user.avatar,
        isVerified: user.isVerified,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get Current User Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Upgrade user to artist role
// @route   PUT /api/auth/upgrade
// @access  Private
router.put('/upgrade', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'artist') {
      return res.status(400).json({ message: 'User is already an artist partner' });
    }

    user.role = 'artist';
    await user.save();

    // Create default service listing
    await Service.create({
      artistId: user._id,
      name: user.name,
      category: 'Singers', // default category
      description: `Hello, I'm ${user.name}. I am a professional artist. Contact me for standard bookings!`,
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      price: 5000,
      city: user.city || 'Mumbai',
      isVerified: false,
      packages: [
        {
          name: 'Standard Package',
          price: 5000,
          description: 'Standard event booking (2-3 hours)',
          features: ['Sound equipment', 'Performance sets', '1 setup assistant']
        }
      ],
      status: 'active'
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      city: user.city,
      phone: user.phone,
      avatar: user.avatar,
      isVerified: user.isVerified,
    });
  } catch (error) {
    console.error('Upgrade Error:', error);
    res.status(500).json({ message: 'Server error during upgrade', error: error.message });
  }
});

export default router;
