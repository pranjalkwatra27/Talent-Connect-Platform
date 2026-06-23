import { useEffect } from 'react';
import '../components/styles/global.css';

export default function TermsConditions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="terms-page">
      <section className="terms-hero">
        <h1>Terms & Conditions</h1>
        <p>Please read these terms carefully before using our services.</p>
      </section>

      <div className="terms-container">
        <p className="effective-date">Effective Date: January 1, 2025</p>
        
        <div className="terms-section">
          <h2>1. Agreement to Terms</h2>
          <p>By accessing and using TalentConnect (the "Website"), you accept and agree to be bound by and comply with these Terms and Conditions. If you do not agree to these Terms, you must not access or use the Website.</p>
        </div>

        <div className="terms-section">
          <h2>2. Intellectual Property Rights</h2>
          <p>Unless otherwise indicated, the Website and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by us, our licensors, or other providers and are protected by copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>
          <p>You may not copy, modify, reproduce, or distribute any content from this Website without our express prior written permission.</p>
        </div>

        <div className="terms-section">
          <h2>3. User Representations</h2>
          <p>By using the Website, you represent and warrant that:</p>
          <ul>
            <li>You have the legal capacity to agree to these Terms.</li>
            <li>You will not use the Website for any illegal or unauthorized purpose.</li>
            <li>Your use of the Website will not violate any applicable law or regulation.</li>
            <li>You are at least 18 years of age or have parental consent to use the Website.</li>
            <li>All registration information you submit will be true, accurate, current, and complete.</li>
          </ul>
        </div>

        <div className="terms-section">
          <h2>4. Prohibited Activities</h2>
          <p>You may not access or use the Website for any purpose other than that for which we make the Website available. Prohibited activities include, but are not limited to:</p>
          <ul>
            <li>Systematically retrieving data to create a collection or database.</li>
            <li>Tricking, defrauding, or misleading us and other users.</li>
            <li>Attempting to bypass any measures of the Website designed to prevent or restrict access.</li>
            <li>Engaging in any automated use of the system, such as using scripts to send comments or messages.</li>
            <li>Interfering with, disrupting, or creating an undue burden on the Website or the networks connected to the Website.</li>
            <li>Using the Website to advertise or offer to sell goods and services.</li>
            <li>Uploading or transmitting viruses or any other type of malicious code.</li>
            <li>Harassing, annoying, intimidating, or threatening any of our employees or agents.</li>
          </ul>
        </div>

        <div className="terms-section">
          <h2>5. User-Generated Contributions</h2>
          <p>The Website may invite you to submit content (e.g., comments, reviews, event listings). You are solely responsible for your contributions and you represent that you own or have the necessary rights to the content you submit.</p>
          <p>By posting your contributions, you grant us an unlimited, irrevocable, worldwide license to use, modify, and display them.</p>
          <p>We have the right, but not the obligation, to monitor and remove any user contributions for any reason.</p>
        </div>

        <div className="terms-section">
          <h2>6. Event Bookings and Payments</h2>
          <h3>Booking Process</h3>
          <p>When you book an event through TalentConnect, you enter into a direct contract with the event organizer. TalentConnect acts as a platform to facilitate this connection but is not responsible for the event itself.</p>
          
          <h3>Payment Terms</h3>
          <p>All payments are processed through our secure payment partners. By making a payment, you authorize us to charge the full amount to your selected payment method.</p>
          
          <h3>Refund Policy</h3>
          <p>Refund policies are set by individual event organizers and may vary. Please review the specific refund policy for each event before booking. TalentConnect is not responsible for issuing refunds unless required by law.</p>
          
          <h3>Cancellations</h3>
          <p>Event cancellations are handled according to the organizer's cancellation policy. If an event is canceled by the organizer, you will receive a full refund.</p>
        </div>

        <div className="terms-section">
          <h2>7. Event Hosting</h2>
          <h3>Host Responsibilities</h3>
          <p>As an event host, you are responsible for:</p>
          <ul>
            <li>Providing accurate and complete information about your event.</li>
            <li>Honoring all bookings made through our platform.</li>
            <li>Complying with all applicable laws and regulations.</li>
            <li>Maintaining appropriate insurance for your events.</li>
          </ul>
          
          <h3>Host Fees</h3>
          <p>TalentConnect charges a service fee for events hosted on our platform. This fee is deducted from the ticket price before funds are transferred to the host.</p>
          
          <h3>Content Guidelines</h3>
          <p>Event listings must not contain:</p>
          <ul>
            <li>False or misleading information</li>
            <li>Content that violates intellectual property rights</li>
            <li>Adult, explicit, or offensive material</li>
            <li>Promotion of illegal activities</li>
          </ul>
        </div>

        <div className="terms-section">
          <h2>8. Website Management</h2>
          <p>We reserve the right to:</p>
          <ul>
            <li>Monitor the Website for violations of these Terms.</li>
            <li>Take appropriate legal action against anyone who violates the law or these Terms.</li>
            <li>Refuse, restrict, or disable access to the Website to any individual for any reason.</li>
            <li>Otherwise manage the Website in a manner designed to protect our rights and property.</li>
          </ul>
        </div>

        <div className="terms-section">
          <h2>9. Modifications and Interruptions</h2>
          <p>We reserve the right to change, modify, or remove the contents of the Website at any time or for any reason at our sole discretion without notice. We also reserve the right to modify or discontinue all or part of the Website without notice at any time.</p>
          <p>We will not be liable to you or any third party for any modification, suspension, or discontinuance of the Website.</p>
        </div>

        <div className="terms-section">
          <h2>10. Governing Law</h2>
          <p>These Terms shall be governed by and defined in accordance with the laws of India. TalentConnect and you irrevocably consent that the courts of Chandigarh shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these Terms.</p>
        </div>

        <div className="terms-section">
          <h2>11. Disclaimer</h2>
          <p>THE WEBSITE IS PROVIDED ON AN "AS-IS" AND "AS-AVAILABLE" BASIS. YOU AGREE THAT YOUR USE OF THE WEBSITE AND OUR SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE WEBSITE AND YOUR USE THEREOF.</p>
        </div>

        <div className="terms-section">
          <h2>12. Limitation of Liability</h2>
          <p>IN NO EVENT WILL WE, OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE WEBSITE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
        </div>

        <div className="terms-section">
          <h2>13. Indemnification</h2>
          <p>You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys' fees, made by any third party due to or arising out of your use of the Website or a breach of these Terms.</p>
        </div>

        <div className="terms-section">
          <h2>14. Contact Information</h2>
          <p>If you have any questions about these Terms and Conditions, please contact us:</p>
          <ul>
            <li>By email: legal@talentconnect.com</li>
            <li>Through our website contact form: <a href="/contact">Contact Us</a></li>
            <li>By mail: TalentConnect, 123 Event Street, Chandigarh, India 160022</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
