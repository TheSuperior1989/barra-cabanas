import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeXmark, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import './Hero.css';

const Hero = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoCanPlay, setVideoCanPlay] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  // Check if device is mobile for performance optimization
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load video after component mounts
  useEffect(() => {
    if (!isMobile) {
      const timer = setTimeout(() => {
        setVideoLoaded(true);
      }, 500); // Small delay for smooth page load

      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  // Load audio
  useEffect(() => {
    if (!isMobile) {
      const timer = setTimeout(() => {
        setAudioLoaded(true);
      }, 1000); // Load audio after video starts

      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  // Independent audio toggle function
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(console.log);
        setIsMuted(false);
      } else {
        audioRef.current.pause();
        setIsMuted(true);
      }
    }
  };

  // Set audio volume when loaded
  useEffect(() => {
    if (!isMobile && audioRef.current) {
      audioRef.current.volume = 0.6; // Set volume to 60%
    }
  }, [isMobile, audioLoaded]);

  // Lazy load video after component mounts
  useEffect(() => {
    if (!isMobile) {
      const timer = setTimeout(() => {
        setVideoLoaded(true);
      }, 500); // Small delay to ensure smooth initial render

      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  // Load audio
  useEffect(() => {
    if (!isMobile) {
      const timer = setTimeout(() => {
        setAudioLoaded(true);
      }, 1000); // Load audio after video starts loading

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
          ref={videoRef}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={handleVideoCanPlay}
          style={{
            opacity: videoCanPlay ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out'
          }}
          src="/videos/Hero_Section_MP4_H.264-ACC.mp4"
        >
          {/* Fallback for browsers that don't support the video */}
        </video>
      )}

      {/* 432Hz Audio Background - Only on desktop */}
      {!isMobile && audioLoaded && (
        <audio
          ref={audioRef}
          loop
          preload="metadata"
          style={{ display: 'none' }}
        >
          <source
            src="/audio/432hz-ambient-ocean.mp3"
            type="audio/mpeg"
          />
        </audio>
      )}

      {/* Audio Control Button - Left side of hero */}
      {!isMobile && audioLoaded && (
        <button
          onClick={toggleAudio}
          className="audio-toggle-btn"
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        >
          <FontAwesomeIcon icon={isMuted ? faVolumeXmark : faVolumeHigh} />
        </button>
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
            Experience Luxury <span className="highlight sage-green">Beach House Living</span>
          </h1>
          <p className="hero-subtitle">
            Experience barefoot luxury at its finest. Nestled on the pristine shores of Mozambique, Barra Cabanas offers exclusive beachside living with panoramic ocean views, elegant design, and unmatched comfort — your ultimate tropical escape awaits.
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
