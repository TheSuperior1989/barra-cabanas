import { supabaseAdmin } from '../lib/supabase'
import { EmailService } from './emailService'

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent: string
  variables: string[]
  category: 'booking' | 'quote' | 'invoice' | 'general'
  isActive: boolean
}

export interface CommunicationHistory {
  id: string
  customerId: string
  bookingId?: string
  quoteId?: string
  invoiceId?: string
  type: 'email' | 'sms' | 'phone' | 'in_person'
  subject?: string
  content: string
  status: 'sent' | 'delivered' | 'failed' | 'pending'
  sentAt: string
  deliveredAt?: string
  adminUserId?: string
  templateId?: string
}

export interface NotificationPreferences {
  customerId: string
  emailEnabled: boolean
  smsEnabled: boolean
  bookingUpdates: boolean
  quoteNotifications: boolean
  invoiceReminders: boolean
  marketingEmails: boolean
}

export class CommunicationService {
  /**
   * Send booking approval notification
   */
  static async sendBookingApprovalNotification(bookingId: string, customMessage?: string): Promise<boolean> {
    try {
      // Get booking details
      const { data: booking, error: bookingError } = await supabaseAdmin
        .from('bookings')
        .select(`
          *,
          customer:customers(*),
          accommodation:accommodations(*)
        `)
        .eq('id', bookingId)
        .single()

      if (bookingError || !booking) {
        throw new Error('Booking not found')
      }

      // Get email template
      const template = await this.getTemplate('booking_approved')
      
      const emailContent = this.replaceTemplateVariables(template.htmlContent, {
        customerName: `${booking.customer.firstName} ${booking.customer.lastName}`,
        accommodationName: booking.accommodation.name,
        checkInDate: new Date(booking.checkIn).toLocaleDateString(),
        checkOutDate: new Date(booking.checkOut).toLocaleDateString(),
        totalPrice: booking.totalPrice.toFixed(2),
        customMessage: customMessage || ''
      })

      const emailSubject = this.replaceTemplateVariables(template.subject, {
        accommodationName: booking.accommodation.name
      })

      // Send email
      const emailSent = await this.sendEmail({
        to: booking.customer.email,
        subject: emailSubject,
        htmlContent: emailContent,
        textContent: template.textContent
      })

      // Log communication
      await this.logCommunication({
        customerId: booking.customer.id,
        bookingId: booking.id,
        type: 'email',
        subject: emailSubject,
        content: emailContent,
        status: emailSent ? 'sent' : 'failed',
        templateId: template.id
      })

      return emailSent
    } catch (error) {
      console.error('Error sending booking approval notification:', error)
      return false
    }
  }

  /**
   * Send booking rejection notification
   */
  static async sendBookingRejectionNotification(
    bookingId: string, 
    reason: string, 
    customMessage?: string
  ): Promise<boolean> {
    try {
      // Get booking details
      const { data: booking, error: bookingError } = await supabaseAdmin
        .from('bookings')
        .select(`
          *,
          customer:customers(*),
          accommodation:accommodations(*)
        `)
        .eq('id', bookingId)
        .single()

      if (bookingError || !booking) {
        throw new Error('Booking not found')
      }

      // Get email template
      const template = await this.getTemplate('booking_rejected')
      
      const emailContent = this.replaceTemplateVariables(template.htmlContent, {
        customerName: `${booking.customer.firstName} ${booking.customer.lastName}`,
        accommodationName: booking.accommodation.name,
        checkInDate: new Date(booking.checkIn).toLocaleDateString(),
        checkOutDate: new Date(booking.checkOut).toLocaleDateString(),
        rejectionReason: this.formatRejectionReason(reason),
        customMessage: customMessage || ''
      })

      const emailSubject = this.replaceTemplateVariables(template.subject, {
        accommodationName: booking.accommodation.name
      })

      // Send email
      const emailSent = await this.sendEmail({
        to: booking.customer.email,
        subject: emailSubject,
        htmlContent: emailContent,
        textContent: template.textContent
      })

      // Log communication
      await this.logCommunication({
        customerId: booking.customer.id,
        bookingId: booking.id,
        type: 'email',
        subject: emailSubject,
        content: emailContent,
        status: emailSent ? 'sent' : 'failed',
        templateId: template.id
      })

      return emailSent
    } catch (error) {
      console.error('Error sending booking rejection notification:', error)
      return false
    }
  }

  /**
   * Send quote notification
   */
  static async sendQuoteNotification(quoteId: string): Promise<boolean> {
    try {
      // Get quote details
      const { data: quote, error: quoteError } = await supabaseAdmin
        .from('quotes')
        .select(`
          *,
          customer:customers(*)
        `)
        .eq('id', quoteId)
        .single()

      if (quoteError || !quote) {
        throw new Error('Quote not found')
      }

      // Get email template
      const template = await this.getTemplate('quote_sent')
      
      const emailContent = this.replaceTemplateVariables(template.htmlContent, {
        customerName: `${quote.customer.firstName} ${quote.customer.lastName}`,
        quoteNumber: quote.quoteNumber,
        totalAmount: quote.total.toFixed(2),
        validUntil: new Date(quote.validUntil).toLocaleDateString(),
        quoteLink: `${process.env.NEXT_PUBLIC_APP_URL}/quote/${quote.id}`
      })

      const emailSubject = this.replaceTemplateVariables(template.subject, {
        quoteNumber: quote.quoteNumber
      })

      // Send email
      const emailSent = await this.sendEmail({
        to: quote.customer.email,
        subject: emailSubject,
        htmlContent: emailContent,
        textContent: template.textContent
      })

      // Log communication
      await this.logCommunication({
        customerId: quote.customer.id,
        quoteId: quote.id,
        type: 'email',
        subject: emailSubject,
        content: emailContent,
        status: emailSent ? 'sent' : 'failed',
        templateId: template.id
      })

      return emailSent
    } catch (error) {
      console.error('Error sending quote notification:', error)
      return false
    }
  }

