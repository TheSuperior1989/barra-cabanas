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
    <footer className="footer brand-footer">
      <div className="footer-middle">
        <div className="container container--mw1320">
        <div className="footer-section footer-links-col">
          <h3 className="footer-title">Barra Cabanas</h3>
          <p className="footer-description">
            Experience luxury beach house accommodation in Mozambique with exceptional comfort and stunning ocean views.
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

        <div className="footer-section footer-links-col">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/'); }}>Home</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/about'); }}>About Us</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/services'); }}>Accommodation</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/portfolio'); }}>Gallery</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/blog'); }}>Blog</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/booking'); }}>Book Now</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/contact'); }}>Contact</a></li>
          </ul>
        </div>

        <div className="footer-section footer-links-col">
          <h3 className="footer-title">Accommodation</h3>
          <ul className="footer-links">
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/services'); }}>Luxury Beach Houses</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/services'); }}>Ocean View Properties</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/services'); }}>Private Beach Access</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/services'); }}>Premium Amenities</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/services'); }}>Concierge Services</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('/services'); }}>Activities & Excursions</a></li>
          </ul>
        </div>

        <div className="footer-section footer-links-col">
          <h3 className="footer-title">Contact Us</h3>
          <ul className="footer-links">
            <li>Email: <a href="mailto:info@barracabanas.com">info@barracabanas.com</a></li>
            <li>Phone: <a href="tel:+27833793741">+27 83 379 3741</a></li>
            <li>Location: Barra, Mozambique</li>
          </ul>
        </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Barra Cabanas. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
