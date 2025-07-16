import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './FeaturedProjects.css';

// Sample beach houses data (Await Liggies for real data)
const houses = [
  {
    id: 1,
    title: 'The Ocean Pearl',
    category: 'Luxury Villa',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop',
    description: 'A modern coastal escape with floor-to-ceiling sea views, an infinity pool, and private beach access.',
    link: '/houses/ocean-pearl'
  },
  {
    id: 2,
    title: 'Coral Breeze',
    category: 'Family Beach House',
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&h=400&fit=crop',
    description: 'Spacious and serene, perfect for families, featuring multiple bedrooms, outdoor dining, and a private garden with sea breeze views.',
    link: '/houses/coral-breeze'
  },
  {
    id: 3,
    title: 'Sunset Cove',
    category: 'Romantic Retreat',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop',
    description: 'An intimate hideaway ideal for couples, with a private jacuzzi, open-plan living, and breathtaking sunset views from the deck.',
    link: '/houses/sunset-cove'
  }
];

const FeaturedProjects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className="featured-projects" id="houses">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Featured Houses</h2>
          <p className="section-subtitle">
            Discover a selection of our most stunning beachfront accommodations — each uniquely styled for unforgettable stays.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="projects-grid"
        >
          {houses.map((house) => (
            <motion.div key={house.id} className="project-card" variants={itemVariants}>
              <div className="project-image">
                <img src={house.image} alt={house.title} />
                <div className="project-overlay">
                  <Link to={house.link} className="project-link">
                    View House
                  </Link>
                </div>
              </div>
              <div className="project-content">
                <span className="project-category">{house.category}</span>
                <h3 className="project-title">{house.title}</h3>
                <p className="project-description">{house.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="projects-cta">
          <Link to="/services" className="btn btn-primary">
            View All Houses
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
