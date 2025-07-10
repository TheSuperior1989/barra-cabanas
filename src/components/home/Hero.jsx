import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import './Hero.css';

const Hero = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoCanPlay, setVideoCanPlay] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile for performance optimization
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Lazy load video after component mounts
  useEffect(() => {
    if (!isMobile) {
      const timer = setTimeout(() => {
        setVideoLoaded(true);
      }, 500); // Small delay to ensure smooth initial render

      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  const handleVideoCanPlay = () => {
    setVideoCanPlay(true);
  };

  return (
    <section className="hero">
      {/* Video Background - Only on desktop for performance */}
      {!isMobile && videoLoaded && (
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={handleVideoCanPlay}
          style={{ opacity: videoCanPlay ? 1 : 0 }}
        >
          <source
            src="https://videos.pexels.com/video-files/1093662/1093662-hd_1920_1080_30fps.mp4"
            type="video/mp4"
          />
          {/* Fallback for browsers that don't support the video */}
        </video>
      )}

      {/* Overlay for better text readability */}
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-text"
        >
          <h1 className="hero-title">
            Experience Luxury <span className="highlight">Beach House Living</span>
          </h1>
          <p className="hero-subtitle">
            Discover exceptional comfort and breathtaking ocean views at Barra Cabanas, Mozambique's premier luxury beach house accommodation.
          </p>
          <div className="hero-buttons">
            <Link to="/services" className="btn btn-primary">
              View Our Properties
            </Link>
            <Link to="/booking" className="btn btn-secondary">
              Book Now
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
