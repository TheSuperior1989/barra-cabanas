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
      <div className="cta-overlay"></div>
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="container"
      >
        <div className="cta-content">
          <h2 className="cta-title">Ready to Transform Your Ideas into Reality?</h2>
          <p className="cta-subtitle">
            Contact us today to discuss your project and discover how SkillAxis Dynamics can help you achieve your goals.
          </p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn btn-primary">
              Get in Touch
            </Link>
            <Link to="/services" className="btn btn-secondary">
              Explore Services
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ContactCTA;
