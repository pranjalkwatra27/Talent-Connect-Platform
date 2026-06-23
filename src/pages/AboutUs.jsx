import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <h1>About TalentConnect</h1>
        <p>Your Gateway to Amazing Events & Effortless Event Organization</p>
      </section>

      {/* Introduction */}
      <section className="section">
        <div className="section-content">
          <h2>Welcome to <span>TalentConnect</span></h2>
          <p>Welcome to TalentConnect - the ultimate event booking platform where discovering great events is effortless, and organizing your own is simple and powerful.</p>
        </div>
      </section>

      {/* What We Do */}
      <section className="section section-dark">
        <div className="section-content">
          <h2>What <span>We Do</span></h2>
          
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <h3>Event Booking Made Simple</h3>
              <p>Browse and book tickets for amazing local events - from intimate concerts and cultural shows to workshops and parties. Everything you need is just a few clicks away.</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-microphone"></i>
              </div>
              <h3>Event Organization Made Easy</h3>
              <p>Want to organize your own event? Whether you're an artist planning a concert, hosting a workshop, or organizing any celebration - create your event, set your price, and let customers book instantly.</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-bullhorn"></i>
              </div>
              <h3>No Marketing Headaches</h3>
              <p>No banners, no flyers, no complicated marketing needed. Our platform is your advertising, reaching thousands of potential attendees.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <div className="section-content">
          <h2>How It <span>Works</span></h2>
          
          <div className="how-it-works">
            <div className="how-column">
              <h3><i className="fas fa-ticket-alt"></i> For Event-Goers</h3>
              
              <ul className="step-list">
                <li>Discover local events happening around you</li>
                <li>Book tickets instantly with secure payment processing</li>
                <li>Get confirmations immediately with all event details</li>
                <li>Rate and review your experiences</li>
              </ul>
            </div>
            
            <div className="how-column">
              <h3><i className="fas fa-clipboard-list"></i> For Event Organizers</h3>
              
              <ul className="step-list">
                <li>Create events in minutes - set date, price, capacity, description</li>
                <li>Publish instantly to thousands of potential attendees</li>
                <li>Manage bookings effortlessly - track sales, attendee lists, payments</li>
                <li>Perfect for artists - musicians, performers, and creators hosting their own shows</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section section-dark mission-section">
        <div className="section-content">
          <h2>Our <span>Mission</span></h2>
          <p>To make event discovery and organization effortless while empowering anyone to become a successful event creator.</p>
          <p>We're creating a vibrant ecosystem where:</p>
          
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-search"></i>
              </div>
              <h3>Great Events Find Audience</h3>
              <p>Great events find their perfect audience through our platform</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Organizers Succeed</h3>
              <p>Event organizers succeed without expensive marketing</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-music"></i>
              </div>
              <h3>Artists Thrive</h3>
              <p>Artists can host their own shows and build direct fan relationships</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section">
        <div className="section-content">
          <h2>Why Choose <span>TalentConnect?</span></h2>
          
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h3>Complete Event Solution</h3>
              <p>Book events and organize events - everything in one powerful platform.</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <h3>Cost-Effective</h3>
              <p>Eliminate expensive advertising costs. Digital promotion reaches more people at a fraction of traditional marketing costs.</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Secure & Reliable</h3>
              <p>Professional payment processing, event management tools, and trusted booking system.</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-rocket"></i>
              </div>
              <h3>Empowers Creators</h3>
              <p>Artists and organizers get direct access to audiences without middlemen or expensive marketing campaigns.</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>User-Friendly</h3>
              <p>Intuitive design that works perfectly on phones, tablets, and computers.</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-gem"></i>
              </div>
              <h3>Quality Experience</h3>
              <p>We're committed to providing the best experience for both event organizers and attendees.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="section section-dark">
        <div className="section-content">
          <h2>Our <span>Vision</span></h2>
          <p>To become the go-to platform for all event-related needs - where booking a concert ticket is as easy as ordering food, and organizing an event is as simple as posting a photo.</p>
          <p>We're building more than a platform; we're creating a community where entertainment thrives, creativity is celebrated, and every event becomes a memorable experience.</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Join Our <span>Community</span></h2>
        <p>Whether you're looking to attend amazing events or organize your own celebration - you're welcome here.</p>
        <p>Ready to discover your next great experience or share your event with the world?</p>
        <div className="cta-buttons">
          <Link to="/browse" className="cta-button primary">Browse Events</Link>
          <Link to="/host-event" className="cta-button secondary">Host an Event</Link>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section contact-section">
        <div className="section-content">
          <h2>Get In <span>Touch</span></h2>
          <p>Questions? Ideas? We'd love to hear from you!</p>
          
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <h3>Email</h3>
              <p>info@talentconnect.com</p>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-phone"></i>
              </div>
              <h3>Phone</h3>
              <p>+91 9876543210</p>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3>Location</h3>
              <p>Based in Rajpura, India</p>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-globe"></i>
              </div>
              <h3>Serving</h3>
              <p>Local communities everywhere</p>
            </div>
          </div>
          
          <p style={{ marginTop: '40px', fontStyle: 'italic' }}>
            Join the future of event entertainment - simple, digital, and creator-driven.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
