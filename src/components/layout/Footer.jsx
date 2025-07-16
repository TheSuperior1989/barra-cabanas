import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
  faYoutube,
  faWhatsapp,
  faSkype,
  faTelegram
} from '@fortawesome/free-brands-svg-icons';
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleLinkClick = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="footer brand-footer">
      <div className="footer-main">
        <div className="container container--mw1320">
          <div className="footer-content">
            {/* Brand Section */}
            <div className="footer-section footer-brand">
              <div className="footer-logo">
                <h3 className="footer-brand-title">BARRA CABANAS</h3>
                <p className="footer-tagline">Simply #1 Beach Resort Experience</p>
              </div>
              <div className="social-icons">
                <a href="https://www.facebook.com/profile.php?id=100092689467268" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <FontAwesomeIcon icon={faYoutube} />
                </a>
                <a href="https://wa.me/27833793741" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <FontAwesomeIcon icon={faWhatsapp} />
                </a>
                <a href="skype:live:barracabanas" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <FontAwesomeIcon icon={faSkype} />
                </a>
                <a href="https://t.me/barracabanas" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <FontAwesomeIcon icon={faTelegram} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section footer-links-col">
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-links">
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/'); }}>Home</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/about'); }}>About</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/services'); }}>Accommodation</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/portfolio'); }}>Gallery</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/contact'); }}>Contact</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-section footer-links-col">
              <h3 className="footer-title">Contact Us</h3>
              <ul className="footer-links">
                <li><a href="mailto:info@barracabanas.com">info@barracabanas.com</a></li>
                <li><a href="tel:+27833793741">+27 83 379 3741</a></li>
                <li><span>Barra, Mozambique</span></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="footer-section footer-newsletter">
              <h3 className="footer-title">Remain Updated</h3>
              <form onSubmit={handleEmailSubmit} className="newsletter-form">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-btn">
                  Sign up
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container container--mw1320">
          <div className="footer-bottom-content">
            <p className="copyright">&copy; {currentYear}. All rights reserved.</p>
            <p className="designed-by">Built by SkillAxisDynamics</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
