'use client'

import React, { useState, useEffect } from 'react'
import { Download, Send, Eye, Plus, FileText, DollarSign, Clock, CheckCircle, X, Building, User, CreditCard, Users, Trash2, ArrowRight } from 'lucide-react'
import QuoteTemplate from './QuoteTemplate'
import StandaloneQuoteForm from './StandaloneQuoteForm'
import { formatCurrency } from '@/lib/currency'

interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  isCompany?: boolean
  companyName?: string
  vatNumber?: string
}

interface Accommodation {
  id: string
  name: string
  type: string
  basePrice: number
}

interface BookingForQuote {
  id: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  status: string
  customer: Customer
  accommodation: Accommodation
}

interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface Quote {
  id: string
  quoteNumber: string
  customerId: string
  bookingId?: string
  issueDate: string
  validUntil: string
  subtotal: number
  vatAmount: number
  total: number
  status: string
  notes?: string
  terms?: string
  quoteType: string
  vatEnabled: boolean
  depositAmount: number
  depositPercentage: number
  breakageDeposit: number
  convertedToInvoiceId?: string
  createdAt: string
  updatedAt: string
  customer: Customer
  booking?: BookingForQuote
  lineItems: LineItem[]
}

export default function QuoteManagement() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [showQuotePreview, setShowQuotePreview] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showNewQuoteModal, setShowNewQuoteModal] = useState(false)
  const [availableBookings, setAvailableBookings] = useState<BookingForQuote[]>([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [availableCustomers, setAvailableCustomers] = useState<Customer[]>([])
  const [loadingCustomers, setLoadingCustomers] = useState(false)
  const [quoteMode, setQuoteMode] = useState<'selection' | 'booking' | 'standalone'>('selection')
  const [preFilledBookingData, setPreFilledBookingData] = useState<Record<string, unknown> | undefined>(undefined)
  const [showStandaloneForm, setShowStandaloneForm] = useState(false)

  useEffect(() => {
    fetchQuotes()
    fetchAvailableBookings()
  }, [])

  const fetchQuotes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/quotes')
      const data = await response.json()
      setQuotes(Array.isArray(data) ? data : data.quotes || [])
    } catch (error) {
      console.error('Error fetching quotes:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableBookings = async () => {
    try {
      setLoadingBookings(true)
      const response = await fetch('/api/bookings?status=CONFIRMED')
      const data = await response.json()
      
      if (Array.isArray(data)) {
        // Filter out bookings that already have quotes
        const existingQuoteBookingIds = quotes
          .filter(quote => quote.bookingId)
          .map(quote => quote.bookingId)
        
        const availableBookings = data.filter(booking => 
          !existingQuoteBookingIds.includes(booking.id)
        )
        setAvailableBookings(availableBookings)
      }
    } catch (error) {
      console.error('Error fetching available bookings:', error)
    } finally {
      setLoadingBookings(false)
    }
  }

  const fetchAvailableCustomers = async () => {
    try {
      setLoadingCustomers(true)
      const response = await fetch('/api/customers')
      const data = await response.json()
      setAvailableCustomers(Array.isArray(data) ? data : data.customers || [])
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoadingCustomers(false)
    }
  }

  const handleNewQuoteClick = () => {
    setShowNewQuoteModal(true)
    setQuoteMode('selection')
    setPreFilledBookingData(undefined)
    setShowStandaloneForm(false)
    fetchAvailableCustomers()
  }

  const handleCreateQuoteFromBooking = async (booking: BookingForQuote) => {
    setActionLoading(booking.id)
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: booking.id,
          quoteType: booking.accommodation.type === 'Whale House' ? 'whale-house' : 'manta-house',
          vatEnabled: true,
          deposit: {
            percentage: 50,
            amount: booking.totalPrice * 0.5
          }
        }),
      })

      if (response.ok) {
        const newQuote = await response.json()
        await fetchQuotes()
        await fetchAvailableBookings()
        setShowNewQuoteModal(false)
        setSelectedQuote(newQuote)
        setShowQuotePreview(true)
        alert('Quote generated successfully!')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating quote:', error)
      alert('Failed to create quote')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCreateStandaloneQuote = async (quoteData: Record<string, unknown>) => {
    setActionLoading('standalone')
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteData),
      })

      if (response.ok) {
        const newQuote = await response.json()
        await fetchQuotes()
        setShowNewQuoteModal(false)
        setSelectedQuote(newQuote)
        setShowQuotePreview(true)
        alert('Quote created successfully!')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating quote:', error)
      alert('Failed to create quote')
    } finally {
      setActionLoading(null)
    }
  }

  const handleConvertToInvoice = async (quoteId: string) => {
    if (!confirm('Are you sure you want to convert this quote to an invoice? This action cannot be undone.')) {
      return
    }

    setActionLoading(quoteId)
    try {
      const response = await fetch(`/api/quotes/${quoteId}/convert`, {
        method: 'POST',
      })

      if (response.ok) {
        const result = await response.json()
        await fetchQuotes()

        // Show success message and offer to navigate to the invoice
        const navigateToInvoice = confirm(`Quote converted to invoice successfully!\nInvoice Number: ${result.invoice.invoiceNumber}\n\nWould you like to view the new invoice?`)

        if (navigateToInvoice) {
          window.location.href = `/admin/invoices/${result.invoice.id}`
        }
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error converting quote:', error)
      alert('Failed to convert quote to invoice')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteQuote = async (quoteId: string) => {
    if (!confirm('Are you sure you want to delete this quote? This action cannot be undone.')) {
      return
    }

    setActionLoading(quoteId)
    try {
      const response = await fetch(`/api/quotes/${quoteId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchQuotes()
        alert('Quote deleted successfully!')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting quote:', error)
      alert('Failed to delete quote. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleUpdateQuoteStatus = async (quoteId: string, status: string) => {
    setActionLoading(quoteId)
    try {
      const response = await fetch(`/api/quotes/${quoteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        await fetchQuotes()
        alert(`Quote status updated to ${status}`)
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating quote status:', error)
      alert('Failed to update quote status')
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800'
      case 'SENT': return 'bg-blue-100 text-blue-800'
      case 'ACCEPTED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'EXPIRED': return 'bg-yellow-100 text-yellow-800'
      case 'CONVERTED': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const isQuoteExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date()
  }

  // Calculate stats
  const totalQuotes = quotes.length
  const sentQuotes = quotes.filter(quote => quote.status === 'SENT').length
  const acceptedQuotes = quotes.filter(quote => quote.status === 'ACCEPTED').length
  const expiredQuotes = quotes.filter(quote => 
    quote.status !== 'CONVERTED' && isQuoteExpired(quote.validUntil)
  ).length
  const totalQuoteValue = quotes
    .filter(quote => quote.status === 'ACCEPTED' || quote.status === 'CONVERTED')
    .reduce((sum, quote) => sum + quote.total, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2 text-gray-600">Loading quotes...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center">
            <FileText className="w-5 h-5 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-purple-800">Total Quotes</p>
              <p className="text-2xl font-bold text-purple-900">{totalQuotes}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <Send className="w-5 h-5 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-800">Sent Quotes</p>
              <p className="text-2xl font-bold text-blue-900">{sentQuotes}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-800">Accepted Quotes</p>
              <p className="text-2xl font-bold text-green-900">{acceptedQuotes}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 text-amber-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-amber-800">Quote Value</p>
              <p className="text-2xl font-bold text-amber-900">{formatCurrency(totalQuoteValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Quote Management</h2>
          <div className="flex space-x-3">
            <button
              onClick={handleNewQuoteClick}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Quote</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quote #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Until</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{quote.quoteNumber}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(quote.issueDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {quote.customer.isCompany ? (
                        <Building className="w-4 h-4 text-gray-400 mr-2" />
                      ) : (
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {quote.customer.isCompany
                            ? quote.customer.companyName
                            : `${quote.customer.firstName} ${quote.customer.lastName}`
                          }
                        </div>
                        <div className="text-sm text-gray-500">{quote.customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {quote.booking?.accommodation?.name || quote.quoteType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    {quote.booking && (
                      <div className="text-sm text-gray-500">
                        {new Date(quote.booking.checkIn).toLocaleDateString()} - {new Date(quote.booking.checkOut).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(quote.total)}</div>
                    <div className="text-sm text-gray-500">
                      Subtotal: {formatCurrency(quote.subtotal)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(quote.status)}`}>
                      {quote.status}
                    </span>
                    {isQuoteExpired(quote.validUntil) && quote.status !== 'CONVERTED' && (
                      <div className="text-xs text-red-600 mt-1">Expired</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${isQuoteExpired(quote.validUntil) ? 'text-red-600' : 'text-gray-900'}`}>
                      {new Date(quote.validUntil).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {Math.ceil((new Date(quote.validUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => {
                        setSelectedQuote(quote)
                        setShowQuotePreview(true)
                      }}
                      className="text-purple-600 hover:text-purple-900"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {quote.status === 'DRAFT' && (
                      <button
                        onClick={() => handleUpdateQuoteStatus(quote.id, 'SENT')}
                        disabled={actionLoading === quote.id}
                        className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    )}

                    {(quote.status === 'SENT' || quote.status === 'ACCEPTED') && !quote.convertedToInvoiceId && (
                      <button
                        onClick={() => handleConvertToInvoice(quote.id)}
                        disabled={actionLoading === quote.id}
                        className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        title="Convert to Invoice"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}

                    {!quote.convertedToInvoiceId && (
                      <button
                        onClick={() => handleDeleteQuote(quote.id)}
                        disabled={actionLoading === quote.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        title="Delete Quote"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {quotes.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No quotes found</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first quote.</p>
              <button
                onClick={handleNewQuoteClick}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create Quote</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quote Preview Modal */}
      {showQuotePreview && selectedQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quote Preview</h3>
              <button
                onClick={() => setShowQuotePreview(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <QuoteTemplate quoteData={selectedQuote} preview={true} />
            </div>
          </div>
        </div>
      )}

      {/* New Quote Modal */}
      {showNewQuoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Create New Quote</h3>
              <button
                onClick={() => setShowNewQuoteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              {showStandaloneForm || preFilledBookingData ? (
                <StandaloneQuoteForm
                  customers={availableCustomers}
                  onSubmit={handleCreateStandaloneQuote}
                  onCancel={() => {
                    setShowStandaloneForm(false)
                    setPreFilledBookingData(undefined)
                    setQuoteMode('selection')
                  }}
                  loading={actionLoading === 'standalone'}
                  preFilledData={preFilledBookingData}
                />
              ) : quoteMode === 'selection' ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Choose Quote Type</h4>
                    <p className="text-gray-600">Select how you&apos;d like to create your quote</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Quote from Booking Option */}
                    <button
                      onClick={() => setQuoteMode('booking')}
                      disabled={!Array.isArray(availableBookings) || availableBookings.length === 0}
                      className="p-6 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <div className="text-center">
                        <CreditCard className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                        <h5 className="text-lg font-medium text-gray-900 mb-2">Quote from Booking</h5>
                        <p className="text-sm text-gray-600 mb-4">
                          Create quotes for confirmed bookings that need pricing
                        </p>
                        <div className="text-sm font-medium text-purple-600">
                          {Array.isArray(availableBookings) ? availableBookings.length : 0} bookings available
                        </div>
                      </div>
                    </button>

                    {/* Standalone Quote Option */}
                    <button
                      onClick={() => setShowStandaloneForm(true)}
                      className="p-6 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
                    >
                      <div className="text-center">
                        <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                        <h5 className="text-lg font-medium text-gray-900 mb-2">Standalone Quote</h5>
                        <p className="text-sm text-gray-600 mb-4">
                          Create custom quotes for any customer or service
                        </p>
                        <div className="text-sm font-medium text-purple-600">
                          Full customization available
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Select a confirmed booking to create a quote:</h4>
                    <button
                      onClick={() => setQuoteMode('selection')}
                      className="text-purple-600 hover:text-purple-800 text-sm"
                    >
                      ← Back to options
                    </button>
                  </div>
                  {Array.isArray(availableBookings) && availableBookings.map(booking => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <h5 className="font-medium text-gray-900">{booking.customer.firstName} {booking.customer.lastName}</h5>
                              <p className="text-sm text-gray-600">{booking.customer.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-900">{booking.accommodation.name}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-900">{formatCurrency(booking.totalPrice)}</p>
                              <p className="text-sm text-gray-600">{booking.guests} guests</p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCreateQuoteFromBooking(booking)}
                          disabled={actionLoading === booking.id}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2"
                        >
                          {actionLoading === booking.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                          <span>Create Quote</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {(!Array.isArray(availableBookings) || availableBookings.length === 0) && (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No confirmed bookings available for quotes.</p>
                      <button
                        onClick={() => setShowStandaloneForm(true)}
                        className="mt-4 text-purple-600 hover:text-purple-800"
                      >
                        Create a standalone quote instead →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
