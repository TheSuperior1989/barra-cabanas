import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserTie } from '@fortawesome/free-solid-svg-icons';
import './AboutPage.css';

const AboutPage = () => {
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
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="container">
          <h1 className="about-hero-title">About SkillAxis Dynamics</h1>
          <p className="about-hero-subtitle">
            Blending engineering precision with creative digital solutions
          </p>
        </div>
      </div>

      <section className="about-story">
        <div className="container">
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="about-content"
          >
            <motion.div className="about-text" variants={itemVariants}>
              <h2 className="section-title">Our Story</h2>
              <p>
                SkillAxis Dynamics began as a broad engineering and design service provider, leveraging our founder's expertise in mechanical engineering and digital technology. Over the years, we've evolved to focus on high-value offerings that combine technical precision with creative innovation.
              </p>
              <p>
                Our journey has been defined by a commitment to excellence, continuous learning, and adapting to the ever-changing technological landscape. Today, we pride ourselves on delivering solutions that not only meet but exceed our clients' expectations.
              </p>
              <p>
                What sets us apart is our unique ability to bridge the gap between traditional engineering and modern digital solutions. Whether we're converting a mill to CNC or developing a cutting-edge website, we bring the same level of precision, creativity, and attention to detail to every project.
              </p>
            </motion.div>
            <motion.div className="about-image" variants={itemVariants}>
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop" alt="Modern Technology Workspace" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="about-mission">
        <div className="container">
          <div className="mission-content">
            <div className="mission-box">
              <h3>Our Mission</h3>
              <p>
                To deliver innovative, high-quality solutions that empower our clients to succeed in an increasingly digital world, by combining technical expertise with creative thinking.
              </p>
            </div>
            <div className="mission-box">
              <h3>Our Vision</h3>
              <p>
                To be the premier provider of integrated engineering and digital services, known for excellence, innovation, and client satisfaction.
              </p>
            </div>
            <div className="mission-box">
              <h3>Our Values</h3>
              <ul>
                <li>Excellence in everything we do</li>
                <li>Innovation that drives results</li>
                <li>Integrity in all our interactions</li>
                <li>Collaboration with clients and partners</li>
                <li>Continuous learning and improvement</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="about-team">
        <div className="container">
          <h2 className="section-title">Our Founders</h2>
          <p className="section-subtitle">
            Meet the visionary founders behind SkillAxis Dynamics
          </p>

          <div className="team-grid">
            <div className="team-member">
              <div className="member-icon">
                <FontAwesomeIcon icon={faUserTie} />
              </div>
              <h3 className="member-name">Christiaan Von Stade</h3>
              <p className="member-position">Founder & CEO</p>
              <p className="member-bio">
                With over 15 years of experience in engineering and digital technology, Christiaan leads our team with vision and expertise.
              </p>
            </div>

            <div className="team-member">
              <div className="member-icon">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <h3 className="member-name">Sure Von Stade</h3>
              <p className="member-position">Co-Founder & Creative Director</p>
              <p className="member-bio">
                Sure brings creative flair and design expertise to every project, ensuring our solutions are both functional and beautiful.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
