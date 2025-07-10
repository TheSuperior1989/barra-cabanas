import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope, faClock } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { sendContactForm } from '../../services/emailService';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    service: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const result = await sendContactForm(formData);

      if (result.success) {
        setFormSubmitted(true);
        setSubmitMessage(result.message);
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          service: ''
        });
      } else {
        setSubmitMessage(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage('Failed to send message. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="contact-page">
      <div className="contact-hero">
        <div className="contact-hero-overlay"></div>
        <div className="container">
          <h1 className="contact-hero-title">Contact Us</h1>
          <p className="contact-hero-subtitle">
            Get in touch with our team to discuss your project
          </p>
        </div>
      </div>

      <section className="contact-info">
        <div className="container">
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="info-grid"
          >
            <motion.div className="info-card" variants={itemVariants}>
              <div className="info-icon">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </div>
              <h3>Our Location</h3>
              <p>South Africa</p>
              <p>Pretoria</p>
            </motion.div>

            <motion.div className="info-card" variants={itemVariants}>
              <div className="info-icon">
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <h3>Phone Number</h3>
              <p><a href="tel:+27782964786">+27 78 296 4786</a></p>
              <p><a href="tel:+27824651089">+27 82 465 1089</a></p>
            </motion.div>

            <motion.div className="info-card" variants={itemVariants}>
              <div className="info-icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <h3>Email Address</h3>
              <p><a href="mailto:info@skillaxisdynamics.co.za">info@skillaxisdynamics.co.za</a></p>
              <p><a href="mailto:support@skillaxisdynamics.co.za">support@skillaxisdynamics.co.za</a></p>
            </motion.div>

            <motion.div className="info-card" variants={itemVariants}>
              <div className="info-icon">
                <FontAwesomeIcon icon={faClock} />
              </div>
              <h3>Working Hours</h3>
              <p>Monday - Friday: 9am - 6pm</p>
              <p>Saturday: 10am - 2pm</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="contact-form-section">
        <div className="container">
          <div className="form-container">
            <div className="form-header">
              <h2>Send Us a Message</h2>
              <p>
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>

            {formSubmitted ? (
              <div className="form-success">
                <h3>Thank You!</h3>
                <p>Your message has been sent successfully. We'll get back to you shortly.</p>
                <button className="btn btn-primary" onClick={() => setFormSubmitted(false)}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="service">Service of Interest</label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                  >
                    <option value="">Select a Service</option>
                    <option value="cnc">Mill & Lathe CNC Conversions</option>
                    <option value="design">Creative Design & Visualization</option>
                    <option value="web">Website Development</option>
                    <option value="graphic">Graphic Design & Branding</option>
                    <option value="social">Social Media Marketing</option>
                    <option value="software">Software Development</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                {submitMessage && !formSubmitted && (
                  <div className={`form-message ${submitMessage.includes('Failed') ? 'error' : 'success'}`}>
                    {submitMessage}
                  </div>
                )}

                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>


    </div>
  );
};

export default ContactPage;
