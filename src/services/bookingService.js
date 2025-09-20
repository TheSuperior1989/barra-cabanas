// Booking service for website integration with admin backend
import { supabase } from '../lib/supabase.js'
import { sendBookingEmails } from './emailConfirmationService.js'

const ADMIN_API_URL = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:3001'

/**
 * Fetch all accommodations from Supabase
 */
export const getAccommodations = async () => {
  try {
    const { data, error } = await supabase
      .from('accommodations')
      .select('*')
      .eq('isActive', true)
      .order('name', { ascending: true })

    if (error) throw error

    // Transform data to match website format
    return data.map(accommodation => ({
      id: accommodation.id,
      name: accommodation.name,
      price: accommodation.basePrice,
      maxGuests: accommodation.maxGuests,
      description: accommodation.description,
      type: accommodation.type,
      bedrooms: accommodation.bedrooms,
      bathrooms: accommodation.bathrooms
    }))
  } catch (error) {
    console.error('Error fetching accommodations:', error)
    // Fallback to mock data if Supabase fails
    return getMockAccommodations()
  }
}

/**
 * Get booked dates for all accommodations
 */
export const getBookedDates = async () => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('accommodationId, checkIn, checkOut, status')
      .in('status', ['CONFIRMED', 'ACTIVE', 'PENDING'])

    if (error) throw error

    // Transform to website format
    const bookedDates = {}
    
    data.forEach(booking => {
      if (!bookedDates[booking.accommodationId]) {
        bookedDates[booking.accommodationId] = []
      }
      
      // Generate all dates between check-in and check-out
      const startDate = new Date(booking.checkIn)
      const endDate = new Date(booking.checkOut)
      
      for (let date = new Date(startDate); date < endDate; date.setDate(date.getDate() + 1)) {
        const dateStr = date.toISOString().split('T')[0]
        if (!bookedDates[booking.accommodationId].includes(dateStr)) {
          bookedDates[booking.accommodationId].push(dateStr)
        }
      }
    })

    return bookedDates
  } catch (error) {
    console.error('Error fetching booked dates:', error)
    // Fallback to mock data
    return getMockBookedDates()
  }
}

/**
 * Submit a booking to the admin backend
 */
export const submitBooking = async (bookingData) => {
  try {
    // First, create or find customer
    const customerData = {
      email: bookingData.email,
      firstName: bookingData.firstName,
      lastName: bookingData.lastName,
      phone: bookingData.phone || '',
      address: bookingData.address || '',
      city: bookingData.city || '',
      country: bookingData.country || 'South Africa',
      postalCode: bookingData.postalCode || '',
      isCompany: false,
      notes: `Website booking - ${new Date().toISOString()}`,
      preferredContact: 'email'
    }

    // Check if customer exists
    let { data: existingCustomer } = await supabase
      .from('customers')
      .select('*')
      .eq('email', customerData.email)
      .single()

    let customerId
    if (existingCustomer) {
      customerId = existingCustomer.id
    } else {
      // Create new customer
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert(customerData)
        .select()
        .single()

      if (customerError) throw customerError
      customerId = newCustomer.id
    }

    // Create booking
    const booking = {
      customerId: customerId,
      accommodationId: bookingData.accommodationId,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      adults: bookingData.guests.adults,
      children: bookingData.guests.children,
      infants: bookingData.guests.infants,
      totalGuests: bookingData.guests.adults + bookingData.guests.children + bookingData.guests.infants,
      totalAmount: bookingData.totalAmount,
      status: 'PENDING',
      source: 'WEBSITE',
      notes: bookingData.specialRequests || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const { data: newBooking, error: bookingError } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single()

    if (bookingError) throw bookingError

    // Send confirmation emails
    try {
      await sendBookingEmails(bookingData, customerData);
      console.log('✅ Booking emails sent successfully');
    } catch (emailError) {
      console.error('⚠️ Email sending failed:', emailError);
      // Don't fail the booking if emails fail
    }

    return {
      success: true,
      booking: newBooking,
      message: 'Booking submitted successfully! You will receive a confirmation email shortly.'
    }
  } catch (error) {
    console.error('Error submitting booking:', error)
    return {
      success: false,
      message: 'Failed to submit booking. Please try again or contact us directly.'
    }
  }
}

/**
 * Subscribe to real-time booking updates
 */
export const subscribeToBookingUpdates = (callback) => {
  const subscription = supabase
    .channel('booking-updates')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'bookings' 
      }, 
      callback
    )
    .subscribe()

  return subscription
}

/**
 * Fallback mock data for accommodations
 */
const getMockAccommodations = () => [
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
]

/**
 * Fallback mock booked dates
 */
const getMockBookedDates = () => ({
  'seaview-cabana': [
    '2025-01-15', '2025-01-16', '2025-02-20', '2025-03-10', '2025-03-11', '2025-03-12',
    '2025-06-15', '2025-06-16', '2025-07-04', '2025-07-05', '2025-12-25', '2025-12-26'
  ],
  'luxury-family-cabana': [
    '2025-01-20', '2025-01-21', '2025-02-14', '2025-03-15', '2025-03-16',
    '2025-06-20', '2025-06-21', '2025-07-10', '2025-07-11', '2025-12-30', '2025-12-31'
  ],
  'honeymoon-suite': [
    '2025-01-10', '2025-01-11', '2025-02-14', '2025-02-15', '2025-03-20', '2025-03-21',
    '2025-06-10', '2025-06-11', '2025-07-15', '2025-07-16', '2025-12-20', '2025-12-21'
  ],
  'ocean-breeze-bungalow': [
    '2025-01-25', '2025-01-26', '2025-02-25', '2025-03-25', '2025-03-26',
    '2025-06-25', '2025-06-26', '2025-07-20', '2025-07-21', '2025-12-15', '2025-12-16'
  ]
})