  /**
   * Get email template by name
   */
  private static async getTemplate(templateName: string): Promise<EmailTemplate> {
    // For now, return default templates
    // In production, these would be stored in database
    const templates: Record<string, EmailTemplate> = {
      booking_approved: {
        id: 'booking_approved',
        name: 'Booking Approved',
        subject: 'Your booking at {{accommodationName}} has been approved!',
        htmlContent: `
          <h2>Booking Confirmation</h2>
          <p>Dear {{customerName}},</p>
          <p>Great news! Your booking has been approved.</p>
          <h3>Booking Details:</h3>
          <ul>
            <li><strong>Accommodation:</strong> {{accommodationName}}</li>
            <li><strong>Check-in:</strong> {{checkInDate}}</li>
            <li><strong>Check-out:</strong> {{checkOutDate}}</li>
            <li><strong>Total Price:</strong> R{{totalPrice}}</li>
          </ul>
          {{#if customMessage}}
          <h3>Additional Information:</h3>
          <p>{{customMessage}}</p>
          {{/if}}
          <p>We look forward to hosting you!</p>
        `,
        textContent: 'Your booking has been approved. Details: {{accommodationName}} from {{checkInDate}} to {{checkOutDate}}',
        variables: ['customerName', 'accommodationName', 'checkInDate', 'checkOutDate', 'totalPrice', 'customMessage'],
        category: 'booking',
        isActive: true
      },
      booking_rejected: {
        id: 'booking_rejected',
        name: 'Booking Rejected',
        subject: 'Update on your booking request for {{accommodationName}}',
        htmlContent: `
          <h2>Booking Update</h2>
          <p>Dear {{customerName}},</p>
          <p>We regret to inform you that we cannot accommodate your booking request.</p>
          <h3>Booking Details:</h3>
          <ul>
            <li><strong>Accommodation:</strong> {{accommodationName}}</li>
            <li><strong>Requested dates:</strong> {{checkInDate}} to {{checkOutDate}}</li>
            <li><strong>Reason:</strong> {{rejectionReason}}</li>
          </ul>
          {{#if customMessage}}
          <h3>Additional Information:</h3>
          <p>{{customMessage}}</p>
          {{/if}}
          <p>Please feel free to contact us for alternative dates or accommodations.</p>
        `,
        textContent: 'Your booking request could not be accommodated. Reason: {{rejectionReason}}',
        variables: ['customerName', 'accommodationName', 'checkInDate', 'checkOutDate', 'rejectionReason', 'customMessage'],
        category: 'booking',
        isActive: true
      },
      quote_sent: {
        id: 'quote_sent',
        name: 'Quote Sent',
        subject: 'Your quote {{quoteNumber}} is ready',
        htmlContent: `
          <h2>Quote Ready</h2>
          <p>Dear {{customerName}},</p>
          <p>Your quote is ready for review.</p>
          <h3>Quote Details:</h3>
          <ul>
            <li><strong>Quote Number:</strong> {{quoteNumber}}</li>
            <li><strong>Total Amount:</strong> R{{totalAmount}}</li>
            <li><strong>Valid Until:</strong> {{validUntil}}</li>
          </ul>
          <p><a href="{{quoteLink}}">View Quote</a></p>
          <p>Please review and let us know if you have any questions.</p>
        `,
        textContent: 'Your quote {{quoteNumber}} for R{{totalAmount}} is ready. Valid until {{validUntil}}.',
        variables: ['customerName', 'quoteNumber', 'totalAmount', 'validUntil', 'quoteLink'],
        category: 'quote',
        isActive: true
      }
    }

    return templates[templateName] || templates.booking_approved
  }

  /**
   * Replace template variables
   */
  private static replaceTemplateVariables(template: string, variables: Record<string, string>): string {
    let result = template
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      result = result.replace(regex, value || '')
    })
    return result
  }

  /**
   * Format rejection reason
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

  /**
   * Send email using RESEND service
   */
  private static async sendEmail(emailData: {
    to: string
    subject: string
    htmlContent: string
    textContent: string
  }): Promise<boolean> {
    try {
      const result = await EmailService.sendEmail({
        to: emailData.to,
        subject: emailData.subject,
        htmlContent: emailData.htmlContent,
        textContent: emailData.textContent
      })

      if (result.success) {
        console.log('Email sent successfully via RESEND:', result.messageId)
        return true
      } else {
        console.error('Failed to send email via RESEND:', result.error)
        return false
      }
    } catch (error) {
      console.error('Error sending email:', error)
      return false
    }
  }

  /**
   * Log communication history
   */
  private static async logCommunication(communication: Omit<CommunicationHistory, 'id' | 'sentAt'>): Promise<void> {
    try {
      await supabaseAdmin
        .from('communication_history')
        .insert({
          id: crypto.randomUUID(),
          ...communication,
          sentAt: new Date().toISOString()
        })
    } catch (error) {
      // Use proper logging instead of console.error
      const { logger } = require('@/lib/logger')
      logger.error('Error logging communication', { error: error instanceof Error ? error.message : String(error) })
    }
  }

  /**
   * Get communication history for a customer
   */
  static async getCommunicationHistory(customerId: string): Promise<CommunicationHistory[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('communication_history')
        .select('*')
        .eq('customerId', customerId)
        .order('sentAt', { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error fetching communication history:', error)
      return []
    }
  }
}
