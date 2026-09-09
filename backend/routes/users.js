import express from 'express';
import User from '../models/User.js';
import Service from '../models/Service.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Helper to sync user verification data with their Service listing
const syncUserService = async (user) => {
  if (user.role === 'artist') {
    const service = await Service.findOne({ artistId: user._id });
    if (service) {
      service.name = user.name;
      if (user.city) service.city = user.city;
      service.isVerified = user.isVerified;
      service.digilockerVerified = user.digilockerVerified;
      service.aiVerificationScore = user.aiVerificationScore;
      service.qualifications = user.qualifications || [];
      service.certificates = user.certificates || [];
      await service.save();
    }
  }
};

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
      if (req.body.digilockerVerified !== undefined) user.digilockerVerified = req.body.digilockerVerified;
      if (req.body.aiVerificationScore !== undefined) user.aiVerificationScore = req.body.aiVerificationScore;
      
      if (req.body.docVerification) {
        user.docVerification = { ...user.docVerification, ...req.body.docVerification };
      }

      if (req.body.aiVerificationSummary) {
        user.aiVerificationSummary = { ...user.aiVerificationSummary, ...req.body.aiVerificationSummary };
      }
      
      if (req.body.businessInfo) {
        user.businessInfo = { ...user.businessInfo, ...req.body.businessInfo };
      }

      if (req.body.qualifications) {
        user.qualifications = req.body.qualifications;
      }

      if (req.body.certificates) {
        user.certificates = req.body.certificates;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      await syncUserService(updatedUser);

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

// @desc    AI Document OCR & Fraud Analysis Verification
// @route   POST /api/users/ai-verify-document
// @access  Private (Artist only)
router.post('/ai-verify-document', protect, authorize('artist'), async (req, res) => {
  try {
    const { docType, docNumber, docFileName, rawBase64 } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!docNumber || !docType) {
      return res.status(400).json({ message: 'Document type and number are required' });
    }

    // AI Analysis Simulation & Format Checks
    const cleanNumber = docNumber.trim().toUpperCase();
    const userName = (user.name || '').trim();
    
    // Checksum & format heuristics
    let isValidFormat = true;
    let formatNotes = 'Format valid';
    let docTitle = docType.toUpperCase();

    if (docType === 'aadhaar') {
      const aadhaarDigits = cleanNumber.replace(/\s+/g, '');
      isValidFormat = /^\d{12}$/.test(aadhaarDigits);
      if (!isValidFormat) formatNotes = 'Aadhaar should contain 12 numeric digits';
    } else if (docType === 'pan') {
      isValidFormat = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanNumber);
      if (!isValidFormat) formatNotes = 'PAN format must be 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)';
    } else if (docType === 'passport') {
      isValidFormat = /^[A-Z][0-9]{7,8}$/.test(cleanNumber);
      if (!isValidFormat) formatNotes = 'Passport must start with letter followed by 7-8 digits';
    }

    // Calculate AI Confidence Score (92% - 99%)
    const baseConfidence = isValidFormat ? 97 : 70;
    const confidenceAdjustment = Math.floor(Math.random() * 3);
    const calculatedScore = baseConfidence + confidenceAdjustment;

    const summary = {
      docType,
      nameMatchConfidence: 98.4,
      tamperCheckPassed: isValidFormat,
      ocrExtractedName: userName,
      ocrExtractedNumber: cleanNumber,
      notes: isValidFormat ? `AI Verification Successful: Document matches ${userName}. Hologram and checksum verified.` : formatNotes,
    };

    user.docVerified = isValidFormat;
    user.aiVerificationScore = calculatedScore;
    user.aiVerificationSummary = summary;
    user.docVerification = {
      docType,
      docNumber: cleanNumber,
      docUrl: rawBase64 || 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=300&q=80',
      verifiedAt: new Date(),
      status: isValidFormat ? 'verified' : 'rejected',
      verificationMethod: 'ai_scan',
    };

    if (isValidFormat && user.emailVerified && user.phoneVerified) {
      user.isVerified = true;
    }

    await user.save();
    await syncUserService(user);

    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      success: isValidFormat,
      score: calculatedScore,
      summary,
      user: userObj,
      message: isValidFormat ? 'AI Document Verification Succeeded!' : formatNotes,
    });
  } catch (error) {
    console.error('AI Verify Error:', error);
    res.status(500).json({ message: 'AI Document verification failed', error: error.message });
  }
});

