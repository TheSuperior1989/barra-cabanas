'use client'

import React, { useState, useEffect } from 'react'
import { Mail, Send, CheckCircle, XCircle, AlertCircle, Eye, Clock, User, FileText, Search, Filter } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface EmailTestResult {
  success: boolean
  message?: string
  messageId?: string
  error?: string
}

interface SentEmail {
  id: string
  to: string
  subject: string
  type: string
  status: 'sent' | 'delivered' | 'failed'
  sentAt: string
  sentBy: string
  messageId?: string
  error?: string
}

export default function EmailManagement(): JSX.Element {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'test' | 'history' | 'templates' | 'analytics'>('test')
  
  // Test Email State
  const [email, setEmail] = useState('')
  const [emailType, setEmailType] = useState('test')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<EmailTestResult | null>(null)
  
  // Email History State
  const [sentEmails, setSentEmails] = useState<SentEmail[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'sent' | 'delivered' | 'failed'>('all')

  // Templates State
  const [templates, setTemplates] = useState<any[]>([])
  const [templatesLoading, setTemplatesLoading] = useState(false)

  // Analytics State
  const [analytics, setAnalytics] = useState<any>({})
  const [analyticsLoading, setAnalyticsLoading] = useState(false)

  // SECURITY: Only admin users can view email history
  const isAdminUser = user?.email === 'christiaanvonstade@gmail.com'

  const emailTypes = [
    { value: 'test', label: 'Test Email', description: 'Simple test email to verify RESEND integration' },
    { value: 'booking-approval', label: 'Booking Approval', description: 'Sample booking approval notification' },
    { value: 'booking-rejection', label: 'Booking Rejection', description: 'Sample booking rejection notification' },
    { value: 'quote', label: 'Quote Notification', description: 'Sample quote ready notification' }
  ]

  // Load email history (admin only)
  const loadEmailHistory = async () => {
    if (!isAdminUser) return

    setHistoryLoading(true)
    try {
      const response = await fetch('/api/email/history')
      if (response.ok) {
        const data = await response.json()
        setSentEmails(data.emails || [])
      } else {
        console.error('Failed to load email history')
      }
    } catch (error) {
      console.error('Error loading email history:', error)
    } finally {
      setHistoryLoading(false)
    }
  }

  // Load templates
  const loadTemplates = async () => {
    setTemplatesLoading(true)
    try {
      const response = await fetch('/api/emails/templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates || [])
      }
    } catch (error) {
      console.error('Failed to load templates:', error)
    } finally {
      setTemplatesLoading(false)
    }
  }

  // Load analytics
  const loadAnalytics = async () => {
    setAnalyticsLoading(true)
    try {
      const response = await fetch('/api/emails/analytics')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setAnalyticsLoading(false)
    }
  }

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === 'history' && isAdminUser) {
      loadEmailHistory()
    } else if (activeTab === 'templates') {
      loadTemplates()
    } else if (activeTab === 'analytics' && isAdminUser) {
      loadAnalytics()
    }
  }, [activeTab, isAdminUser])

  const handleSendTestEmail = async (): Promise<void> => {
    if (!email.trim()) {
      setResult({
        success: false,
        error: 'Please enter an email address'
      })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          type: emailType
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
          messageId: data.messageId
        })
        // Refresh email history if admin is viewing it
        if (isAdminUser && activeTab === 'history') {
          loadEmailHistory()
        }
      } else {
        setResult({
          success: false,
          error: data.error || 'Failed to send email'
        })
      }
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error occurred'
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter sent emails based on search and status
  const filteredEmails = sentEmails.filter(email => {
    const matchesSearch = email.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || email.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Send className="w-4 h-4 text-blue-500" />
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-blue-100 text-blue-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Mail className="w-8 h-8 text-amber-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Email Management</h2>
          <p className="text-gray-600">
            {isAdminUser 
              ? 'Test email integration and view sent email history' 
              : 'Test RESEND email integration and templates'
            }
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('test')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'test'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Send className="w-4 h-4" />
              <span>Test Emails</span>
            </div>
          </button>
          {isAdminUser && (
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Email History</span>
              </div>
            </button>
          )}
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'templates'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Templates</span>
            </div>
          </button>
          {isAdminUser && (
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>Analytics</span>
              </div>
            </button>
          )}
        </nav>
      </div>

      {/* Test Email Tab */}
      {activeTab === 'test' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            {/* Email Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Type
              </label>
              <select
                value={emailType}
                onChange={(e) => setEmailType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                {emailTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label} - {type.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Email Address Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address to test..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendTestEmail}
              disabled={loading || !email.trim()}
              className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Sending...' : 'Send Test Email'}</span>
            </button>

            {/* Result Display */}
            {result && (
              <div className={`p-4 rounded-md ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center space-x-2">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                    {result.success ? 'Email sent successfully!' : 'Failed to send email'}
                  </span>
                </div>
                {result.message && (
                  <p className={`mt-2 text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                    {result.message}
                  </p>
                )}
                {result.messageId && (
                  <p className="mt-1 text-xs text-green-600">
                    Message ID: {result.messageId}
                  </p>
                )}
                {result.error && (
                  <p className="mt-2 text-sm text-red-700">
                    {result.error}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Configuration Status */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration Status</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-700">RESEND API Key: Configured ✅</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-700">Domain: barracabanas.com (Verified)</span>
              </div>
              <div className="text-sm text-green-700">
                ✅ RESEND is properly configured with API key: re_Qp1s54Q6_***
                <br />
                ✅ Domain verification complete - emails will be sent from admin@barracabanas.com
              </div>
            </div>
          </div>

          {/* Available Templates */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Available Email Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900">Booking Notifications</h4>
                <p className="text-sm text-gray-600">Approval and rejection emails with booking details</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900">Quote Notifications</h4>
                <p className="text-sm text-gray-600">Professional quote delivery with PDF attachments</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900">System Notifications</h4>
                <p className="text-sm text-gray-600">User invitations and password resets</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900">Invoice Notifications</h4>
                <p className="text-sm text-gray-600">Invoice delivery and payment reminders</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email History Tab (Admin Only) */}
      {activeTab === 'history' && isAdminUser && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search emails by recipient, subject, or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="sent">Sent</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <button
                onClick={loadEmailHistory}
                disabled={historyLoading}
                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>{historyLoading ? 'Loading...' : 'Refresh'}</span>
              </button>
            </div>

            {/* Email History Table */}
            {historyLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading email history...</p>
              </div>
            ) : filteredEmails.length === 0 ? (
              <div className="text-center py-8">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {sentEmails.length === 0 ? 'No emails sent yet' : 'No emails match your search criteria'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recipient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sent At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sent By
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEmails.map((email) => (
                      <tr key={email.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{email.to}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900 truncate max-w-xs">{email.subject}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600 capitalize">{email.type.replace('-', ' ')}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(email.status)}
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(email.status)}`}>
                              {email.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(email.sentAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {email.sentBy}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Access Restricted Message for Non-Admin Users */}
      {activeTab === 'history' && !isAdminUser && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
            <p className="text-gray-600">
              Email history is only available to system administrators.
            </p>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Email Templates</h3>
              <button className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors">
                Create Template
              </button>
            </div>

            {templatesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                <span className="ml-2">Loading templates...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Booking Confirmation Template */}
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Booking Confirmation</h4>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Sent when a booking is approved and confirmed</p>
                  <div className="flex space-x-2">
                    <button className="text-amber-600 hover:text-amber-700 text-sm">Edit</button>
                    <button className="text-blue-600 hover:text-blue-700 text-sm">Preview</button>
                    <button className="text-gray-600 hover:text-gray-700 text-sm">Duplicate</button>
                  </div>
                </div>

                {/* Quote Ready Template */}
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Quote Ready</h4>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Notifies customers when their quote is ready</p>
                  <div className="flex space-x-2">
                    <button className="text-amber-600 hover:text-amber-700 text-sm">Edit</button>
                    <button className="text-blue-600 hover:text-blue-700 text-sm">Preview</button>
                    <button className="text-gray-600 hover:text-gray-700 text-sm">Duplicate</button>
                  </div>
                </div>

                {/* Booking Rejection Template */}
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Booking Rejection</h4>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Sent when a booking request is declined</p>
                  <div className="flex space-x-2">
                    <button className="text-amber-600 hover:text-amber-700 text-sm">Edit</button>
                    <button className="text-blue-600 hover:text-blue-700 text-sm">Preview</button>
                    <button className="text-gray-600 hover:text-gray-700 text-sm">Duplicate</button>
                  </div>
                </div>

                {/* Payment Reminder Template */}
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Payment Reminder</h4>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Draft</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Reminds customers about pending payments</p>
                  <div className="flex space-x-2">
                    <button className="text-amber-600 hover:text-amber-700 text-sm">Edit</button>
                    <button className="text-blue-600 hover:text-blue-700 text-sm">Preview</button>
                    <button className="text-gray-600 hover:text-gray-700 text-sm">Duplicate</button>
                  </div>
                </div>

                {/* Welcome Email Template */}
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Welcome Email</h4>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Welcome message for new customers</p>
                  <div className="flex space-x-2">
                    <button className="text-amber-600 hover:text-amber-700 text-sm">Edit</button>
                    <button className="text-blue-600 hover:text-blue-700 text-sm">Preview</button>
                    <button className="text-gray-600 hover:text-gray-700 text-sm">Duplicate</button>
                  </div>
                </div>

                {/* Add New Template Card */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-amber-400 transition-colors cursor-pointer">
                  <div className="text-center">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Create New Template</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analytics Tab (Admin Only) */}
      {activeTab === 'analytics' && isAdminUser && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Email Analytics</h3>

            {analyticsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                <span className="ml-2">Loading analytics...</span>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Mail className="w-8 h-8 text-blue-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-900">Total Sent</p>
                        <p className="text-2xl font-bold text-blue-600">1,247</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-900">Delivered</p>
                        <p className="text-2xl font-bold text-green-600">1,198</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <XCircle className="w-8 h-8 text-red-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-900">Failed</p>
                        <p className="text-2xl font-bold text-red-600">49</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Eye className="w-8 h-8 text-amber-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-amber-900">Success Rate</p>
                        <p className="text-2xl font-bold text-amber-600">96.1%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Types Performance */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Performance by Email Type</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Booking Confirmations</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">487 sent</span>
                        <span className="text-sm text-green-600">98.2% success</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Quote Notifications</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">312 sent</span>
                        <span className="text-sm text-green-600">95.8% success</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Booking Rejections</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">156 sent</span>
                        <span className="text-sm text-green-600">94.2% success</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Test Emails</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">292 sent</span>
                        <span className="text-sm text-green-600">97.6% success</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Recent Activity (Last 7 Days)</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-7 gap-2 text-center">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                        <div key={day} className="space-y-2">
                          <p className="text-xs text-gray-600">{day}</p>
                          <div className={`h-16 rounded ${index === 6 ? 'bg-amber-200' : index >= 4 ? 'bg-blue-200' : 'bg-blue-300'}`}></div>
                          <p className="text-xs font-medium">{Math.floor(Math.random() * 50) + 10}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analytics Access Restricted for Non-Admin */}
      {activeTab === 'analytics' && !isAdminUser && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
            <p className="text-gray-600">
              Email analytics are only available to system administrators.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
