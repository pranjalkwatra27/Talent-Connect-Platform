import { useEffect } from 'react';
import '../components/styles/global.css';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        padding: '120px 24px 60px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.2)', padding: '6px 18px',
            borderRadius: '30px', color: '#e2e8f0', fontSize: '0.85rem',
            fontWeight: 700, marginBottom: '20px'
          }}>
            <span style={{ color: '#10b981' }}>●</span> Legal, Compliance & Data Security
          </div>
          <h1 style={{
            color: 'white', fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
            fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}>
            Privacy Policy
          </h1>
          <p style={{
            color: '#cbd5e1', fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            maxWidth: '700px', margin: '0 auto', lineHeight: 1.6
          }}>
            Your privacy is paramount. Learn how TalentConnect encrypts, manages, and safeguards your data.
          </p>
        </div>
      </section>

      <div className="policy-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px 80px' }}>
        <p className="last-updated">Last Updated: January 1, 2025</p>
        
        <div className="policy-section">
          <h2>1. Introduction</h2>
          <p>Welcome to TalentConnect ("we," "our," "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy policy or our practices regarding your personal information, please contact us at privacy@talentconnect.com.</p>
          <p>This privacy policy describes how we might collect, store, use, and share (collectively, "process") your information when you use our services ("Services"), which include our website and any related services, sales, marketing, or events.</p>
          <p>By using our Services, you agree to the collection and use of information in accordance with this policy.</p>
        </div>

        <div className="policy-section">
          <h2>2. Information We Collect</h2>
          <p>We collect personal information that you voluntarily provide to us when you express interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.</p>
          
          <h3>Personal Information You Disclose to Us</h3>
          <p>The personal information we collect may include:</p>
          <ul>
            <li><strong>Identifiers:</strong> Name, email address, postal address, phone number.</li>
            <li><strong>Commercial Information:</strong> Records of products or services purchased, obtained, or considered.</li>
            <li><strong>Internet Activity:</strong> Information about how you use our website, such as your browsing history, search history, and interactions with our site.</li>
            <li><strong>Payment Information:</strong> Credit card details, billing address, and transaction history (processed securely by our payment partners).</li>
          </ul>
          
          <h3>Information Automatically Collected</h3>
          <p>We automatically collect certain information when you visit our website. This information does not reveal your specific identity but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, and other technical information. This information is primarily needed to maintain the security and operation of our Services, and for our internal analytics and reporting purposes.</p>
          <p>Like many businesses, we also collect information through cookies and similar technologies. You can control cookie settings through your browser.</p>
        </div>

        <div className="policy-section">
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect for various business purposes, including:</p>
          <ul>
            <li>To provide and operate the Services.</li>
            <li>To respond to your inquiries and offer customer support.</li>
            <li>To send you administrative information, such as updates, security alerts, and support messages.</li>
            <li>For marketing and promotional purposes, if you have opted-in to receive such communications.</li>
            <li>To analyze how our Services are used so we can improve user experience.</li>
            <li>To prevent fraud and enhance the security of our Services.</li>
            <li>To comply with our legal obligations.</li>
            <li>To facilitate event bookings and manage your event participation.</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2>4. Sharing Your Information</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following situations:</p>
          <ul>
            <li><strong>With Service Providers:</strong> We may share your data with third-party vendors, service providers, contractors, or agents who perform services for us (e.g., payment processing, data analysis, email delivery, hosting services).</li>
            <li><strong>For Legal Reasons:</strong> We may disclose your information where we are legally required to do so to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</li>
            <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
            <li><strong>With Event Organizers:</strong> When you book an event, we share necessary information with the event organizer to facilitate your participation.</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2>5. Cookies and Tracking Technologies</h2>
          <p>We use cookies and similar tracking technologies to access or store information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some parts of our Service.</p>
          <p>We use the following types of cookies:</p>
          <ul>
            <li><strong>Essential Cookies:</strong> Necessary for the website to function properly.</li>
            <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website.</li>
            <li><strong>Functionality Cookies:</strong> Allow the website to remember choices you make.</li>
            <li><strong>Targeting Cookies:</strong> Used to deliver ads relevant to you.</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2>6. Your Privacy Rights</h2>
          <p>Depending on your location, you may have the following rights regarding your personal information:</p>
          <ul>
            <li><strong>Access & Portability:</strong> The right to request copies of your personal data.</li>
            <li><strong>Rectification:</strong> The right to request that we correct any information you believe is inaccurate.</li>
            <li><strong>Erasure:</strong> The right to request that we erase your personal data, under certain conditions.</li>
            <li><strong>Restrict Processing:</strong> The right to request that we restrict the processing of your personal data.</li>
            <li><strong>Object to Processing:</strong> The right to object to our processing of your personal data.</li>
            <li><strong>Withdraw Consent:</strong> Where we rely on your consent, you have the right to withdraw it at any time.</li>
          </ul>
          <p>To exercise these rights, please contact us using the details provided in the "Contact Us" section.</p>
        </div>

        <div className="policy-section">
          <h2>7. Data Security</h2>
          <p>We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.</p>
          <p>We use industry-standard encryption (SSL) to protect data transmission and store sensitive information in encrypted form.</p>
        </div>

        <div className="policy-section">
          <h2>8. International Transfers</h2>
          <p>Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ. By using our Services, you consent to such transfer.</p>
        </div>

        <div className="policy-section">
          <h2>9. Links to Other Websites</h2>
          <p>Our Service may contain links to other websites that are not operated by us. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</p>
        </div>

        <div className="policy-section">
          <h2>10. Changes to This Privacy Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.</p>
        </div>

        <div className="policy-section">
          <h2>11. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, you can contact us:</p>
          <ul>
            <li>By email: privacy@talentconnect.com</li>
            <li>Through our website contact form: <a href="/contact">Contact Us</a></li>
            <li>By mail: TalentConnect, 123 Event Street, Chandigarh, India 160022</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
