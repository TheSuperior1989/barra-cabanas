import { Resend } from 'resend'

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailTemplate {
  subject: string
  htmlContent: string
  textContent?: string
}

export interface EmailData {
  to: string | string[]
  from?: string
  subject: string
  htmlContent: string
  textContent?: string
  attachments?: Array<{
    filename: string
    content: Buffer | string
    contentType?: string
  }>
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

export class EmailService {
  private static readonly DEFAULT_FROM = 'Barra Cabanas <noreply@barracabanas.com>'
  
  /**
   * Send a single email using RESEND
   */
  static async sendEmail(emailData: EmailData): Promise<EmailResult> {
    try {
      // Check if RESEND is configured
      if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY not configured - email sending disabled')
        return {
          success: false,
          error: 'Email service not configured'
        }
      }

      // Prepare email data
      const emailPayload = {
        from: emailData.from || this.DEFAULT_FROM,
        to: Array.isArray(emailData.to) ? emailData.to : [emailData.to],
        subject: emailData.subject,
        html: emailData.htmlContent,
        text: emailData.textContent,
        attachments: emailData.attachments
      }

      // Send email via RESEND
      const { data, error } = await resend.emails.send(emailPayload)

      if (error) {
        console.error('RESEND email error:', error)
        return {
          success: false,
          error: error.message || 'Failed to send email'
        }
      }

      console.log('Email sent successfully:', data?.id)
      return {
        success: true,
        messageId: data?.id
      }

    } catch (error) {
      console.error('Email service error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown email error'
      }
    }
  }

  /**
   * Send booking approval notification
   */
  static async sendBookingApprovalEmail(
    customerEmail: string,
    customerName: string,
    bookingDetails: {
      accommodationName: string
      checkInDate: string
      checkOutDate: string
      totalPrice: number
      bookingId: string
    },
    customMessage?: string
  ): Promise<EmailResult> {
    const subject = `Booking Confirmed - ${bookingDetails.accommodationName}`
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Booking Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .booking-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Booking Confirmed!</h1>
          </div>
          
          <div class="content">
            <p>Dear ${customerName},</p>
            
            <p>Great news! Your booking has been confirmed. We're excited to host you at Barra Cabanas!</p>
            
            <div class="booking-details">
              <h3>📋 Booking Details</h3>
              <p><strong>Accommodation:</strong> ${bookingDetails.accommodationName}</p>
              <p><strong>Check-in:</strong> ${new Date(bookingDetails.checkInDate).toLocaleDateString()}</p>
              <p><strong>Check-out:</strong> ${new Date(bookingDetails.checkOutDate).toLocaleDateString()}</p>
              <p><strong>Total Price:</strong> R${bookingDetails.totalPrice.toFixed(2)}</p>
              <p><strong>Booking Reference:</strong> ${bookingDetails.bookingId}</p>
            </div>
            
            ${customMessage ? `
              <div class="booking-details">
                <h3>📝 Additional Information</h3>
                <p>${customMessage}</p>
              </div>
            ` : ''}
            
            <p>We look forward to welcoming you to Barra Cabanas. If you have any questions, please don't hesitate to contact us.</p>
            
            <a href="mailto:info@barracabanas.com" class="button">Contact Us</a>
          </div>
          
          <div class="footer">
            <p>Barra Cabanas<br>
            Inhambane, Mozambique<br>
            +27 83 379 3741 | info@barracabanas.com</p>
          </div>
        </div>
      </body>
      </html>
    `

    const textContent = `
      Booking Confirmed - ${bookingDetails.accommodationName}
      
      Dear ${customerName},
      
      Great news! Your booking has been confirmed.
      
      Booking Details:
      - Accommodation: ${bookingDetails.accommodationName}
      - Check-in: ${new Date(bookingDetails.checkInDate).toLocaleDateString()}
      - Check-out: ${new Date(bookingDetails.checkOutDate).toLocaleDateString()}
      - Total Price: R${bookingDetails.totalPrice.toFixed(2)}
      - Booking Reference: ${bookingDetails.bookingId}
      
      ${customMessage ? `Additional Information: ${customMessage}` : ''}
      
      We look forward to welcoming you to Barra Cabanas.
      
      Best regards,
      Barra Cabanas Team
    `

    return this.sendEmail({
      to: customerEmail,
      subject,
      htmlContent,
      textContent
    })
  }

  /**
   * Send booking rejection notification
   */
  static async sendBookingRejectionEmail(
    customerEmail: string,
    customerName: string,
    bookingDetails: {
      accommodationName: string
      checkInDate: string
      checkOutDate: string
    },
    rejectionReason: string,
    customMessage?: string
  ): Promise<EmailResult> {
    const subject = `Booking Update - ${bookingDetails.accommodationName}`
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Booking Update</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .booking-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Booking Update</h1>
          </div>
          
          <div class="content">
            <p>Dear ${customerName},</p>
            
            <p>Thank you for your interest in staying with us at Barra Cabanas. Unfortunately, we are unable to accommodate your booking request at this time.</p>
            
            <div class="booking-details">
              <h3>📋 Booking Request Details</h3>
              <p><strong>Accommodation:</strong> ${bookingDetails.accommodationName}</p>
              <p><strong>Requested Check-in:</strong> ${new Date(bookingDetails.checkInDate).toLocaleDateString()}</p>
              <p><strong>Requested Check-out:</strong> ${new Date(bookingDetails.checkOutDate).toLocaleDateString()}</p>
              <p><strong>Reason:</strong> ${this.formatRejectionReason(rejectionReason)}</p>
            </div>
            
            ${customMessage ? `
              <div class="booking-details">
                <h3>📝 Additional Information</h3>
                <p>${customMessage}</p>
              </div>
            ` : ''}
            
            <p>We would be happy to help you find alternative dates or accommodations. Please feel free to contact us to discuss other options.</p>
            
            <a href="mailto:info@barracabanas.com" class="button">Contact Us for Alternatives</a>
          </div>
          
          <div class="footer">
            <p>Barra Cabanas<br>
            Inhambane, Mozambique<br>
            +27 83 379 3741 | info@barracabanas.com</p>
          </div>
        </div>
      </body>
      </html>
    `

    const textContent = `
      Booking Update - ${bookingDetails.accommodationName}
      
      Dear ${customerName},
      
      Thank you for your interest in staying with us. Unfortunately, we are unable to accommodate your booking request.
      
      Booking Request Details:
      - Accommodation: ${bookingDetails.accommodationName}
      - Requested Check-in: ${new Date(bookingDetails.checkInDate).toLocaleDateString()}
      - Requested Check-out: ${new Date(bookingDetails.checkOutDate).toLocaleDateString()}
      - Reason: ${this.formatRejectionReason(rejectionReason)}
      
      ${customMessage ? `Additional Information: ${customMessage}` : ''}
      
      Please contact us to discuss alternative dates or accommodations.
      
      Best regards,
      Barra Cabanas Team
    `

    return this.sendEmail({
      to: customerEmail,
      subject,
      htmlContent,
      textContent
    })
  }

