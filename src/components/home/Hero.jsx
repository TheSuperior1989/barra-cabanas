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
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  // Video playlist - multiple vacation scenes optimized for luxury hospitality
  const videoPlaylist = [
    {
      src: "/videos/1093662-hd_1920_1080_30fps.mp4",
      title: "Pristine Ocean Waves"
    },
    {
      src: "/videos/14048763_1920_1080_60fps.mp4",
      title: "Rocky Coast"
    },
    {
      src: "/videos/3115506-uhd_2560_1440_24fps.mp4",
      title: "Waves Crashing Beachfront"
    },
    {
      src: "/videos/6473319-uhd_2560_1440_25fps.mp4",
      title: "Coconut Beach Relaxation"
    },
    {
      src: "/videos/6577987-uhd_2732_1318_30fps.mp4",
      title: "Beach Paradise"
    },
    {
      src: "/videos/9617320-hd_1282_720_30fps.mp4",
      title: "Child Running on Beach"
    }
  ];

  // Check if device is mobile for performance optimization
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Smooth video playlist management with fade transitions
  useEffect(() => {
    if (!isMobile && videoRef.current && videoLoaded) {
      const video = videoRef.current;

      const handleVideoEnd = () => {
        console.log('Video ended, starting fade transition...');
        setIsTransitioning(true);

        // Fade out current video
        setTimeout(() => {
          const nextIndex = (currentVideoIndex + 1) % videoPlaylist.length;
          console.log('Switching from', currentVideoIndex, 'to', nextIndex);

          // Update video source
          video.src = videoPlaylist[nextIndex].src;
          video.load();

          // Play new video and fade in
          const playAndFadeIn = () => {
            video.play().catch(console.log);
            setTimeout(() => {
              setIsTransitioning(false);
            }, 100); // Quick fade in
            video.removeEventListener('canplay', playAndFadeIn);
          };

          video.addEventListener('canplay', playAndFadeIn);
          setCurrentVideoIndex(nextIndex);
        }, 800); // Fade out duration
      };

      video.addEventListener('ended', handleVideoEnd);
      return () => video.removeEventListener('ended', handleVideoEnd);
    }
  }, [isMobile, videoLoaded, currentVideoIndex, videoPlaylist]);

  // Load initial video only
  useEffect(() => {
    if (!isMobile && videoRef.current && videoLoaded && currentVideoIndex === 0) {
      const video = videoRef.current;
      console.log('Loading initial video:', videoPlaylist[0].src);

      video.src = videoPlaylist[0].src;
      video.load();

      const playWhenReady = () => {
        console.log('Initial video ready, playing...');
        video.play().catch(console.log);
        setVideoCanPlay(true);
        video.removeEventListener('canplay', playWhenReady);
      };

      video.addEventListener('canplay', playWhenReady);

      return () => {
        video.removeEventListener('canplay', playWhenReady);
      };
    }
  }, [isMobile, videoLoaded, videoPlaylist]);

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

  // Load audio independently with higher volume
  useEffect(() => {
    if (!isMobile && audioRef.current) {
      audioRef.current.volume = 0.6; // Set volume to 60% (increased from 30%)
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
          playsInline
          preload="metadata"
          onCanPlay={handleVideoCanPlay}
          style={{
            opacity: videoCanPlay && !isTransitioning ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out'
          }}
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