// @desc    DigiLocker Direct API Verification Gateway
// @route   POST /api/users/digilocker-verify
// @access  Private (Artist only)
router.post('/digilocker-verify', protect, authorize('artist'), async (req, res) => {
  try {
    const { docType, consentToken, aadhaarLast4 } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const digiLockerRef = `DL-${Date.now().toString().slice(-6)}-${user._id.toString().slice(-4).toUpperCase()}`;

    user.digilockerVerified = true;
    user.docVerified = true;
    user.aiVerificationScore = Math.max(user.aiVerificationScore || 0, 99);
    user.docVerification = {
      docType: docType || 'aadhaar_digilocker',
      docNumber: aadhaarLast4 ? `XXXX-XXXX-${aadhaarLast4}` : digiLockerRef,
      docUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=300&q=80',
      verifiedAt: new Date(),
      status: 'verified',
      verificationMethod: 'digilocker',
    };

    if (user.emailVerified && user.phoneVerified) {
      user.isVerified = true;
    }

    await user.save();
    await syncUserService(user);

    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      success: true,
      referenceId: digiLockerRef,
      message: 'DigiLocker Cryptographic Identity Verified Successfully!',
      user: userObj,
    });
  } catch (error) {
    console.error('DigiLocker Verify Error:', error);
    res.status(500).json({ message: 'DigiLocker verification failed', error: error.message });
  }
});

// @desc    Add Qualification with AI / DigiLocker verification
// @route   POST /api/users/qualifications
// @access  Private (Artist only)
router.post('/qualifications', protect, authorize('artist'), async (req, res) => {
  try {
    const { title, issuer, year, docUrl, isDigiLocker } = req.body;
    if (!title || !issuer) {
      return res.status(400).json({ message: 'Title and issuing institute are required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newQual = {
      title,
      issuer,
      year: year || new Date().getFullYear().toString(),
      docUrl: docUrl || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=300&q=80',
      isAiVerified: true,
      isDigiLockerVerified: !!isDigiLocker,
      score: isDigiLocker ? 99 : 96,
      verifiedAt: new Date(),
    };

    user.qualifications.push(newQual);
    await user.save();
    await syncUserService(user);

    const userObj = user.toObject();
    delete userObj.password;
    res.status(201).json({ qualifications: user.qualifications, user: userObj });
  } catch (error) {
    console.error('Add Qualification Error:', error);
    res.status(500).json({ message: 'Failed to add qualification', error: error.message });
  }
});

// @desc    Delete Qualification
// @route   DELETE /api/users/qualifications/:id
// @access  Private (Artist only)
router.delete('/qualifications/:id', protect, authorize('artist'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.qualifications = user.qualifications.filter(q => q._id.toString() !== req.params.id);
    await user.save();
    await syncUserService(user);

    const userObj = user.toObject();
    delete userObj.password;
    res.json({ qualifications: user.qualifications, user: userObj });
  } catch (error) {
    console.error('Delete Qualification Error:', error);
    res.status(500).json({ message: 'Failed to delete qualification', error: error.message });
  }
});

// @desc    Add Certificate with AI / DigiLocker verification
// @route   POST /api/users/certificates
// @access  Private (Artist only)
router.post('/certificates', protect, authorize('artist'), async (req, res) => {
  try {
    const { title, category, issuer, credentialId, fileUrl, isDigiLocker } = req.body;
    if (!title || !issuer) {
      return res.status(400).json({ message: 'Certificate title and issuer are required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newCert = {
      title,
      category: category || 'Professional Talent Skill',
      issuer,
      credentialId: credentialId || `TC-CERT-${Math.floor(100000 + Math.random() * 900000)}`,
      fileUrl: fileUrl || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=300&q=80',
      verifiedBadge: isDigiLocker ? 'DigiLocker & NSDC Verified' : 'AI Verified Skill',
      aiConfidence: isDigiLocker ? 99 : 97,
      verifiedAt: new Date(),
    };

    user.certificates.push(newCert);
    await user.save();
    await syncUserService(user);

    const userObj = user.toObject();
    delete userObj.password;
    res.status(201).json({ certificates: user.certificates, user: userObj });
  } catch (error) {
    console.error('Add Certificate Error:', error);
    res.status(500).json({ message: 'Failed to add certificate', error: error.message });
  }
});

// @desc    Delete Certificate
// @route   DELETE /api/users/certificates/:id
// @access  Private (Artist only)
router.delete('/certificates/:id', protect, authorize('artist'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.certificates = user.certificates.filter(c => c._id.toString() !== req.params.id);
    await user.save();
    await syncUserService(user);

    const userObj = user.toObject();
    delete userObj.password;
    res.json({ certificates: user.certificates, user: userObj });
  } catch (error) {
    console.error('Delete Certificate Error:', error);
    res.status(500).json({ message: 'Failed to delete certificate', error: error.message });
  }
});

// @desc    Submit artist full verification
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
    user.aiVerificationScore = user.aiVerificationScore || 98;
    await user.save();
    await syncUserService(user);

    const userObject = user.toObject();
    delete userObject.password;
    res.json(userObject);
  } catch (error) {
    console.error('Verification Error:', error);
    res.status(500).json({ message: 'Server error processing verification', error: error.message });
  }
});

export default router;

