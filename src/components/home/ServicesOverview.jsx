import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDesktop,
  faPaintBrush,
  faCode,
  faHashtag,
  faCogs,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';
import PlaceholderImage from '../common/PlaceholderImage';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './ServicesOverview.css';

const services = [
  {
    id: 'cnc',
    icon: faCogs,
    title: 'Mill & Lathe CNC Conversions',
    description: 'Transform traditional machinery into precision CNC equipment with our expert conversion services.',
    link: '/services#cnc'
  },
  {
    id: 'design',
    icon: faPaintBrush,
    title: 'Creative Design & Visualization',
    description: 'Bring your ideas to life with stunning visualizations and creative design solutions.',
    link: '/services#design'
  },
  {
    id: 'web',
    icon: faDesktop,
    title: 'Website Development',
    description: 'Custom, responsive websites built with modern technologies to showcase your brand.',
    link: '/services#web'
  },
  {
    id: 'graphic',
    icon: faPaintBrush,
    title: 'Graphic Design & Branding',
    description: 'Establish a strong brand identity with professional graphic design services.',
    link: '/services#graphic'
  },
  {
    id: 'social',
    icon: faHashtag,
    title: 'Social Media Marketing',
    description: 'Engage your audience and grow your brand with strategic social media management.',
    link: '/services#social'
  },
  {
    id: 'software',
    icon: faCode,
    title: 'Software Development',
    description: 'Custom software solutions for web, Android, and iOS platforms.',
    link: '/services#software'
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
            We offer a wide range of services to help your business grow and succeed in the digital age.
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
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;
