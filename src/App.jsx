import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/context/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';

// Core pages
import Home from './pages/Home';
import Login from './pages/Login';
import BrowseEvents from './pages/BrowseEvents';
import EventDetails from './components/events/EventDetails';
import EventBooking from './pages/EventBooking';
import Payment from './pages/Payment';
import Profile from './pages/Profile';
import HostEvent from './pages/HostEvent';
import ArtistDashboard from './pages/ArtistDashboard';
import ArtistVerification from './pages/ArtistVerification';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import Bookings from './pages/Bookings';

// Footer pages
import Careers from './pages/Careers';
import Blog from './pages/Blog';
import Press from './pages/Press';
import HelpCenter from './pages/HelpCenter';
import FAQs from './pages/FAQs';
import RefundPolicy from './pages/RefundPolicy';
import CancellationPolicy from './pages/CancellationPolicy';
import PartnerResources from './pages/PartnerResources';

// Global styles
import './components/styles/global.css';

function AppContent() {
  return (
    <div className="app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ScrollToTop />
      <Header />
      <main style={{ flex: 1, width: '100%' }}>
        <Routes>
          {/* Core routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/browse" element={<BrowseEvents />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/booking/:id" element={<EventBooking />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/host-event" element={<HostEvent />} />
          <Route path="/artist-dashboard" element={<ArtistDashboard />} />
          <Route path="/artist-verification" element={<ArtistVerification />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          {/* Footer pages */}
          <Route path="/careers" element={<Careers />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/press" element={<Press />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/cancellation-policy" element={<CancellationPolicy />} />
          <Route path="/partner-resources" element={<PartnerResources />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
