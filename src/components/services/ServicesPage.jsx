import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faHeart,
  faUsers,
  faBed,
  faStar,
  faUmbrellaBeach
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
        {service.price && <p className="service-price">{service.price}</p>}
        <ul className="service-details">
          {service.details.map((detail, i) => (
            <li key={i}>{detail}</li>
          ))}
        </ul>
        <Link to="/contact" className="btn btn-primary">Book Now</Link>
      </motion.div>
      <motion.div className="service-image" variants={itemVariants}>
        <img src={service.image} alt={service.title} />
      </motion.div>
    </motion.div>
  );
};

const accommodations = [
  {
    id: 'family-cabana',
    icon: faUsers,
    title: 'Luxury Family Cabana',
    description: 'Spacious comfort for families or small groups. Sleeps 4–6 guests with all the amenities for a perfect family getaway.',
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&h=400&fit=crop',
    price: 'From R2,400 per night',
    details: [
      '2 Bedrooms + sleeper couch',
      'Fully equipped kitchen & dining area',
      'Outdoor braai (BBQ) facilities',
      'Private garden and beach access',
      'Complimentary Wi-Fi'
    ]
  },
  {
    id: 'honeymoon-suite',
    icon: faHeart,
    title: 'Honeymoon Suite',
    description: 'Intimate and secluded with stunning sunset views. Perfect for couples and special celebrations.',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop',
    price: 'From R2,100 per night',
    details: [
      'Romantic four-poster bed',
      'Private plunge pool or outdoor bath (select units)',
      'Complimentary bottle of champagne',
      'Custom mood lighting and luxury linens',
      'Late check-out available on request'
    ]
  },
  {
    id: 'ocean-breeze',
    icon: faUmbrellaBeach,
    title: 'Ocean Breeze Bungalow',
    description: 'Budget-friendly without compromising style or comfort. Simple. Elegant. Refreshing.',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop',
    price: 'From R1,200 per night',
    details: [
      'Queen-size bed and en-suite bathroom',
      'Outdoor kitchenette and dining space',
      'Ideal for solo travelers or couples on a getaway',
      '50m from the beach',
      'Daily housekeeping included'
    ]
  },
  {
    id: 'premium-services',
    icon: faStar,
    title: 'Premium Add-On Services',
    description: 'Enhance your stay with optional luxury services and experiences.',
    image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600&h=400&fit=crop',
    price: 'Custom pricing available',
    details: [
      'Private Chef / Meal Catering',
      'Sunset Dhow Cruises',
      'Airport Transfers from Inhambane',
      'Massage & Spa Services',
      'Local Guided Tours (snorkeling, diving, etc.)'
    ]
  },
  {
    id: 'beachfront-villa',
    icon: faHome,
    title: 'Exclusive Beachfront Villa',
    description: 'Our most luxurious accommodation with direct beach access and premium amenities.',
    image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c90a?w=600&h=400&fit=crop',
    price: 'From R3,500 per night',
    details: [
      'Private beachfront location',
      '3 bedrooms with ocean views',
      'Full kitchen and living area',
      'Private pool and outdoor entertainment area',
      'Dedicated concierge service'
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
          <h1 className="services-hero-title">Our Accommodation</h1>
          <p className="services-hero-subtitle">
            Luxury Beachfront Living – Tailored for Your Perfect Escape
          </p>
        </div>
      </div>

      <section className="popular-service-highlight">
        <div className="container">
          <div className="popular-service-card">
            <div className="popular-badge">⭐ MOST POPULAR</div>
            <h2>Seaview Cabana – From R1,500 per night!</h2>
            <p>Wake up to the sound of the waves and breathtaking views of the Indian Ocean. This elegant, fully equipped cabana is perfect for couples or solo travelers seeking peace, privacy, and style.</p>
            <div className="popular-features">
              <div className="feature">✓ King-size bed with ocean views</div>
              <div className="feature">✓ Private deck and outdoor seating</div>
              <div className="feature">✓ Air conditioning & mosquito nets</div>
              <div className="feature">✓ En-suite bathroom with walk-in shower</div>
              <div className="feature">✓ Kitchenette with fridge, microwave & kettle</div>
              <div className="feature">✓ Daily servicing & secure parking</div>
            </div>
            <div className="popular-price">
              <span className="price">R1,500 / night</span>
              <span className="price-note">All-inclusive – No hidden fees</span>
            </div>
            <Link to="/contact" className="btn btn-primary popular-cta">Book Your Stay Now</Link>
          </div>
        </div>
      </section>

      <section className="services-intro">
        <div className="container">
          <div className="intro-content">
            <h2>How We Make Your Stay Special</h2>
            <p>
              At Barra Cabanas, every stay is more than just a holiday — it's a curated experience of barefoot luxury. Whether you're seeking relaxation, romance, or adventure, our wide range of accommodation options and personalized guest services ensure that every moment is memorable.
            </p>
            <p>
              All stays include access to the beach, lush gardens, and optional concierge services for local excursions and amenities. Explore our accommodation options below to find your perfect escape.
            </p>
          </div>
        </div>
      </section>

      <section className="services-list">
        <div className="container">
          {accommodations.map((service, index) => (
            <ServiceItem key={service.id} service={service} index={index} />
          ))}
        </div>
      </section>

      <section className="services-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Escape to Paradise?</h2>
            <p>
              Contact us today to book your ideal cabana or get help planning the perfect tropical escape to Mozambique.
            </p>
            <Link to="/contact" className="btn btn-primary">Book Your Stay</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
