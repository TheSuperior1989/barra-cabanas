import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDesktop,
  faPaintBrush,
  faCode,
  faHashtag,
  faCogs
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './ServicesPage.css';

// Separate component for service items to fix React Hooks violation
const ServiceItem = ({ service, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      key={service.id}
      id={service.id}
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={`service-item ${index % 2 === 0 ? '' : 'reverse'}`}
    >
      <motion.div className="service-content" variants={itemVariants}>
        <div className="service-icon">
          <FontAwesomeIcon icon={service.icon} />
        </div>
        <h2 className="service-title">{service.title}</h2>
        <p className="service-description">{service.description}</p>
        <ul className="service-details">
          {service.details.map((detail, i) => (
            <li key={i}>{detail}</li>
          ))}
        </ul>
        <Link to="/quote" className="btn btn-primary">Request a Quote</Link>
      </motion.div>
      <motion.div className="service-image" variants={itemVariants}>
        <img src={service.image} alt={service.title} />
      </motion.div>
    </motion.div>
  );
};

const services = [
  {
    id: 'cnc',
    icon: faCogs,
    title: 'Mill & Lathe CNC Conversions',
    description: 'Transform traditional machinery into precision CNC equipment with our expert conversion services.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop',
    details: [
      'Complete retrofitting of manual mills and lathes to CNC operation',
      'Custom software integration for specific manufacturing needs',
      'Training and support for operators transitioning to CNC systems',
      'Ongoing maintenance and troubleshooting services',
      'Performance optimization for maximum efficiency'
    ]
  },
  {
    id: 'design',
    icon: faPaintBrush,
    title: 'Creative Design & Visualization',
    description: 'Bring your ideas to life with stunning visualizations and creative design solutions.',
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&h=400&fit=crop',
    details: [
      '3D modeling and rendering for product visualization',
      'Concept development and prototyping',
      'Technical illustrations and diagrams',
      'Virtual reality (VR) and augmented reality (AR) experiences',
      'Interactive product demonstrations'
    ]
  },
  {
    id: 'web',
    icon: faDesktop,
    title: 'Website Development',
    description: 'Custom, responsive websites built with modern technologies to showcase your brand.',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop',
    details: [
      'Custom website design and development',
      'E-commerce solutions with secure payment processing',
      'Content management system (CMS) integration',
      'Responsive design for all devices',
      'Website maintenance and support'
    ]
  },
  {
    id: 'graphic',
    icon: faPaintBrush,
    title: 'Graphic Design & Branding',
    description: 'Establish a strong brand identity with professional graphic design services.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
    details: [
      'Logo design and brand identity development',
      'Marketing materials (brochures, business cards, etc.)',
      'Packaging design',
      'Social media graphics and templates',
      'Brand style guides and visual standards'
    ]
  },
  {
    id: 'social',
    icon: faHashtag,
    title: 'Social Media Marketing',
    description: 'Engage your audience and grow your brand with strategic social media management.',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop',
    details: [
      'Social media strategy development',
      'Content creation and scheduling',
      'Community management and engagement',
      'Social media advertising campaigns',
      'Performance analytics and reporting'
    ]
  },
  {
    id: 'software',
    icon: faCode,
    title: 'Software Development',
    description: 'Custom software solutions for web, Android, and iOS platforms.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
    details: [
      'Web application development',
      'Mobile app development for iOS and Android',
      'Custom software solutions for specific business needs',
      'API development and integration',
      'Software maintenance and updates'
    ]
  }
];

const ServicesPage = () => {
  const location = useLocation();
  const hash = location.hash.replace('#', '');

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <div className="services-page">
      <div className="services-hero">
        <div className="services-hero-overlay"></div>
        <div className="container">
          <h1 className="services-hero-title">Our Services</h1>
          <p className="services-hero-subtitle">
            Comprehensive solutions tailored to your specific needs
          </p>
        </div>
      </div>

      <section className="popular-service-highlight">
        <div className="container">
          <div className="popular-service-card">
            <div className="popular-badge">⭐ MOST POPULAR</div>
            <h2>Single Page Website - Only R1,500!</h2>
            <p>Perfect for small businesses and startups! Get a professional, mobile-responsive single-page website that showcases your business essentials.</p>
            <div className="popular-features">
              <div className="feature">✓ Modern, Professional Design</div>
              <div className="feature">✓ Mobile Responsive</div>
              <div className="feature">✓ Contact Form Integration</div>
              <div className="feature">✓ Basic SEO Optimization</div>
              <div className="feature">✓ Fast Loading & Secure</div>
            </div>
            <div className="popular-price">
              <span className="price">R1,500</span>
              <span className="price-note">One-time payment</span>
            </div>
            <Link to="/quote" className="btn btn-primary popular-cta">Get Your Website Today!</Link>
          </div>
        </div>
      </section>

      <section className="services-intro">
        <div className="container">
          <div className="intro-content">
            <h2>How We Can Help You</h2>
            <p>
              At SkillAxis Dynamics, we offer a wide range of services designed to help your business thrive in today's competitive landscape. From engineering solutions to digital marketing, our team of experts is committed to delivering high-quality results that exceed your expectations.
            </p>
            <p>
              Each service is customized to meet your specific needs and goals, ensuring that you receive the most effective solution for your business. Explore our services below to learn more about how we can help you succeed.
            </p>
          </div>
        </div>
      </section>

      <section className="services-list">
        <div className="container">
          {services.map((service, index) => (
            <ServiceItem key={service.id} service={service} index={index} />
          ))}
        </div>
      </section>

      <section className="services-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>
              Contact us today to discuss your project and discover how SkillAxis Dynamics can help you achieve your goals.
            </p>
            <Link to="/contact" className="btn btn-primary">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
