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
    name: 'Sarah & Michael Thompson',
    position: 'Anniversary Celebration',
    content: 'Our stay at Barra Cabanas was absolutely magical. The Ocean Pearl villa exceeded every expectation with its stunning views and luxurious amenities. The private chef service made our anniversary unforgettable. We cannot wait to return!'
  },
  {
    id: 2,
    name: 'The Rodriguez Family',
    position: 'Family Holiday',
    content: 'Coral Breeze was the perfect family retreat. The kids loved the private beach access while we enjoyed the peaceful garden and exceptional concierge service. Every detail was thoughtfully arranged for our comfort and enjoyment.'
  },
  {
    id: 3,
    name: 'James & Emma Wilson',
    position: 'Romantic Getaway',
    content: 'Sunset Cove provided the most romantic setting imaginable. Watching the sunset from our private deck with champagne was pure bliss. The wellness treatments and personalized service made this the perfect escape from city life.'
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
          <h2 className="section-title">Guest Testimonials</h2>
          <p className="section-subtitle">
            Don't just take our word for it. Here's what our guests have to say about their luxury beach house experience.
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
