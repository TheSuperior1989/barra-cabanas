import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './FeaturedProjects.css';

// Sample projects data (in a real app, this would come from an API or CMS)
const projects = [
  {
    id: 1,
    title: 'CNC Mill Conversion',
    category: 'Engineering',
    image: 'https://www.zintilon.com/wp-content/webp-express/webp-images/uploads/2023/11/Large-finely-toothed-metal-gear-positioned-on-a-CNC-machine-bed-with-blue-coolant-tubes-nearby.jpg.webp',
    description: 'Conversion of a traditional mill to a fully automated CNC system with custom software integration.',
    link: '/portfolio/cnc-mill-conversion'
  },
  {
    id: 2,
    title: 'E-Commerce Website',
    category: 'Web Development',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    description: 'Custom e-commerce platform with integrated payment processing and inventory management.',
    link: '/portfolio/ecommerce-website'
  },
  {
    id: 3,
    title: 'Brand Identity Design',
    category: 'Graphic Design',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
    description: 'Complete brand identity package including logo, color palette, typography, and brand guidelines.',
    link: '/portfolio/brand-identity'
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
    <section className="featured-projects" id="projects">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">
            Take a look at some of our recent work that showcases our expertise and creativity.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="projects-grid"
        >
          {projects.map((project) => (
            <motion.div key={project.id} className="project-card" variants={itemVariants}>
              <div className="project-image">
                <img src={project.image} alt={project.title} />
                <div className="project-overlay">
                  <Link to={project.link} className="project-link">
                    View Project
                  </Link>
                </div>
              </div>
              <div className="project-content">
                <span className="project-category">{project.category}</span>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="projects-cta">
          <Link to="/portfolio" className="btn btn-primary">
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
