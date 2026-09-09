import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const searchParams = new URLSearchParams(location.search);
  const isSignupParam = searchParams.get('signup') === 'true';
  const redirectTarget = searchParams.get('redirect') || '/';

  const [activeTab, setActiveTab] = useState(() => (isSignupParam ? 'signup' : 'login'));
  const [loginData, setLoginData] = useState(() => {
    const savedEmail = typeof window !== 'undefined' ? localStorage.getItem('talentConnectEmail') || '' : '';
    return { email: savedEmail, password: '', rememberMe: Boolean(savedEmail) };
  });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [resetEmail, setResetEmail] = useState('');
  const [showPassword, setShowPassword] = useState({});
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState({ show: false, icon: '', title: '', message: '', buttons: [] });
  
  const { login, signup } = useAuth();

  const showDialog = (icon, title, message, buttons = []) => {
    setDialog({ show: true, icon, title, message, buttons });
    if (buttons.length === 0) {
      setTimeout(() => setDialog({ show: false, icon: '', title: '', message: '', buttons: [] }), 1200);
    }
  };

  const closeDialog = () => {
    setDialog({ show: false, icon: '', title: '', message: '', buttons: [] });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      const userData = await login(loginData.email, loginData.password);

      if (loginData.rememberMe) {
        localStorage.setItem('talentConnectEmail', loginData.email);
      } else {
        localStorage.removeItem('talentConnectEmail');
      }

      showDialog(
        '<i class="fas fa-check-circle success"></i>',
        'Welcome Back!',
        `You have successfully signed in as ${userData.name || 'User'}.`,
        []
      );

      setTimeout(() => {
        navigate(redirectTarget);
      }, 700);
    } catch (error) {
      console.error('Login error:', error);
      showDialog(
        '<i class="fas fa-exclamation-circle error"></i>',
        'Login Failed',
        error.message || 'Incorrect email or password.',
        [{ text: 'OK', primary: true }]
      );
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      showDialog(
        '<i class="fas fa-exclamation-circle error"></i>',
        'Password Mismatch',
        'The passwords you entered do not match. Please try again.',
        [{ text: 'OK', primary: true }]
      );
      return;
    }

    if (signupData.password.length < 6) {
      showDialog(
        '<i class="fas fa-exclamation-circle error"></i>',
        'Password Too Short',
        'Password must be at least 6 characters long.',
        [{ text: 'OK', primary: true }]
      );
      return;
    }

    setLoading(true);
    try {
      // Default to client role on sign up
      await signup(signupData.email, signupData.password, signupData.name, 'client');

      showDialog(
        '<i class="fas fa-check-circle success"></i>',
        'Account Created!',
        'Your TalentConnect account has been successfully created.',
        []
      );

      setTimeout(() => {
        navigate(redirectTarget);
      }, 700);
    } catch (error) {
      console.error('Signup error:', error);
      showDialog(
        '<i class="fas fa-exclamation-circle error"></i>',
        'Signup Failed',
        error.message || 'Failed to create account.',
        [{ text: 'OK', primary: true }]
      );
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    showDialog(
      '<i class="fas fa-info-circle info"></i>',
      'Feature Coming Soon',
      'Password reset via email is under maintenance. Please contact support.',
      [{ text: 'OK', primary: true }]
    );
  };

  const togglePassword = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="auth-page">
      <section className="auth-hero">
        <h1>Welcome to TalentConnect</h1>
        <p>Sign in to access your account and book or manage talent services</p>
      </section>

      <section className="auth-container">
        <div className="auth-box">
          {activeTab !== 'forgot' && (
            <div className="auth-tabs">
              <div 
                className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => setActiveTab('login')}
              >
                Login
              </div>
              <div 
                className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
                onClick={() => setActiveTab('signup')}
              >
                Sign Up
              </div>
            </div>
          )}
          
          {/* Login Form */}
          <form 
            className={`auth-form ${activeTab === 'login' ? 'active' : ''}`} 
            onSubmit={handleLogin}
          >
            <h2>Sign In to Your Account</h2>
            
            <div className="form-group">
              <label htmlFor="loginEmail">Email Address</label>
              <input
                type="email"
                id="loginEmail"
                placeholder="Your email address"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="loginPassword">Password</label>
              <div className="password-input">
                <input
                  type={showPassword.loginPassword ? 'text' : 'password'}
                  id="loginPassword"
                  placeholder="Your password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
                <span className="toggle-password" onClick={() => togglePassword('loginPassword')}>
                  <i className={`far fa-eye${showPassword.loginPassword ? '-slash' : ''}`}></i>
                </span>
              </div>
            </div>



            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                checked={loginData.rememberMe}
                onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
              />
              <label htmlFor="rememberMe" style={{ marginBottom: 0 }}>Remember me</label>
            </div>
            
            <a href="#" className="forgot-password" onClick={(e) => { e.preventDefault(); setActiveTab('forgot'); }}>Forgot password?</a>
            <button type="submit" className="auth-submit" disabled={loading}>Sign In</button>
            <div className="auth-switch">Don't have an account? <a onClick={() => setActiveTab('signup')}>Sign up now</a></div>
          </form>
          
          {/* Signup Form */}
          <form 
            className={`auth-form ${activeTab === 'signup' ? 'active' : ''}`}
            onSubmit={handleSignup}
          >
            <h2>Create Your Account</h2>
            
            <div className="form-group">
              <label htmlFor="signupName">Full Name</label>
              <input
                type="text"
                id="signupName"
                placeholder="Your full name"
                value={signupData.name}
                onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="signupEmail">Email Address</label>
              <input
                type="email"
                id="signupEmail"
                placeholder="Your email address"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="signupPassword">Password</label>
              <div className="password-input">
                <input
                  type={showPassword.signupPassword ? 'text' : 'password'}
                  id="signupPassword"
                  placeholder="Create a password (min 6 characters)"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  required
                  minLength="6"
                />
                <span className="toggle-password" onClick={() => togglePassword('signupPassword')}>
                  <i className={`far fa-eye${showPassword.signupPassword ? '-slash' : ''}`}></i>
                </span>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input">
                <input
                  type={showPassword.confirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  required
                />
                <span className="toggle-password" onClick={() => togglePassword('confirmPassword')}>
                  <i className={`far fa-eye${showPassword.confirmPassword ? '-slash' : ''}`}></i>
                </span>
              </div>
            </div>
            

            
            <button type="submit" className="auth-submit" disabled={loading}>Create Account</button>
            <div className="auth-switch">Already have an account? <a onClick={() => setActiveTab('login')}>Sign in</a></div>
          </form>

          {/* Forgot Password Form */}
          <form 
            className={`auth-form ${activeTab === 'forgot' ? 'active' : ''}`}
            onSubmit={handleForgotPassword}
          >
            <h2>Reset Your Password</h2>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '25px' }}>Enter your email address and we'll send you a password reset link.</p>
            
            <div className="form-group">
              <label htmlFor="resetEmail">Email Address</label>
              <input
                type="email"
                id="resetEmail"
                placeholder="Your email address"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="auth-submit" disabled={loading}>Send Reset Link</button>
            <div className="auth-switch"><a onClick={() => setActiveTab('login')}>Back to Login</a></div>
          </form>
        </div>
      </section>

      {/* Dialog */}
      {dialog.show && (
        <div className="custom-dialog active">
          <div className="dialog-content">
            <div className="dialog-icon" dangerouslySetInnerHTML={{ __html: dialog.icon }}></div>
            <h3 className="dialog-title">{dialog.title}</h3>
            <p className="dialog-message">{dialog.message}</p>
            <div className="dialog-buttons">
              {dialog.buttons.map((btn, idx) => (
                <button
                  key={idx}
                  className={`dialog-button ${btn.primary ? 'primary' : 'secondary'}`}
                  onClick={() => {
                    closeDialog();
                    if (btn.onclick) btn.onclick();
                  }}
                >
                  {btn.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
