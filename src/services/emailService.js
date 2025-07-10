import emailjs from '@emailjs/browser';

// EmailJS configuration - FULLY CONFIGURED AND READY TO USE
const EMAILJS_SERVICE_ID = 'service_gf24d3g'; // Your Gmail service ID
const EMAILJS_TEMPLATE_ID_CONTACT = 'template_1n2dryo'; // Your contact form template ID
const EMAILJS_TEMPLATE_ID_QUOTE = 'template_ckvbt4r'; // Your quote request template ID
const EMAILJS_PUBLIC_KEY = 'v_G3DxlVjh4WKNGWJ'; // Your EmailJS public key

// Check if EmailJS is properly configured
const isEmailJSConfigured = () => {
  return EMAILJS_SERVICE_ID === 'service_gf24d3g' &&
         EMAILJS_TEMPLATE_ID_CONTACT === 'template_1n2dryo' &&
         EMAILJS_TEMPLATE_ID_QUOTE === 'template_ckvbt4r' &&
         EMAILJS_PUBLIC_KEY === 'v_G3DxlVjh4WKNGWJ'; // Now properly configured!
};

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export const sendContactForm = async (formData) => {
  // Check if EmailJS is configured
  if (!isEmailJSConfigured()) {
    console.error('EmailJS is not configured. Please check EMAIL_SETUP_GUIDE.md');
    return {
      success: false,
      message: 'Email service not configured. Please contact us directly at info@skillaxisdynamics.co.za or call +27 12 345 6789.'
    };
  }

  try {
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
      service: formData.service,
      to_email: 'info@skillaxisdynamics.co.za', // Your business email
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_CONTACT,
      templateParams
    );

    console.log('Contact form sent successfully:', response);
    return { success: true, message: 'Message sent successfully!' };
  } catch (error) {
    console.error('Error sending contact form:', error);
    return {
      success: false,
      message: 'Failed to send message. Please contact us directly at info@skillaxisdynamics.co.za or call +27 12 345 6789.'
    };
  }
};

export const sendQuoteRequest = async (selectedServices, contactInfo) => {
  // Check if EmailJS is configured
  if (!isEmailJSConfigured()) {
    console.error('EmailJS is not configured. Please check EMAIL_SETUP_GUIDE.md');
    return {
      success: false,
      message: 'Email service not configured. Please contact us directly at info@skillaxisdynamics.co.za or call +27 12 345 6789.'
    };
  }

  try {
    // Calculate total
    const total = selectedServices.reduce((sum, service) => sum + (service.price * service.quantity), 0);

    // Format services list
    const servicesList = selectedServices.map(service =>
      `${service.name} (Qty: ${service.quantity}) - R${(service.price * service.quantity).toLocaleString()}`
    ).join('\n');

    const templateParams = {
      from_name: contactInfo.name,
      from_email: contactInfo.email,
      phone: contactInfo.phone,
      company: contactInfo.company,
      message: contactInfo.message,
      services_list: servicesList,
      total_amount: `R${total.toLocaleString()}`,
      to_email: 'info@skillaxisdynamics.co.za', // Your business email
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_QUOTE,
      templateParams
    );

    console.log('Quote request sent successfully:', response);
    return { success: true, message: 'Quote request sent successfully!' };
  } catch (error) {
    console.error('Error sending quote request:', error);
    return {
      success: false,
      message: 'Failed to send quote request. Please contact us directly at info@skillaxisdynamics.co.za or call +27 12 345 6789.'
    };
  }
};

// Fallback function using Formspree (alternative solution)
export const sendFormspreeContact = async (formData) => {
  try {
    const response = await fetch('https://formspree.io/f/your_form_id', { // You'll need to replace this
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      return { success: true, message: 'Message sent successfully!' };
    } else {
      throw new Error('Failed to send message');
    }
  } catch (error) {
    console.error('Error sending form:', error);
    return { success: false, message: 'Failed to send message. Please try again.' };
  }
};
