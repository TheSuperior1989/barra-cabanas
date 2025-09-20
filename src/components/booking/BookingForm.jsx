// Booking form component for customer information
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faMapMarkerAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { submitBooking } from '../../services/bookingService.js';
import './BookingForm.css';

const BookingForm = ({ bookingData, onSuccess, onCancel }) => {
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'South Africa',
    postalCode: '',
    specialRequests: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!customerInfo.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!customerInfo.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      const fullBookingData = {
        ...bookingData,
        ...customerInfo
      };
      
      const result = await submitBooking(fullBookingData);
      
      if (result.success) {
        onSuccess(result);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      alert('Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className="booking-form-modal">
      <div className="booking-form-container">
        <div className="booking-form-header">
          <h2>Complete Your Booking</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        
        <div className="booking-summary-mini">
          <h3>{bookingData.propertyName}</h3>
          <p>{bookingData.checkIn} to {bookingData.checkOut} ({bookingData.nights} nights)</p>
          <p>{bookingData.totalGuests} guests • <strong>R{bookingData.totalAmount}</strong></p>
        </div>
        
        <form onSubmit={handleSubmit} className="customer-form">
          <div className="form-row">
            <div className="form-group">
              <label>
                <FontAwesomeIcon icon={faUser} />
                First Name *
              </label>
              <input
                type="text"
                value={customerInfo.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={errors.firstName ? 'error' : ''}
                disabled={submitting}
              />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>
            
            <div className="form-group">
              <label>
                <FontAwesomeIcon icon={faUser} />
                Last Name *
              </label>
              <input
                type="text"
                value={customerInfo.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={errors.lastName ? 'error' : ''}
                disabled={submitting}
              />
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>
                <FontAwesomeIcon icon={faEnvelope} />
                Email Address *
              </label>
              <input
                type="email"
                value={customerInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'error' : ''}
                disabled={submitting}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label>
                <FontAwesomeIcon icon={faPhone} />
                Phone Number *
              </label>
              <input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={errors.phone ? 'error' : ''}
                disabled={submitting}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label>
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              Address
            </label>
            <input
              type="text"
              value={customerInfo.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              disabled={submitting}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                value={customerInfo.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                disabled={submitting}
              />
            </div>
            
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                value={customerInfo.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                disabled={submitting}
              />
            </div>
            
            <div className="form-group">
              <label>Postal Code</label>
              <input
                type="text"
                value={customerInfo.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                disabled={submitting}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Special Requests</label>
            <textarea
              value={customerInfo.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              rows="3"
              placeholder="Any special requests or requirements..."
              disabled={submitting}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onCancel} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Submitting...
                </>
              ) : (
                'Confirm Booking'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
