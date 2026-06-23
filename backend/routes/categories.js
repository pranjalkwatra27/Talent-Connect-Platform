import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error fetching categories', error: error.message });
  }
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Public (simplified for dev)
router.post('/', async (req, res) => {
  try {
    const { name, icon, color, slug } = req.body;
    const exists = await Category.findOne({ slug });
    if (exists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await Category.create({ name, icon, color, slug });
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Server error saving category', error: error.message });
  }
});

export default router;
