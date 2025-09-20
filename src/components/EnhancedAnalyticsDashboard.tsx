'use client'

import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Users, 
  Home, 
  FileText,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw
} from 'lucide-react'
import { formatCurrency } from '@/lib/currency'

interface AnalyticsData {
  bookingTrends: Array<{
    date: string
    bookings: number
    revenue: number
    averageBookingValue: number
  }>
  accommodationPerformance: Array<{
    accommodationId: string
    accommodationName: string
    totalBookings: number
    totalRevenue: number
    averageBookingValue: number
    occupancyRate: number
    averageStayDuration: number
  }>
  customerAnalytics: {
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
  revenueAnalytics: {
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
  quoteAnalytics: {
    totalQuotes: number
    sentQuotes: number
    acceptedQuotes: number
    convertedQuotes: number
    quoteConversionRate: number
    averageQuoteValue: number
    quoteToInvoiceConversionRate: number
  }
}

export default function EnhancedAnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/analytics?type=${activeTab}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
      )
      
      if (response.ok) {
        const data = await response.json()
        setAnalyticsData(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateTrend = (current: number, previous: number): { value: number; isPositive: boolean } => {
    if (previous === 0) return { value: 0, isPositive: true }
    const trend = ((current - previous) / previous) * 100
    return { value: Math.abs(trend), isPositive: trend >= 0 }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading analytics...</span>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No analytics data available</p>
        <button
          onClick={fetchAnalytics}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Date Range and Refresh */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(analyticsData.revenueAnalytics.totalRevenue)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">
              Monthly: {formatCurrency(analyticsData.revenueAnalytics.monthlyRevenue)}
            </span>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.bookingTrends.reduce((sum, trend) => sum + trend.bookings, 0)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <Activity className="w-4 h-4 text-blue-500 mr-1" />
            <span className="text-sm text-blue-600">
              Avg Value: {formatCurrency(analyticsData.revenueAnalytics.averageBookingValue)}
            </span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.customerAnalytics.totalCustomers}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
            <span className="text-sm text-purple-600">
              New this month: {analyticsData.customerAnalytics.newCustomersThisMonth}
            </span>
          </div>
        </div>

        {/* Quote Conversion */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Quote Conversion</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.quoteAnalytics.quoteConversionRate.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <BarChart3 className="w-4 h-4 text-orange-500 mr-1" />
            <span className="text-sm text-orange-600">
              {analyticsData.quoteAnalytics.totalQuotes} total quotes
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Month Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
          <div className="space-y-3">
            {analyticsData.revenueAnalytics.revenueByMonth.slice(-6).map((month, index) => (
              <div key={month.month} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{month.month}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ 
                        width: `${(month.revenue / Math.max(...analyticsData.revenueAnalytics.revenueByMonth.map(m => m.revenue))) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-20 text-right">
                    {formatCurrency(month.revenue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accommodation Performance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Accommodation Performance</h3>
          <div className="space-y-4">
            {analyticsData.accommodationPerformance.map((accommodation) => (
              <div key={accommodation.accommodationId} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{accommodation.accommodationName}</h4>
                  <span className="text-sm text-gray-500">{accommodation.totalBookings} bookings</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Revenue:</span>
                    <span className="ml-2 font-medium">{formatCurrency(accommodation.totalRevenue)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Avg Value:</span>
                    <span className="ml-2 font-medium">{formatCurrency(accommodation.averageBookingValue)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Occupancy:</span>
                    <span className="ml-2 font-medium">{accommodation.occupancyRate.toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Avg Stay:</span>
                    <span className="ml-2 font-medium">{accommodation.averageStayDuration.toFixed(1)} nights</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Customers by Revenue</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Booking Value</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData.customerAnalytics.topCustomersByRevenue.slice(0, 10).map((customer) => (
                <tr key={customer.customerId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.totalBookings}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(customer.totalRevenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(customer.totalRevenue / customer.totalBookings)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quote Analytics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quote Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{analyticsData.quoteAnalytics.totalQuotes}</div>
            <div className="text-sm text-gray-600">Total Quotes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {analyticsData.quoteAnalytics.quoteConversionRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Conversion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {formatCurrency(analyticsData.quoteAnalytics.averageQuoteValue)}
            </div>
            <div className="text-sm text-gray-600">Average Quote Value</div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-lg font-semibold text-gray-900">{analyticsData.quoteAnalytics.sentQuotes}</div>
            <div className="text-sm text-gray-600">Sent</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-lg font-semibold text-green-900">{analyticsData.quoteAnalytics.acceptedQuotes}</div>
            <div className="text-sm text-green-600">Accepted</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-lg font-semibold text-blue-900">{analyticsData.quoteAnalytics.convertedQuotes}</div>
            <div className="text-sm text-blue-600">Converted</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-lg font-semibold text-purple-900">
              {analyticsData.quoteAnalytics.quoteToInvoiceConversionRate.toFixed(1)}%
            </div>
            <div className="text-sm text-purple-600">Quote→Invoice</div>
          </div>
        </div>
      </div>
    </div>
  )
}
