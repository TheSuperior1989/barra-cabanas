import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './PortfolioPage.css';

// Sample projects data (in a real app, this would come from an API or CMS)
const projects = [
  {
    id: 1,
    title: 'CNC Mill Conversion',
    category: 'Engineering',
    image: 'https://www.zintilon.com/wp-content/webp-express/webp-images/uploads/2023/11/Large-finely-toothed-metal-gear-positioned-on-a-CNC-machine-bed-with-blue-coolant-tubes-nearby.jpg.webp',
    description: 'Conversion of a traditional mill to a fully automated CNC system with custom software integration.',
    client: 'Industrial Innovations Inc.',
    date: 'January 2023',
    tags: ['CNC', 'Automation', 'Manufacturing']
  },
  {
    id: 2,
    title: 'E-Commerce Website',
    category: 'Web Development',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    description: 'Custom e-commerce platform with integrated payment processing and inventory management.',
    client: 'Fashion Forward',
    date: 'March 2023',
    tags: ['Web Development', 'E-commerce', 'UI/UX']
  },
  {
    id: 3,
    title: 'Brand Identity Design',
    category: 'Graphic Design',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
    description: 'Complete brand identity package including logo, color palette, typography, and brand guidelines.',
    client: 'Eco Solutions',
    date: 'April 2023',
    tags: ['Branding', 'Logo Design', 'Visual Identity']
  },
  {
    id: 4,
    title: 'Social Media Campaign',
    category: 'Digital Marketing',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop',
    description: 'Comprehensive social media campaign that increased engagement by 200% and grew the follower base by 150%.',
    client: 'Fitness First',
    date: 'June 2023',
    tags: ['Social Media', 'Content Strategy', 'Analytics']
  },
  {
    id: 5,
    title: 'Mobile App Development',
    category: 'Software Development',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
    description: 'Cross-platform mobile application for tracking fitness goals and nutrition with personalized recommendations.',
    client: 'HealthTrack',
    date: 'August 2023',
    tags: ['Mobile App', 'iOS', 'Android']
  },
  {
    id: 6,
    title: 'Lathe CNC Retrofit',
    category: 'Engineering',
    image: 'https://images.squarespace-cdn.com/content/v1/5b06f171e74940795cd67900/1536354445132-AELTSH293G10TJLI4UUI/Mori%2BSeiki%2BLathe%2BCNC.jpg',
    description: 'Complete retrofit of an industrial lathe with modern CNC controls and custom software.',
    client: 'Precision Machining Co.',
    date: 'October 2023',
    tags: ['CNC', 'Retrofit', 'Industrial']
  }
];

const categories = [
  'All',
  'Engineering',
  'Web Development',
  'Graphic Design',
  'Digital Marketing',
  'Software Development'
];

const PortfolioPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(project => project.category === activeCategory);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const openProjectDetails = (project) => {
    setSelectedProject(project);
  };

  const closeProjectDetails = () => {
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
          <h1 className="portfolio-hero-title">Our Portfolio</h1>
          <p className="portfolio-hero-subtitle">
            Showcasing our best work across various industries
          </p>
        </div>
      </div>

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
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  layout
                  className="portfolio-item"
                  onClick={() => openProjectDetails(project)}
                >
                  <div className="portfolio-image">
                    <img src={project.image} alt={project.title} />
                    <div className="portfolio-overlay">
                      <span className="view-project">View Project</span>
                    </div>
                  </div>
                  <div className="portfolio-info">
                    <span className="portfolio-category">{project.category}</span>
                    <h3 className="portfolio-title">{project.title}</h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="project-modal" onClick={closeProjectDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeProjectDetails}>×</button>
            <div className="modal-image">
              <img src={selectedProject.image} alt={selectedProject.title} />
            </div>
            <div className="modal-details">
              <h2 className="modal-title">{selectedProject.title}</h2>
              <p className="modal-description">{selectedProject.description}</p>
              <div className="project-meta">
                <div className="meta-item">
                  <span className="meta-label">Client:</span>
                  <span className="meta-value">{selectedProject.client}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Date:</span>
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
