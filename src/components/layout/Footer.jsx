import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const handleLinkClick = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">SkillAxis Dynamics</h3>
          <p className="footer-description">
            Transforming ideas into digital masterpieces with precision in code and creativity in design.
          </p>
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
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/'); }}>Home</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/about'); }}>About Us</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/services'); }}>Services</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/portfolio'); }}>Portfolio</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/blog'); }}>Blog</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/quote'); }}>Get a Quote</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/contact'); }}>Contact</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Services</h3>
          <ul className="footer-links">
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/services'); }}>Mill and Lathe CNC Conversions</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/services'); }}>Engineering Design Services</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/services'); }}>Creative Design & Visualization</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/services'); }}>Website Development</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/services'); }}>Graphic Design & Branding</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/services'); }}>Social Media Marketing</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/services'); }}>Software Development</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Contact Us</h3>
          <ul className="footer-links">
            <li>Email: <a href="mailto:info@skillaxisdynamics.co.za">info@skillaxisdynamics.co.za</a></li>
            <li>Phone: <a href="tel:+27782964786">+27 78 296 4786</a></li>
            <li>Phone: <a href="tel:+27824651089">+27 82 465 1089</a></li>
            <li>Location: South Africa, Pretoria</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} SkillAxis Dynamics. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
