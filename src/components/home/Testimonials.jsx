import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './Testimonials.css';

// Sample testimonials data (in a real app, this would come from an API or CMS)
const testimonials = [
  {
    id: 1,
    name: 'Pieter van der Merwe',
    position: 'CEO, TechInnovate',
    content: 'SkillAxis Dynamics transformed our outdated manufacturing process with their CNC conversion services. The precision and efficiency gains have been remarkable, and their ongoing support is exceptional.'
  },
  {
    id: 2,
    name: 'Nomsa Mthembu',
    position: 'Marketing Director, BrandForward',
    content: 'The website and branding package delivered by SkillAxis exceeded our expectations. Their team took the time to understand our vision and translated it into a stunning digital presence that has significantly increased our conversions.'
  },
  {
    id: 3,
    name: 'Johan Botha',
    position: 'Founder, InnovateMech',
    content: 'Working with SkillAxis on our custom software development project was a seamless experience. Their technical expertise combined with creative problem-solving resulted in an application that has streamlined our operations.'
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Auto-scroll testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8
      }
    }
  };

  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Client Testimonials</h2>
          <p className="section-subtitle">
            Don't just take our word for it. Here's what our clients have to say about working with us.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="testimonials-slider"
        >
          <div className="testimonial-card">
            <div className="quote-icon">
              <FontAwesomeIcon icon={faQuoteLeft} />
            </div>
            <p className="testimonial-content">{testimonials[currentIndex].content}</p>
            <div className="testimonial-author">
              <div className="author-info">
                <h4 className="author-name">{testimonials[currentIndex].name}</h4>
                <p className="author-position">{testimonials[currentIndex].position}</p>
              </div>
            </div>
          </div>

          <div className="testimonial-controls">
            <button className="control-btn prev" onClick={handlePrev}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                ></span>
              ))}
            </div>
            <button className="control-btn next" onClick={handleNext}>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
