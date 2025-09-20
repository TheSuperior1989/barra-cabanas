import { supabaseAdmin } from '../lib/supabase'

export interface BookingTrend {
  date: string
  bookings: number
  revenue: number
  averageBookingValue: number
}

export interface AccommodationPerformance {
  accommodationId: string
  accommodationName: string
  totalBookings: number
  totalRevenue: number
  averageBookingValue: number
  occupancyRate: number
  averageStayDuration: number
}

export interface CustomerAnalytics {
  totalCustomers: number
  newCustomersThisMonth: number
  returningCustomers: number
  averageBookingsPerCustomer: number
  topCustomersByRevenue: Array<{
    customerId: string
    customerName: string
    totalBookings: number
    totalRevenue: number
  }>
}

export interface RevenueAnalytics {
  totalRevenue: number
  monthlyRevenue: number
  yearlyRevenue: number
  averageBookingValue: number
  revenueByMonth: Array<{
    month: string
    revenue: number
    bookings: number
  }>
  revenueByAccommodation: Array<{
    accommodationName: string
    revenue: number
    percentage: number
  }>
}

export interface BookingAnalytics {
  totalBookings: number
  confirmedBookings: number
  pendingBookings: number
  cancelledBookings: number
  conversionRate: number
  averageLeadTime: number
  seasonalTrends: Array<{
    month: string
    bookings: number
    averagePrice: number
  }>
}

export interface QuoteAnalytics {
  totalQuotes: number
  sentQuotes: number
  acceptedQuotes: number
  convertedQuotes: number
  quoteConversionRate: number
  averageQuoteValue: number
  quoteToInvoiceConversionRate: number
}

