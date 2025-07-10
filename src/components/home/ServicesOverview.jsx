import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUtensils,
  faBell,
  faPalette,
  faCalendarAlt,
  faSpa
} from '@fortawesome/free-solid-svg-icons';
import PlaceholderImage from '../common/PlaceholderImage';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './ServicesOverview.css';

const services = [
  {
    id: 'accommodation',
    icon: faHome,
    title: 'Exclusive Beachfront Accommodation',
    description: 'Stay in beautifully designed beach houses offering panoramic ocean views, stylish interiors, and premium amenities.',
    link: '/services#accommodation'
  },
  {
    id: 'chef',
    icon: faUtensils,
    title: 'Private Chef & Catering Services',
    description: 'Savor gourmet meals prepared by our in-house chef or enjoy customized catering for special occasions.',
    link: '/services#chef'
  },
  {
    id: 'concierge',
    icon: faBell,
    title: 'Concierge & Guest Services',
    description: 'From private transfers to curated experiences, our concierge team ensures your stay is seamless and unforgettable.',
    link: '/services#concierge'
  },
  {
    id: 'styling',
    icon: faPalette,
    title: 'Interior Styling & Ambience',
    description: 'Relax in tastefully decorated spaces featuring coastal luxury, hand-picked furnishings, and calming atmospheres.',
    link: '/services#styling'
  },
  {
    id: 'events',
    icon: faCalendarAlt,
    title: 'Event Hosting & Venue Hire',
    description: 'Host intimate events, weddings, or corporate retreats in a stunning beachfront setting tailored to your vision.',
    link: '/services#events'
  },
  {
    id: 'wellness',
    icon: faSpa,
    title: 'Wellness & Leisure Experiences',
    description: 'Enjoy spa treatments, yoga sessions, or guided beach walks designed to rejuvenate your body and mind.',
    link: '/services#wellness'
  }
];

const ServicesOverview = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="services-overview" id="services">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            Experience unmatched comfort, elegance, and personalized service at our luxury beachfront retreat.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="services-grid"
        >
          {services.map((service) => (
            <motion.div key={service.id} className="service-card" variants={itemVariants}>
              <div className="service-icon">
                <FontAwesomeIcon icon={service.icon} />
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <Link to={service.link} className="service-link">
                Learn More
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="services-cta">
          <Link to="/services" className="btn btn-primary">
            Explore All Services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;
