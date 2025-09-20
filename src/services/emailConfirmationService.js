// Email confirmation service for booking notifications
import emailjs from '@emailjs/browser';

// EmailJS configuration (reuse existing setup)
const EMAILJS_SERVICE_ID = 'service_gf24d3g';
const EMAILJS_TEMPLATE_ID_BOOKING = 'template_1n2dryo'; // Reuse contact template for now
const EMAILJS_PUBLIC_KEY = 'v_G3DxlVjh4WKNGWJ';

/**
 * Send booking confirmation email to customer
 */
export const sendBookingConfirmation = async (bookingData, customerData) => {
  try {
    const templateParams = {
      from_name: 'Barra Cabanas',
      to_name: `${customerData.firstName} ${customerData.lastName}`,
      to_email: customerData.email,
      from_email: 'bookings@barracabanas.com',
      subject: `Booking Confirmation - ${bookingData.propertyName}`,
      message: `
Dear ${customerData.firstName},

Thank you for your booking request at Barra Cabanas!

BOOKING DETAILS:
================
Property: ${bookingData.propertyName}
Check-in: ${bookingData.checkIn}
Check-out: ${bookingData.checkOut}
Nights: ${bookingData.nights}
Guests: ${bookingData.totalGuests} (${bookingData.guests.adults} adults, ${bookingData.guests.children} children, ${bookingData.guests.infants} infants)

COST ESTIMATE:
==============
Accommodation (${bookingData.nights} nights): R${(bookingData.nights * 3500).toLocaleString()}
Cleaning fee: R500
Estimated Total: R${bookingData.totalAmount.toLocaleString()}

* This is an estimate. Final pricing may vary based on seasonal rates,
  additional services, and specific booking requirements.

CUSTOMER DETAILS:
================
Name: ${customerData.firstName} ${customerData.lastName}
Email: ${customerData.email}
Phone: ${customerData.phone}
${customerData.address ? `Address: ${customerData.address}` : ''}
${customerData.city ? `City: ${customerData.city}` : ''}
${customerData.country ? `Country: ${customerData.country}` : ''}

${customerData.specialRequests ? `Special Requests: ${customerData.specialRequests}` : ''}

STATUS: PENDING CONFIRMATION
============================
Your booking request has been received and is currently pending confirmation.

NEXT STEPS:
1. Our team will review your request within 24 hours
2. We'll confirm availability for your selected dates
3. You'll receive a confirmation email with:
   - Final pricing and payment instructions
   - Check-in details and directions
   - Contact information for your stay

IMPORTANT NOTES:
- This is a booking REQUEST, not a confirmed reservation
- Pricing shown is an estimate and subject to change
- No payment is required until booking is confirmed
- You can modify or cancel this request by contacting us

If you have any questions, please contact us:
📧 Email: info@barracabanas.com
📞 Phone: +27 XX XXX XXXX

Thank you for choosing Barra Cabanas!

Best regards,
The Barra Cabanas Team
      `
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_BOOKING,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('✅ Booking confirmation email sent:', response);
    return { success: true, message: 'Confirmation email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending booking confirmation:', error);
    return { success: false, message: 'Failed to send confirmation email' };
  }
};

/**
 * Send admin notification email about new booking
 */
export const sendAdminNotification = async (bookingData, customerData) => {
  try {
    const templateParams = {
      from_name: 'Barra Cabanas Website',
      to_name: 'Admin',
      to_email: 'admin@barracabanas.com', // Admin email
      from_email: 'website@barracabanas.com',
      subject: `🔔 New Booking Request - ${bookingData.propertyName}`,
      message: `
NEW BOOKING REQUEST RECEIVED
============================

A new booking request has been submitted through the website.

BOOKING DETAILS:
================
Property: ${bookingData.propertyName}
Check-in: ${bookingData.checkIn}
Check-out: ${bookingData.checkOut}
Nights: ${bookingData.nights}
Guests: ${bookingData.totalGuests}
Total Amount: R${bookingData.totalAmount}

CUSTOMER DETAILS:
================
Name: ${customerData.firstName} ${customerData.lastName}
Email: ${customerData.email}
Phone: ${customerData.phone}
${customerData.address ? `Address: ${customerData.address}` : ''}
${customerData.specialRequests ? `Special Requests: ${customerData.specialRequests}` : ''}

ACTION REQUIRED:
================
1. Review the booking in the admin dashboard
2. Check availability for the requested dates
3. Contact the customer within 24 hours
4. Confirm or decline the booking

Admin Dashboard: http://localhost:3001/admin
Login: http://localhost:3001/login

This is an automated notification from the Barra Cabanas website.
      `
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_BOOKING,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('✅ Admin notification email sent:', response);
    return { success: true, message: 'Admin notification sent successfully' };
  } catch (error) {
    console.error('❌ Error sending admin notification:', error);
    return { success: false, message: 'Failed to send admin notification' };
  }
};

/**
 * Send both customer confirmation and admin notification
 */
export const sendBookingEmails = async (bookingData, customerData) => {
  try {
    // Send both emails in parallel
    const [customerResult, adminResult] = await Promise.all([
      sendBookingConfirmation(bookingData, customerData),
      sendAdminNotification(bookingData, customerData)
    ]);

    const results = {
      customer: customerResult,
      admin: adminResult,
      success: customerResult.success && adminResult.success
    };

    if (results.success) {
      console.log('✅ All booking emails sent successfully');
    } else {
      console.log('⚠️ Some booking emails failed to send');
    }

    return results;
  } catch (error) {
    console.error('❌ Error sending booking emails:', error);
    return {
      customer: { success: false, message: 'Failed to send customer email' },
      admin: { success: false, message: 'Failed to send admin email' },
      success: false
    };
  }
};
