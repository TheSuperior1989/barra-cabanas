import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft, faChevronLeft, faChevronRight, faStar } from '@fortawesome/free-solid-svg-icons';
import './Testimonials.css';

const testimonials = [
  {
    id: 1,
    name: 'Charlotte & Alexander Pemberton',
    position: 'London, UK',
    occasion: 'Honeymoon Suite - 7 nights',
    rating: 5,
    content: 'Barra Cabanas exceeded every expectation for our honeymoon. The Honeymoon Suite was pure luxury - from the private infinity pool overlooking the Indian Ocean to the 24/7 butler service. The sunset dhow cruise and couples spa treatments were absolutely divine. This is paradise redefined.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 2,
    name: 'The Johannesburg Executive Family',
    position: 'Johannesburg, South Africa',
    occasion: 'Luxury Family Cabana - 10 nights',
    rating: 5,
    content: 'Our family of five had the most incredible holiday at Barra Cabanas. The Luxury Family Cabana was spacious and elegant, with direct beach access that the children adored. The private chef prepared exquisite meals daily, and the kids club activities were world-class. We felt like royalty throughout our stay.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 3,
    name: 'Dr. Marcus & Isabella Hartmann',
    position: 'Munich, Germany',
    occasion: 'Seaview Cabana - 14 nights',
    rating: 5,
    content: 'After years of luxury travel worldwide, Barra Cabanas stands in a league of its own. The Seaview Cabana offered unparalleled ocean vistas, and the attention to detail was extraordinary. From the daily housekeeping to the personalized excursions, every moment was crafted to perfection. We have already booked our return.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 4,
    name: 'Victoria & James Ashworth',
    position: 'Sydney, Australia',
    occasion: 'Ocean Breeze Bungalow - 5 nights',
    rating: 5,
    content: 'The Ocean Breeze Bungalow was our sanctuary for a much-needed escape. Waking up to the sound of waves and enjoying breakfast on our private deck was magical. The spa services were world-class, and the staff anticipated our every need. Barra Cabanas has set a new standard for luxury hospitality.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 5,
    name: 'Ambassador Richard & Lady Catherine Montague',
    position: 'Cape Town, South Africa',
    occasion: 'Presidential Villa - 21 nights',
    rating: 5,
    content: 'Having stayed at the finest resorts across six continents, I can confidently say Barra Cabanas offers an unmatched level of luxury and service. The Presidential Villa was magnificent, with its private beach section and dedicated staff. The culinary experiences were Michelin-worthy, and the privacy was absolute. Simply extraordinary.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
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
    }, 8000);

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
          <h2 className="section-title">Luxury Guest Experiences</h2>
          <p className="section-subtitle">
            Discover why discerning travelers from around the world choose Barra Cabanas for their most memorable luxury escapes.
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
            <div className="testimonial-header">
              <div className="quote-icon">
                <FontAwesomeIcon icon={faQuoteLeft} />
              </div>
              <div className="rating">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <FontAwesomeIcon key={i} icon={faStar} className="star" />
                ))}
              </div>
            </div>

            <p className="testimonial-content">{testimonials[currentIndex].content}</p>

            <div className="testimonial-author">
              <div className="author-image">
                <img src={testimonials[currentIndex].image} alt={testimonials[currentIndex].name} />
              </div>
              <div className="author-info">
                <h4 className="author-name">{testimonials[currentIndex].name}</h4>
                <p className="author-position">{testimonials[currentIndex].position}</p>
                <p className="author-occasion">{testimonials[currentIndex].occasion}</p>
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
