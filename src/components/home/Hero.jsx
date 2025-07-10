import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-text"
        >
          <h1 className="hero-title">
            Experience Luxury <span className="highlight">Beach House Living</span>
          </h1>
          <p className="hero-subtitle">
            Discover exceptional comfort and breathtaking ocean views at Barra Cabanas, Mozambique's premier luxury beach house accommodation.
          </p>
          <div className="hero-buttons">
            <Link to="/services" className="btn btn-primary">
              View Our Properties
            </Link>
            <Link to="/booking" className="btn btn-secondary">
              Book Now
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
