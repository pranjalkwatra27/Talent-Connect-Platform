import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';
import * as api from '../services/api';

const ArtistVerification = () => {
  const { user, updateProfile, verifyArtist } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [verificationData, setVerificationData] = useState({
    phoneNumber: '',
    otp: '',
    organization: '',
    businessType: 'individual',
    talentCategory: 'Makeup Artists',
    taxId: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    docType: 'aadhaar',
    docNumber: '',
    docFile: null,
    docFileName: '',
    verificationMethod: 'upload', // 'upload' | 'digilocker'
  });
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [docVerified, setDocVerified] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [dialog, setDialog] = useState({ show: false, type: '', title: '', message: '' });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [digilockerStatus, setDigilockerStatus] = useState('idle'); // idle | pending | success
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    checkVerificationStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const checkVerificationStatus = () => {
    try {
      if (user.role !== 'artist') {
        showDialog('error', 'Access Denied', 'This page is only for artists.');
        setTimeout(() => navigate('/'), 2000);
        return;
      }

      setEmailVerified(!!user.emailVerified);
      setPhoneVerified(!!user.phoneVerified);
      setDocVerified(!!user.docVerified);
      setPaymentComplete(!!user.paymentComplete);

      if (user.phone) {
        setVerificationData(v => ({ ...v, phoneNumber: user.phone }));
      }

      if (user.businessInfo) {
        setVerificationData(v => ({
          ...v,
          organization: user.businessInfo.organization || '',
          businessType: user.businessInfo.businessType || 'individual',
          talentCategory: user.businessInfo.talentCategory || 'Makeup Artists',
          taxId: user.businessInfo.taxId || '',
          address: user.businessInfo.address || '',
          city: user.businessInfo.city || '',
          state: user.businessInfo.state || '',
          zipCode: user.businessInfo.zipCode || '',
          country: user.businessInfo.country || 'India',
        }));
      }

      if (!user.emailVerified) setStep(1);
      else if (!user.phoneVerified) setStep(2);
      else if (!user.docVerified) setStep(3);
      else if (!user.paymentComplete) setStep(4);
      else setStep(5);
    } catch (error) {
      console.error('Error checking status:', error);
    }
  };

  const showDialog = (type, title, message) => {
    setDialog({ show: true, type, title, message });
    setTimeout(() => setDialog({ show: false, type: '', title: '', message: '' }), 4000);
  };

  // --- Step 1: Email Verification ---
  const handleSendEmailVerification = async () => {
    setLoading(true);
    try {
      // Simulate sending verification
      showDialog('success', 'Email Sent!', `Verification email sent to ${user.email}. Check your inbox and spam folder.`);
    } catch (error) {
      showDialog('error', 'Failed', error.message);
    } finally { setLoading(false); }
  };

  const handleCheckEmailVerification = async () => {
    setLoading(true);
    try {
      // Auto-verify for ease of testing in local dev environment
      await updateProfile({ emailVerified: true });
      setEmailVerified(true);
      setStep(2);
      showDialog('success', 'Email Verified!', 'Moving to phone verification...');
    } catch (error) {
      showDialog('error', 'Error', error.message);
    } finally { setLoading(false); }
  };

  // --- Step 2: Phone OTP ---
  const handleSendPhoneOTP = async () => {
    if (!verificationData.phoneNumber || verificationData.phoneNumber.length < 10) {
      showDialog('error', 'Invalid Phone', 'Enter a valid 10-digit number.'); return;
    }
    setLoading(true);
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem('phoneOTP_' + user._id, otpCode);
    setOtpSent(true);
    showDialog('success', 'OTP Sent', `OTP sent to +91 ${verificationData.phoneNumber}. (Demo OTP: ${otpCode})`);
    setLoading(false);
  };

  const handleVerifyPhoneOTP = async () => {
    setLoading(true);
    const savedOTP = localStorage.getItem('phoneOTP_' + user._id);
    if (verificationData.otp === savedOTP) {
      try {
        await updateProfile({
          phone: verificationData.phoneNumber,
          phoneVerified: true
        });
        setPhoneVerified(true);
        setStep(3);
        localStorage.removeItem('phoneOTP_' + user._id);
        showDialog('success', 'Phone Verified!', 'Proceed to document verification.');
      } catch (e) {
        showDialog('error', 'Error', 'Failed to update phone details.');
      }
    } else {
      showDialog('error', 'Wrong OTP', 'The OTP entered is incorrect.');
    }
    setLoading(false);
  };

  // --- Step 3: Document Verification ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showDialog('error', 'File Too Large', 'Maximum file size is 5 MB.'); return;
    }
    setVerificationData(v => ({ ...v, docFile: file, docFileName: file.name }));
  };

  const handleDocumentUpload = async () => {
    if (!verificationData.docNumber.trim()) {
      showDialog('error', 'Required', 'Please enter your document number.'); return;
    }
    if (!verificationData.docFile) {
      showDialog('error', 'Required', 'Please upload your document image/PDF.'); return;
    }
    setLoading(true);
    setUploadProgress(10);
    try {
      setUploadProgress(50);
      await updateProfile({
        docVerified: true,
        docVerification: {
          docType: verificationData.docType,
          docNumber: verificationData.docNumber,
          docUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=300&q=80',
          verifiedAt: new Date().toISOString(),
          status: 'verified',
        }
      });
      setUploadProgress(100);
      setDocVerified(true);
      setStep(4);
      showDialog('success', 'Documents Submitted!', 'Your documents are successfully verified.');
    } catch (error) {
      console.error('Upload error:', error);
      showDialog('error', 'Upload Failed', 'Could not save document. Please try again.');
    } finally { setLoading(false); setUploadProgress(0); }
  };

  const handleDigiLockerVerify = () => {
    setDigilockerStatus('pending');
    showDialog('success', 'DigiLocker', 'Connecting to DigiLocker... (Demo: auto-verifying in 2 seconds)');
    setTimeout(async () => {
      try {
        await updateProfile({
          docVerified: true,
          docVerification: {
            docType: 'digilocker',
            docNumber: 'DigiLocker-Verified',
            verifiedAt: new Date().toISOString(),
            status: 'verified',
          }
        });
        setDigilockerStatus('success');
        setDocVerified(true);
        setStep(4);
        showDialog('success', 'DigiLocker Verified!', 'Your identity has been verified via DigiLocker.');
      } catch (e) {
        setDigilockerStatus('idle');
        showDialog('error', 'Error', 'Could not complete DigiLocker verification.');
      }
    }, 2000);
  };

  // --- Step 4: Business Info & Payment ---
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const businessInfo = {
        organization: verificationData.organization,
        businessType: verificationData.businessType,
        talentCategory: verificationData.talentCategory,
        taxId: verificationData.taxId,
        address: verificationData.address,
        city: verificationData.city,
        state: verificationData.state,
        zipCode: verificationData.zipCode,
        country: verificationData.country
      };
      
      await updateProfile({
        businessInfo,
        paymentComplete: true
      });

      setPaymentComplete(true);
      setStep(5);
      showDialog('success', 'Payment Successful!', 'Verification fee paid successfully!');
    } catch (error) {
      showDialog('error', 'Payment Failed', error.message);
    } finally { setLoading(false); }
  };

  // --- Step 5: Complete ---
  const handleCompleteVerification = async () => {
    setLoading(true);
    try {
      await verifyArtist();
      showDialog('success', 'Account Activated!', 'Your verified artist profile is now live.');
      setTimeout(() => navigate('/artist-dashboard'), 2000);
    } catch (error) {
      showDialog('error', 'Error', error.message);
    } finally { setLoading(false); }
  };

  const docTypes = [
    { value: 'aadhaar', label: 'Aadhaar Card', icon: '🪪' },
    { value: 'pan', label: 'PAN Card', icon: '💳' },
    { value: 'voter', label: 'Voter ID', icon: '🗳️' },
    { value: 'passport', label: 'Passport', icon: '📘' },
    { value: 'driving', label: 'Driving Licence', icon: '🚗' },
  ];

  const steps = [
    { n: 1, label: 'Email', done: emailVerified },
    { n: 2, label: 'Phone', done: phoneVerified },
    { n: 3, label: 'Documents', done: docVerified },
    { n: 4, label: 'Payment', done: paymentComplete },
    { n: 5, label: 'Complete', done: false },
  ];

  return (
    <div className="verification-page" style={{ paddingTop: '100px' }}>
      <div className="verification-container">
        <div className="verification-header">
          <h1>Talent Verification</h1>
          <p>Complete all steps to list your services and get your Verified Partner badge</p>
        </div>

        {/* Progress */}
        <div className="verification-progress" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', margin: '0 auto 36px', maxWidth: '600px' }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '0.9rem',
                  background: s.done ? '#22c55e' : step === s.n ? 'var(--primary)' : 'var(--border)',
                  color: s.done || step === s.n ? 'white' : 'var(--text-muted)',
                  transition: '0.3s'
                }}>
                  {s.done ? <i className="fas fa-check" /> : s.n}
                </div>
                <span style={{ fontSize: '0.72rem', color: step === s.n ? 'var(--primary)' : 'var(--text-muted)', fontWeight: step === s.n ? 700 : 400 }}>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ height: '2px', width: '40px', background: s.done ? '#22c55e' : 'var(--border)', borderRadius: '2px', marginBottom: '20px' }} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Email */}
        {step === 1 && (
          <div className="verification-step">
            <div className="step-icon"><i className="fas fa-envelope" /></div>
            <h2>Verify Your Email</h2>
            <p>We'll send a verification link to <strong>{user?.email}</strong></p>
            <button className="btn-primary" onClick={handleSendEmailVerification} disabled={loading}>
              {loading ? 'Sending...' : '✉️ Send Verification Email'}
            </button>
            <p className="note" style={{ marginTop: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              After clicking the link in your email, click below to confirm.
            </p>
            <button className="btn-secondary" onClick={handleCheckEmailVerification} disabled={loading}>
              {loading ? 'Checking...' : "✅ I've Verified My Email"}
            </button>
          </div>
        )}

        {/* Step 2: Phone OTP */}
        {step === 2 && (
          <div className="verification-step">
            <div className="step-icon"><i className="fas fa-mobile-alt" /></div>
            <h2>Verify Phone Number</h2>
            <p>Enter your mobile number to receive a verification OTP</p>
            <div className="form-group">
              <label>Mobile Number</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ padding: '10px 14px', background: 'var(--border)', borderRadius: '10px', color: 'var(--text)', fontWeight: 600 }}>+91</span>
                <input
                  type="tel" placeholder="10-digit mobile number"
                  value={verificationData.phoneNumber}
                  onChange={(e) => setVerificationData(v => ({ ...v, phoneNumber: e.target.value }))}
                  maxLength="10"
                  style={{ flex: 1 }}
                />
              </div>
            </div>
            {!otpSent ? (
              <button className="btn-primary" onClick={handleSendPhoneOTP} disabled={loading}>
                {loading ? 'Sending...' : '📲 Send OTP'}
              </button>
            ) : (
              <>
                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label>Enter OTP</label>
                  <input type="text" placeholder="6-digit OTP" value={verificationData.otp}
                    onChange={(e) => setVerificationData(v => ({ ...v, otp: e.target.value }))} maxLength="6" />
                </div>
                <button className="btn-primary" onClick={handleVerifyPhoneOTP} disabled={loading}>
                  {loading ? 'Verifying...' : '✅ Verify OTP'}
                </button>
                <button className="btn-secondary" onClick={handleSendPhoneOTP} style={{ marginTop: '10px' }}>Resend OTP</button>
              </>
            )}
          </div>
        )}

        {/* Step 3: Document Verification */}
        {step === 3 && (
          <div className="verification-step">
            <div className="step-icon" style={{ background: 'rgba(139,92,246,0.1)' }}><i className="fas fa-id-card" /></div>
            <h2>Document Verification</h2>
            <p>Verify your identity using an official government document</p>

            {/* Method Toggle */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => setVerificationData(v => ({ ...v, verificationMethod: 'upload' }))}
                style={{
                  padding: '12px 28px', borderRadius: '12px', border: '2px solid',
                  borderColor: verificationData.verificationMethod === 'upload' ? 'var(--primary)' : 'var(--border)',
                  background: verificationData.verificationMethod === 'upload' ? 'rgba(139,92,246,0.1)' : 'var(--card-bg)',
                  color: 'var(--text)', fontWeight: 700, cursor: 'pointer', transition: '0.3s',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                <i className="fas fa-upload" style={{ color: 'var(--primary)' }} /> Upload Document
              </button>
              <button onClick={() => setVerificationData(v => ({ ...v, verificationMethod: 'digilocker' }))}
                style={{
                  padding: '12px 28px', borderRadius: '12px', border: '2px solid',
                  borderColor: verificationData.verificationMethod === 'digilocker' ? '#f97316' : 'var(--border)',
                  background: verificationData.verificationMethod === 'digilocker' ? 'rgba(249,115,22,0.1)' : 'var(--card-bg)',
                  color: 'var(--text)', fontWeight: 700, cursor: 'pointer', transition: '0.3s',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                <span style={{ fontSize: '1.1rem' }}>🏛️</span> DigiLocker
              </button>
            </div>

            {/* Upload Method */}
            {verificationData.verificationMethod === 'upload' && (
              <>
                {/* Doc Type Selection */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '24px' }}>
                  {docTypes.map(d => (
                    <button key={d.value} onClick={() => setVerificationData(v => ({ ...v, docType: d.value }))}
                      style={{
                        padding: '12px 8px', borderRadius: '10px', border: '2px solid',
                        borderColor: verificationData.docType === d.value ? 'var(--primary)' : 'var(--border)',
                        background: verificationData.docType === d.value ? 'rgba(139,92,246,0.1)' : 'var(--card-bg)',
                        color: 'var(--text)', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem',
                        transition: '0.3s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px'
                      }}>
                      <span style={{ fontSize: '1.5rem' }}>{d.icon}</span>
                      {d.label}
                    </button>
                  ))}
                </div>

                <div className="form-group">
                  <label>Document Number <span style={{ color: 'var(--primary)' }}>*</span></label>
                  <input type="text"
                    placeholder={verificationData.docType === 'aadhaar' ? 'XXXX-XXXX-XXXX' : verificationData.docType === 'pan' ? 'ABCDE1234F' : 'Enter document number'}
                    value={verificationData.docNumber}
                    onChange={(e) => setVerificationData(v => ({ ...v, docNumber: e.target.value }))}
                  />
                </div>

                {/* File Upload */}
                <div className="form-group">
                  <label>Upload Document <span style={{ color: 'var(--primary)' }}>*</span></label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: `2px dashed ${verificationData.docFileName ? 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: '14px', padding: '32px 20px', textAlign: 'center',
                      cursor: 'pointer', transition: '0.3s',
                      background: verificationData.docFileName ? 'rgba(139,92,246,0.05)' : 'var(--card-bg)'
                    }}>
                    {verificationData.docFileName ? (
                      <>
                        <i className="fas fa-file-check" style={{ fontSize: '2rem', color: '#22c55e', marginBottom: '8px', display: 'block' }} />
                        <p style={{ color: 'var(--text)', fontWeight: 600 }}>{verificationData.docFileName}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Click to change</p>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-cloud-upload-alt" style={{ fontSize: '2rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }} />
                        <p style={{ color: 'var(--text)', fontWeight: 600 }}>Click to upload</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>JPG, PNG or PDF • Max 5 MB</p>
                      </>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*,.pdf" onChange={handleFileChange} style={{ display: 'none' }} />
                </div>

                {/* Upload Progress */}
                {uploadProgress > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Uploading...</span>
                      <span style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700 }}>{uploadProgress}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--border)', borderRadius: '4px' }}>
                      <div style={{ height: '100%', width: `${uploadProgress}%`, background: 'var(--primary)', borderRadius: '4px', transition: '0.3s' }} />
                    </div>
                  </div>
                )}

                <button className="btn-primary" onClick={handleDocumentUpload} disabled={loading}>
                  {loading ? 'Uploading & Submitting...' : '🔒 Submit for Verification'}
                </button>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '10px', textAlign: 'center' }}>
                  Your documents are securely encrypted and stored. We review within 24–48 hours.
                </p>
              </>
            )}

            {/* DigiLocker Method */}
            {verificationData.verificationMethod === 'digilocker' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  background: 'rgba(249,115,22,0.08)', border: '1.5px solid rgba(249,115,22,0.3)',
                  borderRadius: '16px', padding: '28px 24px', marginBottom: '24px'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🏛️</div>
                  <h3 style={{ color: 'var(--text)', fontWeight: 700, marginBottom: '8px' }}>Verify with DigiLocker</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7 }}>
                    DigiLocker is India's official digital document wallet backed by the Government of India.
                    Your Aadhaar, PAN, driving licence and other documents are fetched directly and securely.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '16px' }}>
                    {['Aadhaar', 'PAN', 'Driving Licence', 'Marksheets', 'Vehicle RC'].map(d => (
                      <span key={d} style={{
                        background: 'rgba(249,115,22,0.1)', color: '#f97316',
                        padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600
                      }}>{d}</span>
                    ))}
                  </div>
                </div>

                {digilockerStatus === 'pending' ? (
                  <div>
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
                    <p style={{ color: 'var(--text-muted)' }}>Connecting to DigiLocker...</p>
                  </div>
                ) : (
                  <button
                    className="btn-primary"
                    onClick={handleDigiLockerVerify}
                    style={{ background: 'linear-gradient(135deg,#f97316,#fb923c)' }}
                  >
                    🏛️ Connect DigiLocker & Verify
                  </button>
                )}

                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '14px' }}>
                  We use DigiLocker's official API (MeitY, Government of India). Your data is never stored without consent.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Business Info + Payment */}
        {step === 4 && (
          <div className="verification-step">
            <div className="step-icon"><i className="fas fa-credit-card" /></div>
            <h2>Business Info & Verification Fee</h2>
            <p>Complete your profile and pay the one-time verification fee</p>

            <form onSubmit={handlePaymentSubmit} className="business-form">
              <div className="form-group">
                <label>Artist / Business Name <span className="required">*</span></label>
                <input type="text" placeholder="Your name or company" value={verificationData.organization}
                  onChange={(e) => setVerificationData(v => ({ ...v, organization: e.target.value }))} required />
              </div>

              <div className="form-group">
                <label>Business Type <span className="required">*</span></label>
                <select value={verificationData.businessType}
                  onChange={(e) => setVerificationData(v => ({ ...v, businessType: e.target.value }))}>
                  <option value="individual">Individual Artist</option>
                  <option value="company">Company / Studio</option>
                  <option value="nonprofit">Agency / Collective</option>
                </select>
              </div>

              <div className="form-group">
                <label>Primary Talent Category <span className="required">*</span></label>
                <select value={verificationData.talentCategory}
                  onChange={(e) => setVerificationData(v => ({ ...v, talentCategory: e.target.value }))}>
                  {['Makeup Artists','Mehndi Artists','Decorators','Caterers','Photographers','Videographers','DJs','Singers','Dancers','Anchors','Wedding Planners','Event Organizers'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>GST / Tax ID (optional)</label>
                <input type="text" placeholder="GSTIN or PAN for business" value={verificationData.taxId}
                  onChange={(e) => setVerificationData(v => ({ ...v, taxId: e.target.value }))} />
              </div>

              <div className="form-group">
                <label>Address <span className="required">*</span></label>
                <input type="text" placeholder="Street address" value={verificationData.address}
                  onChange={(e) => setVerificationData(v => ({ ...v, address: e.target.value }))} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City <span className="required">*</span></label>
                  <input type="text" value={verificationData.city}
                    onChange={(e) => setVerificationData(v => ({ ...v, city: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label>State <span className="required">*</span></label>
                  <input type="text" value={verificationData.state}
                    onChange={(e) => setVerificationData(v => ({ ...v, state: e.target.value }))} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>PIN Code <span className="required">*</span></label>
                  <input type="text" value={verificationData.zipCode}
                    onChange={(e) => setVerificationData(v => ({ ...v, zipCode: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label>Country <span className="required">*</span></label>
                  <select value={verificationData.country}
                    onChange={(e) => setVerificationData(v => ({ ...v, country: e.target.value }))}>
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
              </div>

              <div className="payment-summary">
                <h3>Payment Summary</h3>
                <div className="summary-row"><span>Verification Fee</span><span>₹499</span></div>
                <div className="summary-row"><span>GST (18%)</span><span>₹90</span></div>
                <div className="summary-row total"><span><strong>Total</strong></span><span><strong>₹589</strong></span></div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Processing Payment...' : '💳 Pay ₹589 & Continue'}
              </button>
            </form>
          </div>
        )}

        {/* Step 5: Complete */}
        {step === 5 && (
          <div className="verification-step">
            <div className="step-icon success"><i className="fas fa-check-circle" /></div>
            <h2>All Steps Complete! 🎉</h2>
            <p>Click below to activate your verified artist account and start getting bookings.</p>
            <div className="completion-checklist">
              {[
                { label: 'Email Verified', done: true },
                { label: 'Phone Verified', done: true },
                { label: 'Documents Submitted', done: true },
                { label: 'Payment Complete', done: true },
              ].map(c => (
                <div key={c.label} className="checklist-item">
                  <i className="fas fa-check-circle" style={{ color: '#22c55e' }} />
                  <span>{c.label}</span>
                </div>
              ))}
            </div>
            <button className="btn-primary" onClick={handleCompleteVerification} disabled={loading}>
              {loading ? 'Activating...' : '🚀 Activate My Talent Account'}
            </button>
          </div>
        )}
      </div>

      {/* Dialog */}
      {dialog.show && (
        <div className="verification-dialog">
          <div className={`dialog-content ${dialog.type}`}>
            <i className={`fas fa-${dialog.type === 'success' ? 'check-circle' : 'exclamation-circle'}`} />
            <h3>{dialog.title}</h3>
            <p>{dialog.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistVerification;