  /**
   * Send quote notification
   */
  static async sendQuoteEmail(
    customerEmail: string,
    customerName: string,
    quoteDetails: {
      quoteNumber: string
      totalAmount: number
      validUntil: string
      quoteId: string
    }
  ): Promise<EmailResult> {
    const subject = `Your Quote ${quoteDetails.quoteNumber} is Ready`
    
    const quoteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/quote/${quoteDetails.quoteId}`
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Quote Ready</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .quote-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .button { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💰 Your Quote is Ready!</h1>
          </div>
          
          <div class="content">
            <p>Dear ${customerName},</p>
            
            <p>Your quote is ready for review. Please find the details below:</p>
            
            <div class="quote-details">
              <h3>📋 Quote Details</h3>
              <p><strong>Quote Number:</strong> ${quoteDetails.quoteNumber}</p>
              <p><strong>Total Amount:</strong> R${quoteDetails.totalAmount.toFixed(2)}</p>
              <p><strong>Valid Until:</strong> ${new Date(quoteDetails.validUntil).toLocaleDateString()}</p>
            </div>
            
            <p>Please review the quote and let us know if you have any questions or would like to proceed with the booking.</p>
            
            <a href="${quoteUrl}" class="button">View Full Quote</a>
          </div>
          
          <div class="footer">
            <p>Barra Cabanas<br>
            Inhambane, Mozambique<br>
            +27 83 379 3741 | info@barracabanas.com</p>
          </div>
        </div>
      </body>
      </html>
    `

    const textContent = `
      Your Quote ${quoteDetails.quoteNumber} is Ready
      
      Dear ${customerName},
      
      Your quote is ready for review.
      
      Quote Details:
      - Quote Number: ${quoteDetails.quoteNumber}
      - Total Amount: R${quoteDetails.totalAmount.toFixed(2)}
      - Valid Until: ${new Date(quoteDetails.validUntil).toLocaleDateString()}
      
      View your quote: ${quoteUrl}
      
      Please review and let us know if you have any questions.
      
      Best regards,
      Barra Cabanas Team
    `

    return this.sendEmail({
      to: customerEmail,
      subject,
      htmlContent,
      textContent
    })
  }

  /**
   * Test email functionality
   */
  static async sendTestEmail(toEmail: string): Promise<EmailResult> {
    return this.sendEmail({
      to: toEmail,
      subject: 'Barra Cabanas - Email Service Test',
      htmlContent: `
        <h2>🧪 Email Service Test</h2>
        <p>This is a test email to verify that the RESEND integration is working correctly.</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p>If you received this email, the integration is successful! 🎉</p>
      `,
      textContent: 'Email Service Test - If you received this email, the RESEND integration is working correctly!'
    })
  }

  /**
   * Format rejection reason for display
   */
  private static formatRejectionReason(reason: string): string {
    const reasons: Record<string, string> = {
      dates_unavailable: 'The requested dates are not available',
      capacity_exceeded: 'The number of guests exceeds accommodation capacity',
      payment_issues: 'Payment verification issues',
      policy_violation: 'Booking does not meet our policy requirements',
      maintenance: 'Scheduled maintenance during requested period',
      other: 'Other reasons'
    }
    return reasons[reason] || reason
  }
}

export default EmailService
