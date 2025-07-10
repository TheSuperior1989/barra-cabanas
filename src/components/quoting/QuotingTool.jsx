import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTrash, faFileInvoice, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { sendQuoteRequest } from '../../services/emailService';
import './QuotingTool.css';
import pricingData from '../../assets/data/services-pricing.json';

const QuotingTool = () => {
  const [activeCategory, setActiveCategory] = useState('graphicDesign');
  const [selectedServices, setSelectedServices] = useState([]);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [showContactForm, setShowContactForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const categories = [
    { id: 'graphicDesign', name: 'Graphic Design' },
    { id: 'webDevelopment', name: 'Web Development' },
    { id: 'cncConversion', name: 'CNC Conversion' },
    { id: 'digitalMarketing', name: 'Digital Marketing' },
    { id: 'softwareDevelopment', name: 'Software Development' },
    { id: 'creativeDesign', name: 'Creative Design' }
  ];

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleServiceSelect = (service) => {
    // Check if service is already selected
    const existingService = selectedServices.find(s => s.id === service.id);

    if (existingService) {
      // If already selected, increment quantity
      setSelectedServices(
        selectedServices.map(s =>
          s.id === service.id
            ? { ...s, quantity: s.quantity + 1 }
            : s
        )
      );
    } else {
      // If not selected, add to selected services with quantity 1
      setSelectedServices([
        ...selectedServices,
        { ...service, quantity: 1, category: activeCategory }
      ]);
    }

    // On mobile, scroll to quote summary after adding service
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        const quoteSummary = document.querySelector('.quote-summary');
        if (quoteSummary) {
          quoteSummary.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
  };

  const handleQuantityChange = (serviceId, change) => {
    setSelectedServices(
      selectedServices.map(service => {
        if (service.id === serviceId) {
          const newQuantity = service.quantity + change;
          return newQuantity > 0 
            ? { ...service, quantity: newQuantity }
            : service;
        }
        return service;
      })
    );
  };

  const handleRemoveService = (serviceId) => {
    setSelectedServices(selectedServices.filter(service => service.id !== serviceId));
  };

  const handleContactInfoChange = (e) => {
    const { name, value } = e.target;
    setContactInfo({
      ...contactInfo,
      [name]: value
    });
  };

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const result = await sendQuoteRequest(selectedServices, contactInfo);

      if (result.success) {
        setFormSubmitted(true);
        setSubmitMessage(result.message);

        // Reset form after successful submission
        setTimeout(() => {
          setFormSubmitted(false);
          setShowContactForm(false);
          setContactInfo({
            name: '',
            email: '',
            phone: '',
            company: '',
            message: ''
          });
          setSubmitMessage('');
        }, 3000);
      } else {
        setSubmitMessage(result.message);
      }
    } catch (error) {
      console.error('Error submitting quote:', error);
      setSubmitMessage('Failed to send quote request. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    return selectedServices.reduce((total, service) => {
      if (service.price) {
        return total + (service.price * service.quantity);
      } else if (service.priceRange) {
        if (service.priceRange[1] === null) {
          // For open-ended ranges, use the minimum price
          return total + (service.priceRange[0] * service.quantity);
        }
        // For price ranges, use the average
        const avgPrice = (service.priceRange[0] + service.priceRange[1]) / 2;
        return total + (avgPrice * service.quantity);
      }
      return total;
    }, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getServicePriceDisplay = (service) => {
    if (service.price) {
      let priceDisplay = formatPrice(service.price);
      if (service.priceType) {
        priceDisplay += ` ${service.priceType}`;
      }
      return priceDisplay;
    } else if (service.priceRange) {
      if (service.priceRange[1] === null) {
        return `${formatPrice(service.priceRange[0])}+`;
      }
      return `${formatPrice(service.priceRange[0])} - ${formatPrice(service.priceRange[1])}`;
    }
    return 'Contact for pricing';
  };

  const getServiceTotalDisplay = (service) => {
    if (service.price) {
      return formatPrice(service.price * service.quantity);
    } else if (service.priceRange) {
      if (service.priceRange[1] === null) {
        return `${formatPrice(service.priceRange[0] * service.quantity)}+`;
      }
      const avgPrice = (service.priceRange[0] + service.priceRange[1]) / 2;
      return formatPrice(avgPrice * service.quantity);
    }
    return 'Contact for pricing';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="quoting-tool">
      <div className="quoting-container">
        <div className="quoting-header">
          <h2>Service Quoting Tool</h2>
          <p>Select services to build your custom quote</p>
        </div>

        <div className="quoting-content">
          <div className="service-selection">
            <div className="category-tabs">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="service-list">
              <h3>{pricingData[activeCategory].name}</h3>
              {pricingData[activeCategory].description && (
                <p className="category-description">{pricingData[activeCategory].description}</p>
              )}

              {pricingData[activeCategory].categories.map((category, index) => (
                <motion.div
                  key={index}
                  className="service-category"
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  <h4>{category.name}</h4>
                  <p className="category-description">{category.description}</p>

                  <div className="services-grid">
                    {category.services.map((service) => (
                      <motion.div
                        key={service.id}
                        className={`service-card ${service.popular ? 'popular' : ''}`}
                        variants={itemVariants}
                        whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }}
                      >
                        <div className="service-info">
                          <h5>{service.name}</h5>
                          <p>{service.description}</p>
                          <div className="service-price">{getServicePriceDisplay(service)}</div>
                        </div>
                        <button
                          className="add-service-btn"
                          onClick={() => handleServiceSelect(service)}
                        >
                          Add to Quote
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="quote-summary">
            <div className="summary-header">
              <h3>Your Quote Summary</h3>
              {selectedServices.length > 0 && (
                <div className="summary-actions">
                  <button
                    className="request-quote-btn"
                    onClick={() => setShowContactForm(true)}
                  >
                    <FontAwesomeIcon icon={faFileInvoice} /> Request Detailed Quote
                  </button>
                </div>
              )}
            </div>

            {selectedServices.length === 0 ? (
              <div className="empty-quote">
                <p>Your quote is empty. Select services to get started.</p>
              </div>
            ) : (
              <div className="selected-services">
                {selectedServices.map((service) => (
                  <div key={service.id} className="selected-service-item">
                    <div className="service-details">
                      <h4>{service.name}</h4>
                      <p className="service-category-label">
                        {pricingData[service.category].name}
                      </p>
                    </div>
                    <div className="service-actions">
                      <div className="quantity-control">
                        <button
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(service.id, -1)}
                          disabled={service.quantity <= 1}
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <span className="quantity">{service.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(service.id, 1)}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </div>
                      <div className="service-price">
                        {getServiceTotalDisplay(service)}
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveService(service.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="quote-total">
                  <div className="total-label">Estimated Total:</div>
                  <div className="total-amount">{formatPrice(calculateTotal())}</div>
                </div>

                <div className="quote-disclaimer">
                  <p>
                    * This is an estimated quote. Final pricing may vary based on project specifics.
                    Request a detailed quote for a more accurate estimate.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showContactForm && (
        <div className="quote-form-overlay">
          <div className="quote-form-container">
            <button
              className="close-form-btn"
              onClick={() => setShowContactForm(false)}
            >
              ×
            </button>

            {formSubmitted ? (
              <div className="form-success">
                <h3>Thank You!</h3>
                <p>
                  Your quote request has been submitted successfully. We'll get back to you shortly
                  with a detailed quote.
                </p>
              </div>
            ) : (
              <form className="quote-form" onSubmit={handleSubmitQuote}>
                <h3>Request Detailed Quote</h3>
                <p>
                  Please provide your contact information and we'll send you a detailed quote for the
                  selected services.
                </p>

                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={contactInfo.name}
                    onChange={handleContactInfoChange}
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
                      value={contactInfo.email}
                      onChange={handleContactInfoChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={contactInfo.phone}
                      onChange={handleContactInfoChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="company">Company Name</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={contactInfo.company}
                    onChange={handleContactInfoChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Additional Information</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={contactInfo.message}
                    onChange={handleContactInfoChange}
                    placeholder="Please provide any additional details about your project requirements."
                  ></textarea>
                </div>

                <div className="quote-summary-preview">
                  <h4>Quote Summary</h4>
                  <div className="summary-items">
                    {selectedServices.map((service) => (
                      <div key={service.id} className="summary-item">
                        <span className="item-name">
                          {service.name} × {service.quantity}
                        </span>
                        <span className="item-price">{getServiceTotalDisplay(service)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="summary-total">
                    <span>Estimated Total:</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                </div>

                {submitMessage && !formSubmitted && (
                  <div className={`form-message ${submitMessage.includes('Failed') ? 'error' : 'success'}`}>
                    {submitMessage}
                  </div>
                )}

                <button type="submit" className="submit-quote-btn" disabled={isSubmitting}>
                  <FontAwesomeIcon icon={faEnvelope} />
                  {isSubmitting ? 'Sending...' : 'Submit Quote Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotingTool;
