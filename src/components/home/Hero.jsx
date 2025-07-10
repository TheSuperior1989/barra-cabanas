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
            Transforming Ideas into <span className="highlight">Digital Masterpieces</span>
          </h1>
          <p className="hero-subtitle">
            Precision in code, creativity in design. We bring your vision to life with cutting-edge technology and innovative solutions.
          </p>
          <div className="hero-buttons">
            <Link to="/services" className="btn btn-primary">
              View Our Services
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              Get a Quote
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
