import { supabaseAdmin } from '@/lib/supabase'

export interface BookingRequest {
  accommodationId: string
  checkIn: string
  checkOut: string
  guests: number
}

export interface ConflictingBooking {
  id: string
  checkIn: string
  checkOut: string
  guests: number
  status: string
  customer: {
    firstName: string
    lastName: string
    email: string
  }
}

export interface DateRange {
  checkIn: string
  checkOut: string
  nights: number
}

export interface ConflictResult {
  hasConflict: boolean
  conflictingBookings?: ConflictingBooking[]
  suggestedAlternatives?: DateRange[]
  message?: string
}

export class ConflictDetectionService {
  /**
   * Check for booking conflicts with existing confirmed bookings
   */
  static async checkBookingConflicts(booking: BookingRequest): Promise<ConflictResult> {
    try {
      const { accommodationId, checkIn, checkOut } = booking

      // Query for overlapping bookings
      const { data: conflicts, error } = await supabaseAdmin
        .from('bookings')
        .select(`
          id,
          checkIn,
          checkOut,
          guests,
          status,
          customer:customers(
            firstName,
            lastName,
            email
          )
        `)
        .eq('accommodationId', accommodationId)
        .in('status', ['CONFIRMED', 'ACTIVE'])
        .or(`and(checkIn.lte.${checkOut},checkOut.gte.${checkIn})`)

      if (error) {
        throw error
      }

      if (conflicts && conflicts.length > 0) {
        // Find alternative dates
        const alternatives = await this.findAlternativeDates(booking)
        
        return {
          hasConflict: true,
          conflictingBookings: conflicts as ConflictingBooking[],
          suggestedAlternatives: alternatives,
          message: `Found ${conflicts.length} conflicting booking(s) for the selected dates.`
        }
      }

      return { 
        hasConflict: false,
        message: 'No conflicts found. Dates are available.'
      }

    } catch (error) {
      // Use proper logging instead of console.error
      const { logger } = require('@/lib/logger')
      logger.error('Error checking booking conflicts', { error: error instanceof Error ? error.message : String(error) })

      return {
        hasConflict: false,
        message: 'Unable to check for conflicts. Please try again.'
      }
    }
  }

  /**
   * Find alternative available dates
   */
  static async findAlternativeDates(booking: BookingRequest): Promise<DateRange[]> {
    try {
      const duration = this.calculateDuration(booking.checkIn, booking.checkOut)
      const searchStart = new Date(booking.checkIn)
      const searchEnd = new Date(searchStart.getTime() + 90 * 24 * 60 * 60 * 1000) // 90 days

      const availableRanges = await this.findAvailableRanges(
        booking.accommodationId,
        searchStart,
        searchEnd,
        duration
      )

      return availableRanges.slice(0, 5) // Return top 5 alternatives
    } catch (error) {
      // Use proper logging instead of console.error
      const { logger } = require('@/lib/logger')
      logger.error('Error finding alternative dates', { error: error instanceof Error ? error.message : String(error) })
      return []
    }
  }

  /**
   * Find available date ranges for a given accommodation
   */
  private static async findAvailableRanges(
    accommodationId: string,
    searchStart: Date,
    searchEnd: Date,
    duration: number
  ): Promise<DateRange[]> {
    try {
      // Get all confirmed bookings in the search period
      const { data: bookings, error } = await supabaseAdmin
        .from('bookings')
        .select('checkIn, checkOut')
        .eq('accommodationId', accommodationId)
        .in('status', ['CONFIRMED', 'ACTIVE'])
        .gte('checkIn', searchStart.toISOString())
        .lte('checkOut', searchEnd.toISOString())
        .order('checkIn')

      if (error) {
        throw error
      }

      const availableRanges: DateRange[] = []
      let currentDate = new Date(searchStart)

      // Sort bookings by check-in date
      const sortedBookings = (bookings || []).sort((a, b) => 
        new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime()
      )

      for (const booking of sortedBookings) {
        const bookingStart = new Date(booking.checkIn)
        const bookingEnd = new Date(booking.checkOut)

        // Check if there's a gap before this booking
        const daysBetween = Math.floor((bookingStart.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysBetween >= duration) {
          // Found an available range
          const checkOut = new Date(bookingStart)
          checkOut.setDate(checkOut.getDate() - 1) // Day before the conflicting booking

          if (this.calculateDuration(currentDate.toISOString(), checkOut.toISOString()) >= duration) {
            availableRanges.push({
              checkIn: currentDate.toISOString().split('T')[0],
              checkOut: checkOut.toISOString().split('T')[0],
              nights: this.calculateDuration(currentDate.toISOString(), checkOut.toISOString())
            })
          }
        }

        // Move current date to after this booking
        currentDate = new Date(bookingEnd)
        currentDate.setDate(currentDate.getDate() + 1)
      }

      // Check for availability after the last booking
      const remainingDays = Math.floor((searchEnd.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
      if (remainingDays >= duration) {
        const checkOut = new Date(currentDate)
        checkOut.setDate(checkOut.getDate() + duration)
        
        availableRanges.push({
          checkIn: currentDate.toISOString().split('T')[0],
          checkOut: checkOut.toISOString().split('T')[0],
          nights: duration
        })
      }

      return availableRanges

    } catch (error) {
      // Use proper logging instead of console.error
      const { logger } = require('@/lib/logger')
      logger.error('Error finding available ranges', { error: error instanceof Error ? error.message : String(error) })
      return []
    }
  }

  /**
   * Calculate duration in nights between two dates
   */
  private static calculateDuration(checkIn: string, checkOut: string): number {
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  /**
   * Check for maintenance periods that would block bookings
   */
  static async checkMaintenanceConflicts(booking: BookingRequest): Promise<ConflictResult> {
    try {
      // TODO: Implement maintenance period checking
      // This would query a maintenance_periods table
      return { hasConflict: false }
    } catch (error) {
      // Use proper logging instead of console.error
      const { logger } = require('@/lib/logger')
      logger.error('Error checking maintenance conflicts', { error: error instanceof Error ? error.message : String(error) })
      return { hasConflict: false }
    }
  }

  /**
   * Bulk conflict checking for multiple properties
   */
  static async bulkConflictCheck(bookings: BookingRequest[]): Promise<ConflictResult[]> {
    try {
      const results = await Promise.all(
        bookings.map(booking => this.checkBookingConflicts(booking))
      )
      return results
    } catch (error) {
      // Use proper logging instead of console.error
      const { logger } = require('@/lib/logger')
      logger.error('Error in bulk conflict check', { error: error instanceof Error ? error.message : String(error) })
      return bookings.map(() => ({ hasConflict: false }))
    }
  }

  /**
   * Get all bookings in a date range for calendar display
   */
  static async getBookingsInRange(accommodationId: string, startDate: string, endDate: string) {
    try {
      const { data: bookings, error } = await supabaseAdmin
        .from('bookings')
        .select(`
          id,
          checkIn,
          checkOut,
          guests,
          status,
          customer:customers(
            firstName,
            lastName,
            email
          )
        `)
        .eq('accommodationId', accommodationId)
        .gte('checkIn', startDate)
        .lte('checkOut', endDate)
        .order('checkIn')

      return { data: bookings, error }
    } catch (error) {
      // Use proper logging instead of console.error
      const { logger } = require('@/lib/logger')
      logger.error('Error getting bookings in range', { error: error instanceof Error ? error.message : String(error) })
      return { data: null, error }
    }
  }
}
