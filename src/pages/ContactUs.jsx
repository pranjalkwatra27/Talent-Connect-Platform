import { useState } from 'react';

const ContactUs = () => {
  const [messageBox, setMessageBox] = useState({ show: false, type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const submitBtn = e.target.querySelector('.submit-btn');
    
    // Disable button and show loading
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
    }
    
    try {
      const formData = new FormData(form);
      
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setMessageBox({
          show: true,
          type: 'success',
          text: 'Thank you for your message! We\'ll get back to you within 24 hours.'
        });
        form.reset();
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
          setMessageBox({ show: false, type: '', text: '' });
        }, 5000);
      } else {
        throw new Error('Failed to send message');
      }
      
    } catch (error) {
      console.error('Contact form error:', error);
      setMessageBox({
        show: true,
        type: 'error',
        text: 'Failed to send message. Please try again or email us directly at pranjal.kwatra@gmail.com'
      });
      
      // Auto-hide after 7 seconds
      setTimeout(() => {
        setMessageBox({ show: false, type: '', text: '' });
      }, 7000);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message';
      }
    }
  };

  const toggleFAQ = (e) => {
    const question = e.currentTarget;
    const answer = question.nextElementSibling;
    
    // Close all other FAQs
    document.querySelectorAll('.faq-answer').forEach(ans => {
      if (ans !== answer) ans.classList.remove('active');
    });
    document.querySelectorAll('.faq-question').forEach(q => {
      if (q !== question) q.classList.remove('active');
    });
    
    // Toggle current FAQ
    question.classList.toggle('active');
    answer.classList.toggle('active');
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <h1>Get In Touch</h1>
        <p>We'd love to hear from you. Let us know how we can help you with your event planning needs.</p>
      </section>

      {/* Contact Content */}
      <div className="contact-container">
        <div className="contact-info">
          <h2>Contact Information</h2>
          
          <div className="contact-details">
            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className="contact-text">
                <h3>Address</h3>
                <p>123 Event Street<br />Mumbai, Maharashtra 400001<br />India</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-phone"></i>
              </div>
              <div className="contact-text">
                <h3>Phone</h3>
                <p>+91 9876543210</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="contact-text">
                <h3>Email</h3>
                <p>pranjal.kwatra@gmail.com</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="contact-text">
                <h3>Business Hours</h3>
                <p>Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 4:00 PM<br />Sunday: Closed</p>
              </div>
            </div>
          </div>
          
          <div className="social-links">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
        
        <div className="contact-form-wrapper">
          <h2>Send Us a Message</h2>
          
          {messageBox.show && (
            <div className={`message-box ${messageBox.type} show`}>
              {messageBox.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="contact-form">
            <input type="hidden" name="access_key" value="48caca13-e946-478d-9acf-ae70cb24ee1d" />
            <input type="hidden" name="subject" value="New Contact Form Submission from TalentConnect" />
            <input type="hidden" name="redirect" value="false" />
            
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your Name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your Email"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="user_subject">Subject</label>
              <input
                type="text"
                id="user_subject"
                name="user_subject"
                placeholder="Subject"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Your Message"
                required
              />
            </div>
            
            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        
        <div className="faq-item">
          <div className="faq-question" onClick={toggleFAQ}>
            <span>How do I create an event on TalentConnect?</span>
            <i className="fas fa-chevron-down"></i>
          </div>
          <div className="faq-answer">
            <p>To create an event, simply sign up for a host account, click on "Host Your Event" and follow the step-by-step process to add your event details, set ticket prices, and publish your event.</p>
          </div>
        </div>
        
        <div className="faq-item">
          <div className="faq-question" onClick={toggleFAQ}>
            <span>What payment methods do you accept?</span>
            <i className="fas fa-chevron-down"></i>
          </div>
          <div className="faq-answer">
            <p>We accept all major credit/debit cards, net banking, UPI, and popular digital wallets like Paytm, Google Pay, and PhonePe.</p>
          </div>
        </div>
        
        <div className="faq-item">
          <div className="faq-question" onClick={toggleFAQ}>
            <span>How can I contact customer support?</span>
            <i className="fas fa-chevron-down"></i>
          </div>
          <div className="faq-answer">
            <p>Our customer support team is available via email at pranjal.kwatra@gmail.com or by phone at +91 9876543210 during business hours. You can also use the contact form on this page.</p>
          </div>
        </div>
        
        <div className="faq-item">
          <div className="faq-question" onClick={toggleFAQ}>
            <span>Can I get a refund for my tickets?</span>
            <i className="fas fa-chevron-down"></i>
          </div>
          <div className="faq-answer">
            <p>Refund policies vary by event. Please check the specific event's refund policy. Generally, refunds are available if requested at least 48 hours before the event, unless otherwise stated.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
