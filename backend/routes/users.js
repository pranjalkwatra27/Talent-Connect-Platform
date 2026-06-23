import express from 'express';
import User from '../models/User.js';
import Service from '../models/Service.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Update user profile details
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.city = req.body.city || user.city;
      user.phone = req.body.phone || user.phone;
      user.avatar = req.body.avatar || user.avatar;
      
      if (req.body.emailVerified !== undefined) user.emailVerified = req.body.emailVerified;
      if (req.body.phoneVerified !== undefined) user.phoneVerified = req.body.phoneVerified;
      if (req.body.docVerified !== undefined) user.docVerified = req.body.docVerified;
      if (req.body.paymentComplete !== undefined) user.paymentComplete = req.body.paymentComplete;
      if (req.body.isVerified !== undefined) user.isVerified = req.body.isVerified;
      
      if (req.body.docVerification) {
        user.docVerification = { ...user.docVerification, ...req.body.docVerification };
      }
      
      if (req.body.businessInfo) {
        user.businessInfo = { ...user.businessInfo, ...req.body.businessInfo };
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      // If user is an artist, also update the artist's name and city in their Service listing
      if (updatedUser.role === 'artist') {
        const service = await Service.findOne({ artistId: updatedUser._id });
        if (service) {
          service.name = updatedUser.name;
          if (updatedUser.city) {
            service.city = updatedUser.city;
          }
          service.isVerified = updatedUser.isVerified;
          await service.save();
        }
      }

      const userObject = updatedUser.toObject();
      delete userObject.password;
      res.json(userObject);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Update Profile Error:', error.stack || error.message || error);
    res.status(500).json({ message: 'Server error updating profile', error: error.message });
  }
});

// @desc    Submit artist verification (or skip/auto-verify for simplicity)
// @route   PUT /api/users/verify
// @access  Private (Artist only)
router.put('/verify', protect, authorize('artist'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isVerified = true;
    user.emailVerified = true;
    user.phoneVerified = true;
    user.docVerified = true;
    user.paymentComplete = true;
    await user.save();

    // Sync with their service listing
    const service = await Service.findOne({ artistId: user._id });
    if (service) {
      service.isVerified = true;
      await service.save();
    }

    const userObject = user.toObject();
    delete userObject.password;
    res.json(userObject);
  } catch (error) {
    console.error('Verification Error:', error);
    res.status(500).json({ message: 'Server error processing verification', error: error.message });
  }
});

export default router;
