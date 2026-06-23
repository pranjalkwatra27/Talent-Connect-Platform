import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  userName: String,
  userAvatar: String,
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const PackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // e.g., "Basic Session", "Premium Package", "Mega Event"
  },
  price: {
    type: Number,
    required: true,
  },
  description: String,
  features: [String],
});

const ServiceSchema = new mongoose.Schema({
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    default: [],
  },
  price: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 5.0,
  },
  reviewsCount: {
    type: Number,
    default: 0,
  },
  reviewsList: [ReviewSchema],
  packages: [PackageSchema],
  isVerified: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, {
  timestamps: true,
});

const Service = mongoose.model('Service', ServiceSchema);
export default Service;
