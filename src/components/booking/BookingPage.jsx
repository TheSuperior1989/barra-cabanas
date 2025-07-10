import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faUsers, 
  faChild, 
  faBaby, 
  faHome,
  faChevronLeft,
  faChevronRight,
  faMinus,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './BookingPage.css';

const BookingPage = () => {
  const [selectedProperty, setSelectedProperty] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState({
    adults: 2,
    children: 0,
    infants: 0
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarType, setCalendarType] = useState('checkin'); // 'checkin' or 'checkout'
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookedDates, setBookedDates] = useState({});
  const [showGuestSelector, setShowGuestSelector] = useState(false);

  const properties = [
    {
      id: 'seaview-cabana',
      name: 'Seaview Cabana',
      price: 1500,
      maxGuests: 2,
      description: 'King-size bed with ocean views, private deck'
    },
    {
      id: 'luxury-family-cabana',
      name: 'Luxury Family Cabana',
      price: 2400,
      maxGuests: 6,
      description: 'Perfect for families, multiple bedrooms'
    },
    {
      id: 'honeymoon-suite',
      name: 'Honeymoon Suite',
      price: 2100,
      maxGuests: 2,
      description: 'Romantic suite with premium amenities'
    },
    {
      id: 'ocean-breeze-bungalow',
      name: 'Ocean Breeze Bungalow',
      price: 1200,
      maxGuests: 4,
      description: 'Cozy bungalow with ocean breeze'
    }
  ];

  // Mock booked dates - in real app this would come from API
  useEffect(() => {
    const mockBookedDates = {
      'seaview-cabana': ['2025-07-15', '2025-07-16', '2025-07-20', '2025-07-21'],
      'luxury-family-cabana': ['2025-07-18', '2025-07-19', '2025-07-25'],
      'honeymoon-suite': ['2025-07-12', '2025-07-13', '2025-07-14'],
      'ocean-breeze-bungalow': ['2025-07-22', '2025-07-23']
    };
    setBookedDates(mockBookedDates);
  }, []);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const isDateBooked = (date) => {
    if (!selectedProperty) return false;
    const dateStr = formatDate(date);
    return bookedDates[selectedProperty]?.includes(dateStr) || false;
  };

  const isDateInRange = (date) => {
    if (!checkIn || !checkOut) return false;
    const dateStr = formatDate(date);
    return dateStr >= checkIn && dateStr <= checkOut;
  };

  const handleDateClick = (date) => {
    const dateStr = formatDate(date);
    
    if (isDateBooked(date)) return; // Can't select booked dates
    
    if (calendarType === 'checkin') {
      setCheckIn(dateStr);
      setCalendarType('checkout');
    } else {
      if (dateStr <= checkIn) {
        setCheckIn(dateStr);
        setCheckOut('');
      } else {
        setCheckOut(dateStr);
        setShowCalendar(false);
      }
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isBooked = isDateBooked(date);
      const isSelected = formatDate(date) === checkIn || formatDate(date) === checkOut;
      const isInRange = isDateInRange(date);
      const isPast = date < new Date().setHours(0, 0, 0, 0);
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''} ${isInRange ? 'in-range' : ''} ${isPast ? 'past' : ''}`}
          onClick={() => !isBooked && !isPast && handleDateClick(date)}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  const updateGuests = (type, operation) => {
    setGuests(prev => {
      const newGuests = { ...prev };
      if (operation === 'increment') {
        newGuests[type]++;
      } else if (operation === 'decrement' && newGuests[type] > 0) {
        newGuests[type]--;
      }
      return newGuests;
    });
  };

  const getTotalGuests = () => {
    return guests.adults + guests.children + guests.infants;
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const property = properties.find(p => p.id === selectedProperty);
    if (!property) return 0;
    return property.price * calculateNights();
  };

  const handleBooking = () => {
    if (!selectedProperty || !checkIn || !checkOut) {
      alert('Please fill in all required fields');
      return;
    }
    
    const property = properties.find(p => p.id === selectedProperty);
    const totalGuests = getTotalGuests();
    
    if (totalGuests > property.maxGuests) {
      alert(`This property can accommodate maximum ${property.maxGuests} guests`);
      return;
    }
    
    // In real app, this would submit to booking API
    alert(`Booking confirmed for ${property.name} from ${checkIn} to ${checkOut} for ${totalGuests} guests. Total: R${calculateTotal()}`);
  };

  return (
    <div className="booking-page">
      <div className="booking-hero">
        <div className="booking-hero-overlay"></div>
        <div className="container">
          <h1 className="booking-hero-title">Book Your Stay</h1>
          <p className="booking-hero-subtitle">
            Reserve your perfect beach getaway at Barra Cabanas
          </p>
        </div>
      </div>

      <section className="booking-form-section">
        <div className="container">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="booking-form-container"
          >
            <div className="booking-form">
              <h2>Make Your Reservation</h2>
              
              {/* Property Selection */}
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faHome} />
                  Choose Your Accommodation
                </label>
                <select 
                  value={selectedProperty} 
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  className="property-select"
                >
                  <option value="">Select a Property</option>
                  {properties.map(property => (
                    <option key={property.id} value={property.id}>
                      {property.name} - R{property.price}/night (Max {property.maxGuests} guests)
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Selection */}
              <div className="date-selection">
                <div className="date-group">
                  <label>
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    Check In
                  </label>
                  <input
                    type="text"
                    value={checkIn}
                    placeholder="Select date"
                    readOnly
                    onClick={() => {
                      setCalendarType('checkin');
                      setShowCalendar(true);
                    }}
                  />
                </div>
                
                <div className="date-group">
                  <label>
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    Check Out
                  </label>
                  <input
                    type="text"
                    value={checkOut}
                    placeholder="Select date"
                    readOnly
                    onClick={() => {
                      setCalendarType('checkout');
                      setShowCalendar(true);
                    }}
                  />
                </div>
              </div>

              {/* Guest Selection */}
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faUsers} />
                  Guests
                </label>
                <div 
                  className="guest-selector-trigger"
                  onClick={() => setShowGuestSelector(!showGuestSelector)}
                >
                  {getTotalGuests()} Guest{getTotalGuests() !== 1 ? 's' : ''}
                </div>
                
                {showGuestSelector && (
                  <div className="guest-selector">
                    <div className="guest-type">
                      <div className="guest-info">
                        <FontAwesomeIcon icon={faUsers} />
                        <div>
                          <span>Adults</span>
                          <small>Ages 13+</small>
                        </div>
                      </div>
                      <div className="guest-controls">
                        <button onClick={() => updateGuests('adults', 'decrement')}>
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <span>{guests.adults}</span>
                        <button onClick={() => updateGuests('adults', 'increment')}>
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="guest-type">
                      <div className="guest-info">
                        <FontAwesomeIcon icon={faChild} />
                        <div>
                          <span>Children</span>
                          <small>Ages 3-12</small>
                        </div>
                      </div>
                      <div className="guest-controls">
                        <button onClick={() => updateGuests('children', 'decrement')}>
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <span>{guests.children}</span>
                        <button onClick={() => updateGuests('children', 'increment')}>
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="guest-type">
                      <div className="guest-info">
                        <FontAwesomeIcon icon={faBaby} />
                        <div>
                          <span>Infants</span>
                          <small>Under 3</small>
                        </div>
                      </div>
                      <div className="guest-controls">
                        <button onClick={() => updateGuests('infants', 'decrement')}>
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <span>{guests.infants}</span>
                        <button onClick={() => updateGuests('infants', 'increment')}>
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Booking Summary */}
              {selectedProperty && checkIn && checkOut && (
                <div className="booking-summary">
                  <h3>Booking Summary</h3>
                  <div className="summary-item">
                    <span>Property:</span>
                    <span>{properties.find(p => p.id === selectedProperty)?.name}</span>
                  </div>
                  <div className="summary-item">
                    <span>Dates:</span>
                    <span>{checkIn} to {checkOut}</span>
                  </div>
                  <div className="summary-item">
                    <span>Nights:</span>
                    <span>{calculateNights()}</span>
                  </div>
                  <div className="summary-item">
                    <span>Guests:</span>
                    <span>{getTotalGuests()}</span>
                  </div>
                  <div className="summary-item total">
                    <span>Total:</span>
                    <span>R{calculateTotal()}</span>
                  </div>
                </div>
              )}

              <button className="btn btn-primary booking-btn" onClick={handleBooking}>
                Book Now
              </button>
            </div>

            {/* Calendar Modal */}
            {showCalendar && (
              <div className="calendar-modal">
                <div className="calendar-container">
                  <div className="calendar-header">
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <h3>
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  </div>
                  
                  <div className="calendar-weekdays">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="weekday">{day}</div>
                    ))}
                  </div>
                  
                  <div className="calendar-grid">
                    {renderCalendar()}
                  </div>
                  
                  <div className="calendar-legend">
                    <div className="legend-item">
                      <div className="legend-color available"></div>
                      <span>Available</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color booked"></div>
                      <span>Booked</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color selected"></div>
                      <span>Selected</span>
                    </div>
                  </div>
                  
                  <button 
                    className="calendar-close"
                    onClick={() => setShowCalendar(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BookingPage;
