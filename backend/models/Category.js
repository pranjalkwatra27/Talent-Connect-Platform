import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '#6366f1',
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: true,
});

const Category = mongoose.model('Category', CategorySchema);
export default Category;
