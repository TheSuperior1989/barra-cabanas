import { useState, useEffect, useMemo, memo } from 'react';
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
import { getAccommodations, getBookedDates, subscribeToBookingUpdates } from '../../services/bookingService.js';
import BookingForm from './BookingForm.jsx';
import './BookingPage.css';

// Memoized DayCell component to prevent unnecessary re-renders
const DayCell = memo(({ day, monthIndex, bookedDates, properties, formatDate }) => {
  const date = new Date(2025, monthIndex, day);
  const dateStr = formatDate(date);
  const isPast = date < new Date().setHours(0, 0, 0, 0);

  // Check which properties are booked on this date
  const bookedProperties = properties.filter(property =>
    bookedDates[property.id]?.includes(dateStr)
  );

  return (
    <div
      className={`day-cell ${isPast ? 'past' : ''} ${bookedProperties.length > 0 ? 'has-bookings' : ''}`}
      title={bookedProperties.length > 0 ?
        `Booked: ${bookedProperties.map(p => p.name).join(', ')}` :
        'Available'
      }
    >
      <span className="day-number">{day}</span>
      {bookedProperties.length > 0 && (
        <div className="booking-indicators">
          {bookedProperties.map(property => (
            <div
              key={property.id}
              className={`booking-dot ${property.id}`}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
});

// Lazy-loaded yearly calendar component
const YearlyCalendar = memo(({ bookedDates, properties, formatDate, getDaysInMonth, getFirstDayOfMonth }) => {
  const [calendarRef, calendarInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  if (!calendarInView) {
    return (
      <div ref={calendarRef} style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading yearly calendar...</p>
      </div>
    );
  }

  return (
    <div className="yearly-calendar-grid">
      {Array.from({ length: 12 }, (_, monthIndex) => {
        const monthDate = new Date(2025, monthIndex, 1);
        const monthName = monthDate.toLocaleDateString('en-US', { month: 'long' });
        const daysInMonth = getDaysInMonth(monthDate);
        const firstDay = getFirstDayOfMonth(monthDate);

        return (
          <div key={monthIndex} className="month-calendar">
            <div className="month-header">
              <h3>{monthName}</h3>
            </div>

            <div className="month-weekdays">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <div key={day} className="weekday-mini">{day}</div>
              ))}
            </div>

            <div className="month-grid">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDay }, (_, i) => (
                <div key={`empty-${i}`} className="day-cell empty"></div>
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }, (_, dayIndex) => {
                const day = dayIndex + 1;
                return (
                  <DayCell
                    key={day}
                    day={day}
                    monthIndex={monthIndex}
                    bookedDates={bookedDates}
                    properties={properties}
                    formatDate={formatDate}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
});

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

  // New state for real data
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking form state
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Load real data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load accommodations and booked dates in parallel
        const [accommodationsData, bookedDatesData] = await Promise.all([
          getAccommodations(),
          getBookedDates()
        ]);

        setProperties(accommodationsData);
        setBookedDates(bookedDatesData);

        console.log('✅ Loaded accommodations:', accommodationsData.length);
        console.log('✅ Loaded booked dates for properties:', Object.keys(bookedDatesData).length);

      } catch (err) {
        console.error('❌ Error loading booking data:', err);
        setError('Failed to load booking data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // MEMORY LEAK FIX: Subscribe to real-time updates ONLY for website booking page
  useEffect(() => {
    // This is the website booking page - real-time is needed for availability
    console.log('📡 Website booking page - enabling real-time availability updates')

    const subscription = subscribeToBookingUpdates((payload) => {
      console.log('📡 Real-time booking update:', payload);
      // Reload booked dates when bookings change
      getBookedDates().then(setBookedDates);
    });

    return () => {
      console.log('🧹 Website booking page cleanup - removing subscription')
      subscription.unsubscribe();
    };
  }, []);

  // Helper function to format dates
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Remove the old mock data generation code - now using real data from Supabase

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

    const nights = calculateNights();
    const baseTotal = property.price * nights;

    // Add potential extras (cleaning fee, etc.)
    const cleaningFee = 500; // Standard cleaning fee
    const estimatedTotal = baseTotal + cleaningFee;

    return estimatedTotal;
  };

  const getDetailedCostBreakdown = () => {
    if (!selectedProperty || !checkIn || !checkOut) return null;

    const property = properties.find(p => p.id === selectedProperty);
    if (!property) return null;

    const nights = calculateNights();
    const baseTotal = property.price * nights;
    const cleaningFee = 500;
    const estimatedTotal = baseTotal + cleaningFee;

    return {
      accommodation: property.name,
      nights,
      pricePerNight: property.price,
      subtotal: baseTotal,
      cleaningFee,
      estimatedTotal,
      currency: 'ZAR'
    };
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

    // Show booking form instead of alert
    setShowBookingForm(true);
  };

  const handleBookingSuccess = (result) => {
    setShowBookingForm(false);
    setBookingSuccess(true);

    // Reset form
    setSelectedProperty('');
    setCheckIn('');
    setCheckOut('');
    setGuests({ adults: 2, children: 0, infants: 0 });

    // Show success message
    alert(`🎉 ${result.message}\n\nBooking ID: ${result.booking.id}\n\nYou will receive a confirmation email shortly.`);
  };

  const handleBookingCancel = () => {
    setShowBookingForm(false);
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

              {/* Loading State */}
              {loading && (
                <div className="loading-state">
                  <p>Loading accommodations from Supabase...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="error-state">
                  <p style={{ color: 'red' }}>{error}</p>
                  <button onClick={() => window.location.reload()}>Retry</button>
                </div>
              )}



              {/* Property Selection */}
              {!loading && !error && (
                <div className="form-group">
                  <label>
                    <FontAwesomeIcon icon={faHome} />
                    Choose Your Accommodation
                  </label>
                  <select
                    value={selectedProperty}
                    onChange={(e) => setSelectedProperty(e.target.value)}
                    className="property-select"
                    disabled={loading}
                  >
                    <option value="">Select a Property</option>
                    {properties.map(property => (
                      <option key={property.id} value={property.id}>
                        {property.name} - R{property.price}/night (Max {property.maxGuests} guests)
                      </option>
                    ))}
                  </select>
                </div>
              )}

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

                  {/* Detailed Cost Breakdown */}
                  <div className="cost-breakdown">
                    <h4>Cost Estimate</h4>
                    <div className="summary-item">
                      <span>Accommodation ({calculateNights()} nights × R{properties.find(p => p.id === selectedProperty)?.price}):</span>
                      <span>R{(calculateNights() * (properties.find(p => p.id === selectedProperty)?.price || 0)).toLocaleString()}</span>
                    </div>
                    <div className="summary-item">
                      <span>Cleaning fee:</span>
                      <span>R500</span>
                    </div>
                    <div className="summary-item total">
                      <span>Estimated Total:</span>
                      <span>R{calculateTotal().toLocaleString()}</span>
                    </div>
                    <div className="cost-disclaimer">
                      <p><small>* Prices are estimates and subject to change based on final booking details, seasonal rates, and additional services.</small></p>
                    </div>
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

      {/* Yearly Availability Calendar */}
      <section className="yearly-calendar-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="yearly-calendar-container"
          >
            <div className="yearly-calendar-header">
              <h2>2025 Availability Overview</h2>
              <p>View booking availability across all properties for the entire year</p>

              <div className="property-legend">
                {properties.map(property => (
                  <div key={property.id} className="legend-property">
                    <div className={`legend-dot ${property.id}`}></div>
                    <span>{property.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <YearlyCalendar
              bookedDates={bookedDates}
              properties={properties}
              formatDate={formatDate}
              getDaysInMonth={getDaysInMonth}
              getFirstDayOfMonth={getFirstDayOfMonth}
            />


          </motion.div>
        </div>
      </section>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingForm
          bookingData={{
            accommodationId: selectedProperty,
            propertyName: properties.find(p => p.id === selectedProperty)?.name,
            checkIn,
            checkOut,
            nights: calculateNights(),
            guests,
            totalGuests: getTotalGuests(),
            totalAmount: calculateTotal()
          }}
          onSuccess={handleBookingSuccess}
          onCancel={handleBookingCancel}
        />
      )}
    </div>
  );
};

export default BookingPage;
