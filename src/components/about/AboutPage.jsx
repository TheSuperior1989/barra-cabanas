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
            className="about-content"
          >
            <motion.div className="about-text" variants={itemVariants}>
              <h2 className="section-title">Our Story</h2>
              <p>
                Barra Cabanas was born from a deep love for the Mozambican coastline and a dream to share its magic with the world. Founded by Jaco Ligthelm and his partner Mariska van der Merwe, our journey began as a passion project — a way to blend luxury, nature, and authentic Mozambican charm into one unforgettable destination.
              </p>
              <p>
                From humble beginnings, we've grown into a collection of exclusive beachfront homes nestled along the golden shores of Barra, a tropical paradise just outside Inhambane. Each cabana is designed to reflect the spirit of the ocean — tranquil, refined, and in harmony with its surroundings.
              </p>
              <p>
                We believe true luxury lies in simplicity, serenity, and a deep connection with nature. Whether you're here for romance, adventure, or pure relaxation, Barra Cabanas offers a sanctuary where you can unwind in style and reconnect with what matters most.
              </p>
            </motion.div>
            <motion.div className="about-image" variants={itemVariants}>
              <img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop" alt="Luxury Beach Resort in Mozambique" />
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
                To provide world-class beachfront accommodation that celebrates Mozambique's natural beauty, promotes local culture, and delivers personalized, unforgettable guest experiences.
              </p>
            </div>
            <div className="mission-box">
              <h3>Our Vision</h3>
              <p>
                To be Mozambique's leading luxury beach house destination, known for excellence, sustainability, and heartfelt hospitality.
              </p>
            </div>
            <div className="mission-box">
              <h3>Our Values</h3>
              <ul>
                <li>Authenticity – Honoring local culture and environment</li>
                <li>Excellence – Attention to every detail</li>
                <li>Sustainability – Protecting what makes Barra special</li>
                <li>Warmth – Genuine, personalized hospitality</li>
                <li>Elegance – Understated, timeless design</li>
              </ul>
            </div>
          </div>
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
              <h3 className="member-name">Mariska van der Merwe</h3>
              <p className="member-position">Co-Founder & Creative Director</p>
              <p className="member-bio">
                Mariska brings a refined design sensibility to Barra Cabanas, blending local textures and modern comfort to create interiors that are both luxurious and welcoming.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
