import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './PortfolioPage.css';

// Gallery items showcasing Barra Cabanas accommodations and experiences
const galleryItems = [
  {
    id: 1,
    title: 'The Ocean Pearl',
    category: 'Beach Houses',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop',
    description: 'A signature beachfront villa with elegant coastal design, panoramic sea views, and ultimate privacy.',
    location: 'Beachfront Villa',
    date: 'Featured Property',
    tags: ['Luxury', 'Beachfront', 'Privacy']
  },
  {
    id: 2,
    title: 'Sunset Cove Suite',
    category: 'Interiors',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop',
    description: 'Experience the warm tones, handcrafted furnishings, and soothing textures of our romantic suite, built for relaxation and romance.',
    location: 'Honeymoon Suite',
    date: 'Interior Design',
    tags: ['Romance', 'Luxury', 'Design']
  },
  {
    id: 3,
    title: 'Barra Sunrise',
    category: 'Nature & Views',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    description: 'Witness breathtaking sunrises, swaying palms, and untouched beachfront beauty — all just steps from your cabana.',
    location: 'Barra Beach',
    date: 'Natural Beauty',
    tags: ['Sunrise', 'Beach', 'Nature']
  },
  {
    id: 4,
    title: 'Family Moments at Coral Breeze',
    category: 'Guest Moments',
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&h=400&fit=crop',
    description: 'Laugh, relax, and reconnect in one of our spacious family units — perfect for holidays with loved ones.',
    location: 'Family Cabana',
    date: 'Guest Experience',
    tags: ['Family', 'Relaxation', 'Memories']
  },
  {
    id: 5,
    title: 'Beach Wedding Setup',
    category: 'Events & Experiences',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=400&fit=crop',
    description: 'Celebrate love with a barefoot ceremony on the beach — we host intimate events in a truly magical setting.',
    location: 'Beachfront Venue',
    date: 'Special Events',
    tags: ['Wedding', 'Romance', 'Celebration']
  },
  {
    id: 6,
    title: 'Mozambique Adventures',
    category: 'Experiences',
    image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600&h=400&fit=crop',
    description: 'Snorkeling, dhow cruises, local markets, and more — discover the cultural and natural treasures of Barra and Inhambane.',
    location: 'Local Excursions',
    date: 'Adventure Activities',
    tags: ['Adventure', 'Culture', 'Exploration']
  }
];

const categories = [
  'All',
  'Beach Houses',
  'Interiors',
  'Nature & Views',
  'Guest Moments',
  'Events & Experiences',
  'Experiences'
];

const PortfolioPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredGalleryItems = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const openGalleryDetails = (item) => {
    setSelectedProject(item);
  };

  const closeGalleryDetails = () => {
    setSelectedProject(null);
  };

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
    <div className="portfolio-page">
      <div className="portfolio-hero">
        <div className="portfolio-hero-overlay"></div>
        <div className="container">
          <h1 className="portfolio-hero-title">Gallery</h1>
          <p className="portfolio-hero-subtitle">
            Step inside paradise — a visual journey through Barra Cabanas
          </p>
        </div>
      </div>

      <section className="gallery-intro">
        <div className="container">
          <p className="gallery-description">
            Explore the beauty, comfort, and unforgettable atmosphere of our luxury beach accommodation. From serene sunrise views to elegant interiors and seaside moments, get inspired for your next escape to Mozambique.
          </p>
        </div>
      </section>

      <section className="portfolio-content">
        <div className="container">
          <div className="portfolio-filter">
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="portfolio-grid"
          >
            <AnimatePresence>
              {filteredGalleryItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  layout
                  className="portfolio-item"
                  onClick={() => openGalleryDetails(item)}
                >
                  <div className="portfolio-image">
                    <img src={item.image} alt={item.title} />
                    <div className="portfolio-overlay">
                      <span className="view-project">View Gallery</span>
                    </div>
                  </div>
                  <div className="portfolio-info">
                    <span className="portfolio-category">{item.category}</span>
                    <h3 className="portfolio-title">{item.title}</h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Gallery Details Modal */}
      {selectedProject && (
        <div className="project-modal" onClick={closeGalleryDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeGalleryDetails}>×</button>
            <div className="modal-image">
              <img src={selectedProject.image} alt={selectedProject.title} />
            </div>
            <div className="modal-details">
              <h2 className="modal-title">{selectedProject.title}</h2>
              <p className="modal-description">{selectedProject.description}</p>
              <div className="project-meta">
                <div className="meta-item">
                  <span className="meta-label">Location:</span>
                  <span className="meta-value">{selectedProject.location}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Type:</span>
                  <span className="meta-value">{selectedProject.date}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Category:</span>
                  <span className="meta-value">{selectedProject.category}</span>
                </div>
              </div>
              <div className="project-tags">
                {selectedProject.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
