import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './ContactCTA.css';

const ContactCTA = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8
      }
    }
  };

  return (
    <section className="contact-cta">
      {/* Scrolling Images Background */}
      <div className="scrolling-images">
        <div className="image-track">
          <img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop" alt="Tropical Beach" />
          <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop" alt="Beach Villa" />
          <img src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=300&fit=crop" alt="Ocean View" />
          <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=300&fit=crop" alt="Beach Activities" />
          <img src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop" alt="Sunset Beach" />
          <img src="https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400&h=300&fit=crop" alt="Beach Relaxation" />
          <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" alt="Tropical Paradise" />
          <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop" alt="Beach House" />
          <img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop" alt="Tropical Beach" />
          <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop" alt="Beach Villa" />
          <img src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=300&fit=crop" alt="Ocean View" />
          <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=300&fit=crop" alt="Beach Activities" />
        </div>
      </div>

      {/* CTA Content Overlay */}
      <div className="cta-overlay"></div>
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="container"
      >
        <div className="cta-content">
          <h2 className="cta-title">Ready to Experience Luxury Beach Accommodation?</h2>
          <p className="cta-subtitle">
            Contact us today to book your stay and discover the exceptional comfort and beauty of Barra Cabanas.
          </p>
          <div className="cta-buttons">
            <Link to="/booking" className="btn btn-primary">
              Book Your Stay
            </Link>
            <Link to="/services" className="btn btn-secondary">
              View Properties
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ContactCTA;
