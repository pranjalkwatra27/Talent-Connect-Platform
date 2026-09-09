import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['client', 'artist'],
    default: 'client',
  },
  city: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  phoneVerified: {
    type: Boolean,
    default: false,
  },
  docVerified: {
    type: Boolean,
    default: false,
  },
  paymentComplete: {
    type: Boolean,
    default: false,
  },
  digilockerVerified: {
    type: Boolean,
    default: false,
  },
  aiVerificationScore: {
    type: Number,
    default: 0,
  },
  aiVerificationSummary: {
    docType: { type: String, default: '' },
    nameMatchConfidence: { type: Number, default: 0 },
    tamperCheckPassed: { type: Boolean, default: true },
    ocrExtractedName: { type: String, default: '' },
    ocrExtractedNumber: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  docVerification: {
    docType: { type: String, default: '' },
    docNumber: { type: String, default: '' },
    docUrl: { type: String, default: '' },
    verifiedAt: { type: Date },
    status: { type: String, default: 'not_submitted' },
    verificationMethod: { type: String, default: 'upload' }, // 'upload' | 'ai_scan' | 'digilocker'
  },
  qualifications: [
    {
      title: { type: String, required: true },
      issuer: { type: String, required: true },
      year: { type: String, default: '' },
      docUrl: { type: String, default: '' },
      isAiVerified: { type: Boolean, default: false },
      isDigiLockerVerified: { type: Boolean, default: false },
      score: { type: Number, default: 95 },
      verifiedAt: { type: Date, default: Date.now },
    }
  ],
  certificates: [
    {
      title: { type: String, required: true },
      category: { type: String, default: 'Professional Skill' },
      issuer: { type: String, required: true },
      credentialId: { type: String, default: '' },
      fileUrl: { type: String, default: '' },
      verifiedBadge: { type: String, default: 'AI & DigiLocker Verified' },
      aiConfidence: { type: Number, default: 98 },
      verifiedAt: { type: Date, default: Date.now },
    }
  ],
  businessInfo: {
    organization: { type: String, default: '' },
    businessType: { type: String, default: '' },
    talentCategory: { type: String, default: '' },
    taxId: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zipCode: { type: String, default: '' },
    country: { type: String, default: '' },
  },
}, {
  timestamps: true,
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;
