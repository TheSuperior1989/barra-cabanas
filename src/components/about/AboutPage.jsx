import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserTie, faGlobe, faEye, faHeart } from '@fortawesome/free-solid-svg-icons';
import './AboutPage.css';

// Word Carousel Component
const WordCarousel = ({ title, words, icon }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [words]);

  return (
    <motion.div className="word-carousel-card" variants={{
      hidden: { y: 50, opacity: 0 },
      visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
    }}>
      <div className="carousel-icon">
        <FontAwesomeIcon icon={icon} />
      </div>
      <h3 className="carousel-title">{title}</h3>
      <div className="animated-word-container">
        <motion.p
          key={index}
          className="animated-word"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {words[index]}
        </motion.p>
      </div>
    </motion.div>
  );
};

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
          <h1 className="about-hero-title">About Barra Cabanas</h1>
          <p className="about-hero-subtitle">
            Where barefoot luxury meets the untouched beauty of Mozambique
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
            className="story-wrapper"
          >
            {/* Story Header */}
            <motion.div className="story-header" variants={itemVariants}>
              <h2 className="story-title">Our Story</h2>
              <div className="story-subtitle">Where Dreams Meet the Ocean</div>
            </motion.div>

            {/* Story Timeline */}
            <div className="story-timeline">
              <motion.div className="timeline-item" variants={itemVariants}>
                <div className="timeline-marker">
                  <div className="timeline-dot"></div>
                </div>
                <div className="timeline-content">
                  <h3 className="timeline-title">The Beginning</h3>
                  <p className="timeline-text">
                    Barra Cabanas was born from a deep love for the Mozambican coastline and a dream to share its magic with the world. Founded by Jaco Ligthelm and his partner Dirk Ligthelm, our journey began as a passion project — a way to blend luxury, nature, and authentic Mozambican charm into one unforgettable destination.
                  </p>
                </div>
              </motion.div>

              <motion.div className="timeline-item" variants={itemVariants}>
                <div className="timeline-marker">
                  <div className="timeline-dot"></div>
                </div>
                <div className="timeline-content">
                  <h3 className="timeline-title">The Vision</h3>
                  <p className="timeline-text">
                    From humble beginnings, we've grown into a collection of exclusive beachfront homes nestled along the golden shores of Barra, a tropical paradise just outside Inhambane. Each cabana is designed to reflect the spirit of the ocean — tranquil, refined, and in harmony with its surroundings.
                  </p>
                </div>
              </motion.div>

              <motion.div className="timeline-item" variants={itemVariants}>
                <div className="timeline-marker">
                  <div className="timeline-dot"></div>
                </div>
                <div className="timeline-content">
                  <h3 className="timeline-title">Today</h3>
                  <p className="timeline-text">
                    We believe true luxury lies in simplicity, serenity, and a deep connection with nature. Whether you're here for romance, adventure, or pure relaxation, Barra Cabanas offers a sanctuary where you can unwind in style and reconnect with what matters most.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Story Image Gallery */}
            <motion.div className="story-gallery" variants={itemVariants}>
              <div className="gallery-grid">
                <div className="gallery-item gallery-large">
                  <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop" alt="Barra Cabanas Luxury Villa" />
                  <div className="gallery-overlay">
                    <span className="gallery-caption">Luxury Beachfront Villas</span>
                  </div>
                </div>
                <div className="gallery-item">
                  <img src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=300&h=300&fit=crop" alt="Mozambique Coastline" />
                  <div className="gallery-overlay">
                    <span className="gallery-caption">Pristine Coastline</span>
                  </div>
                </div>
                <div className="gallery-item">
                  <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=300&h=300&fit=crop" alt="Local Culture" />
                  <div className="gallery-overlay">
                    <span className="gallery-caption">Local Heritage</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="about-mission">
        <div className="container">
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
            }}
            initial="hidden"
            animate="visible"
            className="word-carousel-grid"
          >
            <WordCarousel
              title="Our Mission"
              words={["Celebrate", "Promote", "Deliver"]}
              icon={faGlobe}
            />

            <WordCarousel
              title="Our Vision"
              words={["Excellence", "Luxury", "Sustainability"]}
              icon={faEye}
            />

            <WordCarousel
              title="Our Values"
              words={["Authenticity", "Warmth", "Elegance", "Excellence", "Sustainability"]}
              icon={faHeart}
            />
          </motion.div>
        </div>
      </section>

      <section className="about-team">
        <div className="container">
          <h2 className="section-title">Our Founders</h2>
          <p className="section-subtitle">
            Meet the visionaries behind the dream
          </p>

          <div className="team-grid">
            <div className="team-member">
              <div className="member-icon">
                <FontAwesomeIcon icon={faUserTie} />
              </div>
              <h3 className="member-name">Jaco Ligthelm</h3>
              <p className="member-position">Founder & Managing Director</p>
              <p className="member-bio">
                Jaco's love for Mozambique, paired with his dedication to hospitality, drives the spirit of Barra Cabanas. His focus on guest satisfaction and community upliftment sets the tone for every experience we offer.
              </p>
            </div>

            <div className="team-member">
              <div className="member-icon">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <h3 className="member-name">Dirk Ligthelm</h3>
              <p className="member-position">Co-Founder & Operations Director</p>
              <p className="member-bio">
                Dirk brings extensive operational expertise to Barra Cabanas, ensuring seamless guest experiences through meticulous attention to detail and innovative hospitality solutions that exceed expectations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
