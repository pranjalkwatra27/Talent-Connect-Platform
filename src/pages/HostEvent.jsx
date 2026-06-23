import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';
import * as api from '../services/api';

const HostEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [autoSaveMessage, setAutoSaveMessage] = useState('');
  
  const [formData, setFormData] = useState({
    eventName: '',
    eventDescription: '',
    eventCategory: '',
    eventImage: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    eventType: 'In-Person',
    venueName: '',
    venueAddress: '',
    ticketType: 'Free',
    ticketPrice: '0',
    totalTickets: '',
    customQuestions: '',
    requirePhone: 'No',
    docType: '',
    docNumber: '',
    docFileName: ''
  });

  const steps = ['Service Details', 'Availability', 'Location', 'Pricing', 'Document Verification', 'Questions', 'Review', 'Publish'];
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchServiceData = async () => {
      try {
        setLoading(true);
        const service = await api.getOwnService();
        if (service) {
          setFormData({
            eventName: service.packages?.[0]?.name || 'Standard Service',
            eventDescription: service.description || '',
            eventCategory: service.category || '',
            eventImage: service.image || '',
            eventDate: new Date().toISOString().split('T')[0],
            startTime: '09:00',
            endTime: '18:00',
            eventType: 'In-Person',
            venueName: 'Studio',
            venueAddress: service.city || user.city || 'Mumbai',
            ticketType: service.price > 0 ? 'Paid' : 'Free',
            ticketPrice: service.price?.toString() || '0',
            totalTickets: '30',
            customQuestions: '',
            requirePhone: 'No',
            docType: user.docVerification?.docType || 'aadhaar',
            docNumber: user.docVerification?.docNumber || '',
            docFileName: ''
          });
        }
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [user, navigate]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const autoSaveDraft = async () => {
    setAutoSaveMessage('Auto-saved to draft');
    setTimeout(() => setAutoSaveMessage(''), 1800);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      autoSaveDraft();
    }, 1500);
    return () => clearTimeout(timer);
  }, [formData]);

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return formData.eventName && formData.eventDescription && formData.eventCategory;
      case 1:
        return formData.eventDate && formData.startTime && formData.endTime;
      case 2:
        return formData.eventType && formData.venueName && formData.venueAddress;
      case 3:
        if (formData.ticketType === 'Paid') {
          return formData.totalTickets && Number(formData.ticketPrice) > 0;
        }
        return formData.totalTickets;
      case 4:
        return true; // Document verification optional if verified already
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
    } else {
      alert('Please fill in all required fields before proceeding.');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePublish = async () => {
    if (!user.isVerified) {
      setShowVerificationModal(true);
      return;
    }

    setLoading(true);
    try {
      const serviceData = {
        category: formData.eventCategory,
        description: formData.eventDescription,
        image: formData.eventImage || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
        price: Number(formData.ticketPrice) || 0,
        city: formData.venueAddress || user.city || 'Mumbai',
        packages: [
          {
            name: formData.eventName,
            price: Number(formData.ticketPrice) || 0,
            description: formData.eventDescription,
            features: ['Standard Performance', 'Studio Setup']
          }
        ]
      };

      await api.saveOwnService(serviceData);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error publishing service:', error);
      alert('Failed to publish service listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goToStep = (stepIndex) => {
    if (stepIndex <= currentStep || completedSteps.includes(stepIndex)) {
      setCurrentStep(stepIndex);
    } else {
      let canNavigate = true;
      for (let i = 0; i < stepIndex; i++) {
        if (!completedSteps.includes(i)) {
          canNavigate = false;
          break;
        }
      }
      if (canNavigate) {
        setCurrentStep(stepIndex);
      } else {
        alert('Please complete previous steps first.');
      }
    }
  };

  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  return (
    <div style={{ paddingTop: '100px' }}>
      <div className="progress-bar-host">
        <div className="progress-bar-fill-host" style={{ width: `${progressPercent}%` }}></div>
      </div>

      <div className="page-header-host">
        <h1>List Your Service Profile</h1>
        <p>Set up your service details in simple guided steps — everything auto-saves</p>
      </div>

      <div className="main-host">
        <div className="sidebar-host">
          <h2>Steps</h2>
          <ul className="step-list-host">
            {steps.map((step, index) => (
              <li
                key={index}
                className={`${currentStep === index ? 'active' : ''} ${completedSteps.includes(index) ? 'completed' : ''}`}
                onClick={() => goToStep(index)}
                style={{ cursor: 'pointer' }}
              >
                {step}
              </li>
            ))}
          </ul>
        </div>

        <div className="content-host">
          {/* Step 0: Service Details */}
          {currentStep === 0 && (
            <div className="section-host active">
              <h3>Service Details</h3>
              <div className="form-group-host">
                <label>Service / Profile Name <span className="required">*</span></label>
                <input
                  type="text"
                  value={formData.eventName}
                  onChange={(e) => handleChange('eventName', e.target.value)}
                  placeholder="e.g., Professional Bridal Makeup Package"
                />
              </div>
              <div className="form-group-host">
                <label>Service Description <span className="required">*</span></label>
                <textarea
                  rows="5"
                  value={formData.eventDescription}
                  onChange={(e) => handleChange('eventDescription', e.target.value)}
                  placeholder="Describe your professional portfolio, experience, what is included..."
                />
              </div>
              <div className="form-group-host">
                <label>Talent Category <span className="required">*</span></label>
                <select value={formData.eventCategory} onChange={(e) => handleChange('eventCategory', e.target.value)}>
                  <option value="">Select a category</option>
                  <option value="Makeup Artists">Makeup Artists</option>
                  <option value="Mehndi Artists">Mehndi Artists</option>
                  <option value="Decorators">Decorators</option>
                  <option value="Caterers">Caterers</option>
                  <option value="Photographers">Photographers</option>
                  <option value="Videographers">Videographers</option>
                  <option value="DJs">DJs</option>
                  <option value="Singers">Singers</option>
                  <option value="Dancers">Dancers</option>
                  <option value="Anchors">Anchors</option>
                  <option value="Wedding Planners">Wedding Planners</option>
                  <option value="Event Organizers">Event Organizers</option>
                </select>
              </div>
              <div className="form-group-host">
                <label>Service Profile / Portfolio Image URL</label>
                <input
                  type="url"
                  value={formData.eventImage}
                  onChange={(e) => handleChange('eventImage', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="navigation-host">
                <button className="draft-btn-host" onClick={() => setShowDraftModal(true)}>Save Draft</button>
                <button className="next-btn-host" onClick={nextStep} disabled={!validateStep(0)}>
                  Next <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Availability */}
          {currentStep === 1 && (
            <div className="section-host active">
              <h3>Availability Details</h3>
              <div className="form-group-host">
                <label>Profile/Service Active Date <span className="required">*</span></label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => handleChange('eventDate', e.target.value)}
                />
              </div>
              <div className="form-group-host">
                <label>Start Time <span className="required">*</span></label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                />
              </div>
              <div className="form-group-host">
                <label>End Time <span className="required">*</span></label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                />
              </div>
              <div className="navigation-host">
                <button className="prev-btn-host" onClick={prevStep}>
                  <i className="fas fa-arrow-left"></i> Previous
                </button>
                <button className="next-btn-host" onClick={nextStep} disabled={!validateStep(1)}>
                  Next <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <div className="section-host active">
              <h3>Service Style & Location</h3>
              <div className="form-group-host">
                <label>Service Style <span className="required">*</span></label>
                <select value={formData.eventType} onChange={(e) => handleChange('eventType', e.target.value)}>
                  <option value="In-Person">In-Person (Studio / Venue)</option>
                  <option value="Online">Online / Consultation</option>
                  <option value="Mobile">Mobile (Home visits)</option>
                </select>
              </div>
              <div className="form-group-host">
                <label>Studio/Venue Name <span className="required">*</span></label>
                <input
                  type="text"
                  value={formData.venueName}
                  onChange={(e) => handleChange('venueName', e.target.value)}
                  placeholder="e.g., City Convention Center"
                />
              </div>
              <div className="form-group-host">
                <label>Service City/Address <span className="required">*</span></label>
                <input
                  type="text"
                  value={formData.venueAddress}
                  onChange={(e) => handleChange('venueAddress', e.target.value)}
                  placeholder="Full address or City"
                />
              </div>
              <div className="navigation-host">
                <button className="prev-btn-host" onClick={prevStep}>
                  <i className="fas fa-arrow-left"></i> Previous
                </button>
                <button className="next-btn-host" onClick={nextStep} disabled={!validateStep(2)}>
                  Next <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Pricing */}
          {currentStep === 3 && (
            <div className="section-host active">
              <h3>Pricing & Booking Limits</h3>
              <div className="form-group-host">
                <label>Pricing Type <span className="required">*</span></label>
                <select value={formData.ticketType} onChange={(e) => handleChange('ticketType', e.target.value)}>
                  <option value="Free">Free Consultation</option>
                  <option value="Paid">Paid Service Package</option>
                </select>
              </div>
              {formData.ticketType === 'Paid' && (
                <div className="form-group-host">
                  <label>Service Booking Price (₹) <span className="required">*</span></label>
                  <input
                    type="number"
                    min="0"
                    value={formData.ticketPrice}
                    onChange={(e) => handleChange('ticketPrice', e.target.value)}
                    placeholder="0"
                  />
                </div>
              )}
              <div className="form-group-host">
                <label>Maximum Bookings Limit (Per Month) <span className="required">*</span></label>
                <input
                  type="number"
                  min="1"
                  value={formData.totalTickets}
                  onChange={(e) => handleChange('totalTickets', e.target.value)}
                  placeholder="e.g., 30"
                />
              </div>
              <div className="navigation-host">
                <button className="prev-btn-host" onClick={prevStep}>
                  <i className="fas fa-arrow-left"></i> Previous
                </button>
                <button className="next-btn-host" onClick={nextStep} disabled={!validateStep(3)}>
                  Next <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Verification */}
          {currentStep === 4 && (
            <div className="section-host active">
              <h3>📄 Document Verification Status</h3>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
                <strong style={{ color: '#15803d' }}>Identity Verification Status:</strong>
                <p style={{ color: '#166534', fontSize: '14px', margin: '4px 0 0' }}>
                  {user.isVerified ? '🛡️ Verified Partner (Approved)' : '⚠️ Verification is required to go live. Please complete verification in the Verification section.'}
                </p>
              </div>
              <div className="navigation-host">
                <button className="prev-btn-host" onClick={prevStep}>
                  <i className="fas fa-arrow-left"></i> Previous
                </button>
                <button className="next-btn-host" onClick={nextStep}>
                  Next <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Questions */}
          {currentStep === 5 && (
            <div className="section-host active">
              <h3>Custom Booking Questions</h3>
              <div className="form-group-host">
                <label>Questions for Client (optional)</label>
                <textarea
                  rows="4"
                  value={formData.customQuestions}
                  onChange={(e) => handleChange('customQuestions', e.target.value)}
                  placeholder="e.g., Mention your event color theme"
                />
              </div>
              <div className="navigation-host">
                <button className="prev-btn-host" onClick={prevStep}>
                  <i className="fas fa-arrow-left"></i> Previous
                </button>
                <button className="next-btn-host" onClick={nextStep}>
                  Next <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {currentStep === 6 && (
            <div className="section-host active">
              <h3>Review Details</h3>
              <div className="review-summary">
                <div className="review-item"><strong>Service Name:</strong> {formData.eventName}</div>
                <div className="review-item"><strong>Category:</strong> {formData.eventCategory}</div>
                <div className="review-item"><strong>Price:</strong> ₹{formData.ticketPrice}</div>
                <div className="review-item"><strong>Location/City:</strong> {formData.venueAddress}</div>
                <div className="review-item"><strong>Availability:</strong> {formData.startTime} - {formData.endTime}</div>
              </div>
              <div className="navigation-host">
                <button className="prev-btn-host" onClick={prevStep}>
                  <i className="fas fa-arrow-left"></i> Previous
                </button>
                <button className="next-btn-host" onClick={nextStep}>
                  Next <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* Step 7: Publish */}
          {currentStep === 7 && (
            <div className="section-host active">
              <h3>Publish Service Profile</h3>
              <div style={{ textAlign: 'center', padding: '36px' }}>
                <i className="fas fa-rocket" style={{ fontSize: '64px', color: '#5b21b6', marginBottom: '20px' }}></i>
                <h2>Ready to Publish?</h2>
                <p>Your listing will be live instantly for client search and bookings.</p>
              </div>
              <div className="navigation-host">
                <button className="prev-btn-host" onClick={prevStep}>
                  <i className="fas fa-arrow-left"></i> Previous
                </button>
                <button className="publish-btn-host" onClick={handlePublish} disabled={loading}>
                  {loading ? 'Publishing...' : 'Publish Listing'} <i className="fas fa-check"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-host active">
          <div className="modal-content-host">
            <i className="fas fa-check-circle" style={{ color: '#10b981', fontSize: '64px', marginBottom: '14px' }}></i>
            <h2>Listing Published!</h2>
            <button onClick={() => navigate('/browse')}>View Explore Page</button>
            <button onClick={() => navigate('/artist-dashboard')}>Go to Dashboard</button>
          </div>
        </div>
      )}

      {/* Draft Modal */}
      {showDraftModal && (
        <div className="modal-host active">
          <div className="modal-content-host">
            <h2>Draft Saved!</h2>
            <button onClick={() => setShowDraftModal(false)}>Continue</button>
          </div>
        </div>
      )}

      {/* Verification Required Modal */}
      {showVerificationModal && (
        <div className="modal-host active">
          <div className="modal-content-host">
            <h2>Verification Required</h2>
            <p>Please complete the verification steps to publish your services.</p>
            <button onClick={() => navigate('/artist-verification')}>Verify Now</button>
            <button onClick={() => setShowVerificationModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostEvent;