export class AnalyticsService {
  /**
   * Get booking trends over time
   */
  static async getBookingTrends(startDate: string, endDate: string): Promise<BookingTrend[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('bookings')
        .select('createdAt, totalPrice, status')
        .gte('createdAt', startDate)
        .lte('createdAt', endDate)
        .in('status', ['CONFIRMED', 'COMPLETED'])

      if (error) throw error

      // Group by date
      const trendMap = new Map<string, { bookings: number; revenue: number }>()
      
      data?.forEach(booking => {
        const date = new Date(booking.createdAt).toISOString().split('T')[0]
        const existing = trendMap.get(date) || { bookings: 0, revenue: 0 }
        trendMap.set(date, {
          bookings: existing.bookings + 1,
          revenue: existing.revenue + booking.totalPrice
        })
      })

      return Array.from(trendMap.entries()).map(([date, data]) => ({
        date,
        bookings: data.bookings,
        revenue: data.revenue,
        averageBookingValue: data.revenue / data.bookings
      })).sort((a, b) => a.date.localeCompare(b.date))

    } catch (error) {
      console.error('Error getting booking trends:', error)
      return []
    }
  }

  /**
   * Get accommodation performance metrics
   */
  static async getAccommodationPerformance(): Promise<AccommodationPerformance[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('bookings')
        .select(`
          totalPrice,
          checkIn,
          checkOut,
          status,
          accommodation:accommodations(id, name)
        `)
        .in('status', ['CONFIRMED', 'COMPLETED'])

      if (error) throw error

      const performanceMap = new Map<string, {
        accommodationId: string
        accommodationName: string
        totalBookings: number
        totalRevenue: number
        totalNights: number
      }>()

      data?.forEach(booking => {
        const accommodationId = booking.accommodation.id
        const accommodationName = booking.accommodation.name
        const nights = Math.ceil(
          (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24)
        )

        const existing = performanceMap.get(accommodationId) || {
          accommodationId,
          accommodationName,
          totalBookings: 0,
          totalRevenue: 0,
          totalNights: 0
        }

        performanceMap.set(accommodationId, {
          ...existing,
          totalBookings: existing.totalBookings + 1,
          totalRevenue: existing.totalRevenue + booking.totalPrice,
          totalNights: existing.totalNights + nights
        })
      })

      return Array.from(performanceMap.values()).map(perf => ({
        ...perf,
        averageBookingValue: perf.totalRevenue / perf.totalBookings,
        occupancyRate: this.calculateOccupancyRate(perf.totalNights),
        averageStayDuration: perf.totalNights / perf.totalBookings
      }))

    } catch (error) {
      console.error('Error getting accommodation performance:', error)
      return []
    }
  }

  /**
   * Get customer analytics
   */
  static async getCustomerAnalytics(): Promise<CustomerAnalytics> {
    try {
      const currentMonth = new Date()
      currentMonth.setDate(1)
      const currentMonthStr = currentMonth.toISOString()

      // Get total customers
      const { count: totalCustomers } = await supabaseAdmin
        .from('customers')
        .select('*', { count: 'exact', head: true })

      // Get new customers this month
      const { count: newCustomersThisMonth } = await supabaseAdmin
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .gte('createdAt', currentMonthStr)

      // Get customer booking data
      const { data: customerBookings, error } = await supabaseAdmin
        .from('bookings')
        .select(`
          customerId,
          totalPrice,
          customer:customers(firstName, lastName, companyName, isCompany)
        `)
        .in('status', ['CONFIRMED', 'COMPLETED'])

      if (error) throw error

      const customerMap = new Map<string, {
        customerId: string
        customerName: string
        totalBookings: number
        totalRevenue: number
      }>()

      customerBookings?.forEach(booking => {
        const customerId = booking.customerId
        const customerName = booking.customer.isCompany 
          ? booking.customer.companyName 
          : `${booking.customer.firstName} ${booking.customer.lastName}`

        const existing = customerMap.get(customerId) || {
          customerId,
          customerName,
          totalBookings: 0,
          totalRevenue: 0
        }

        customerMap.set(customerId, {
          ...existing,
          totalBookings: existing.totalBookings + 1,
          totalRevenue: existing.totalRevenue + booking.totalPrice
        })
      })

      const customerData = Array.from(customerMap.values())
      const returningCustomers = customerData.filter(c => c.totalBookings > 1).length
      const averageBookingsPerCustomer = customerData.reduce((sum, c) => sum + c.totalBookings, 0) / customerData.length
      const topCustomersByRevenue = customerData
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 10)

      return {
        totalCustomers: totalCustomers || 0,
        newCustomersThisMonth: newCustomersThisMonth || 0,
        returningCustomers,
        averageBookingsPerCustomer: averageBookingsPerCustomer || 0,
        topCustomersByRevenue
      }

    } catch (error) {
      console.error('Error getting customer analytics:', error)
      return {
        totalCustomers: 0,
        newCustomersThisMonth: 0,
        returningCustomers: 0,
        averageBookingsPerCustomer: 0,
        topCustomersByRevenue: []
      }
    }
  }

  /**
   * Get revenue analytics
   */
  static async getRevenueAnalytics(): Promise<RevenueAnalytics> {
    try {
      const currentYear = new Date().getFullYear()
      const currentMonth = new Date().getMonth() + 1

      // Get all confirmed/completed bookings
      const { data: bookings, error } = await supabaseAdmin
        .from('bookings')
        .select(`
          totalPrice,
          createdAt,
          accommodation:accommodations(name)
        `)
        .in('status', ['CONFIRMED', 'COMPLETED'])

      if (error) throw error

      const totalRevenue = bookings?.reduce((sum, b) => sum + b.totalPrice, 0) || 0
      
      const monthlyRevenue = bookings?.filter(b => {
        const bookingDate = new Date(b.createdAt)
        return bookingDate.getFullYear() === currentYear && bookingDate.getMonth() + 1 === currentMonth
      }).reduce((sum, b) => sum + b.totalPrice, 0) || 0

      const yearlyRevenue = bookings?.filter(b => {
        const bookingDate = new Date(b.createdAt)
        return bookingDate.getFullYear() === currentYear
      }).reduce((sum, b) => sum + b.totalPrice, 0) || 0

      const averageBookingValue = totalRevenue / (bookings?.length || 1)

      // Revenue by month
      const revenueByMonth = this.groupRevenueByMonth(bookings || [])

      // Revenue by accommodation
      const revenueByAccommodation = this.groupRevenueByAccommodation(bookings || [], totalRevenue)

      return {
        totalRevenue,
        monthlyRevenue,
        yearlyRevenue,
        averageBookingValue,
        revenueByMonth,
        revenueByAccommodation
      }

    } catch (error) {
      console.error('Error getting revenue analytics:', error)
      return {
        totalRevenue: 0,
        monthlyRevenue: 0,
        yearlyRevenue: 0,
        averageBookingValue: 0,
        revenueByMonth: [],
        revenueByAccommodation: []
      }
    }
  }

  /**
   * Get quote analytics
   */
  static async getQuoteAnalytics(): Promise<QuoteAnalytics> {
    try {
      const { data: quotes, error } = await supabaseAdmin
        .from('quotes')
        .select('status, total, convertedToInvoiceId')

      if (error) throw error

      const totalQuotes = quotes?.length || 0
      const sentQuotes = quotes?.filter(q => q.status === 'SENT').length || 0
      const acceptedQuotes = quotes?.filter(q => q.status === 'ACCEPTED').length || 0
      const convertedQuotes = quotes?.filter(q => q.convertedToInvoiceId).length || 0

      const quoteConversionRate = totalQuotes > 0 ? (acceptedQuotes / totalQuotes) * 100 : 0
      const averageQuoteValue = quotes?.reduce((sum, q) => sum + q.total, 0) / totalQuotes || 0
      const quoteToInvoiceConversionRate = acceptedQuotes > 0 ? (convertedQuotes / acceptedQuotes) * 100 : 0

      return {
        totalQuotes,
        sentQuotes,
        acceptedQuotes,
        convertedQuotes,
        quoteConversionRate,
        averageQuoteValue,
        quoteToInvoiceConversionRate
      }

    } catch (error) {
      console.error('Error getting quote analytics:', error)
      return {
        totalQuotes: 0,
        sentQuotes: 0,
        acceptedQuotes: 0,
        convertedQuotes: 0,
        quoteConversionRate: 0,
        averageQuoteValue: 0,
        quoteToInvoiceConversionRate: 0
      }
    }
  }

  /**
   * Helper method to calculate occupancy rate
   */
  private static calculateOccupancyRate(totalNights: number): number {
    // Simplified calculation - in reality you'd need to know available nights
    const daysInYear = 365
    return Math.min((totalNights / daysInYear) * 100, 100)
  }

  /**
   * Helper method to group revenue by month
   */
  private static groupRevenueByMonth(bookings: any[]): Array<{ month: string; revenue: number; bookings: number }> {
    const monthMap = new Map<string, { revenue: number; bookings: number }>()

    bookings.forEach(booking => {
      const date = new Date(booking.createdAt)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      const existing = monthMap.get(monthKey) || { revenue: 0, bookings: 0 }
      monthMap.set(monthKey, {
        revenue: existing.revenue + booking.totalPrice,
        bookings: existing.bookings + 1
      })
    })

    return Array.from(monthMap.entries()).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      bookings: data.bookings
    })).sort((a, b) => a.month.localeCompare(b.month))
  }

  /**
   * Helper method to group revenue by accommodation
   */
  private static groupRevenueByAccommodation(bookings: any[], totalRevenue: number): Array<{ accommodationName: string; revenue: number; percentage: number }> {
    const accommodationMap = new Map<string, number>()

    bookings.forEach(booking => {
      const name = booking.accommodation.name
      const existing = accommodationMap.get(name) || 0
      accommodationMap.set(name, existing + booking.totalPrice)
    })

    return Array.from(accommodationMap.entries()).map(([accommodationName, revenue]) => ({
      accommodationName,
      revenue,
      percentage: totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0
    })).sort((a, b) => b.revenue - a.revenue)
  }
}
