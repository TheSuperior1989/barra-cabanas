'use client'

import React, { useState } from 'react'
import { Mail, Send, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react'

interface EmailTestResult {
  success: boolean
  message?: string
  messageId?: string
  error?: string
}

export default function EmailTestPanel(): JSX.Element {
  const [activeTab, setActiveTab] = useState<'test' | 'history'>('test')
  const [email, setEmail] = useState('')
  const [emailType, setEmailType] = useState('test')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<EmailTestResult | null>(null)

  // SECURITY: Only admin users can view email history
  // Use localStorage directly for more reliable admin detection
  const [isAdminUser, setIsAdminUser] = useState(false)

  // Check admin status on component mount
  React.useEffect(() => {
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        const user = JSON.parse(userData)
        const isAdmin = user?.email === 'christiaanvonstade@gmail.com'
        setIsAdminUser(isAdmin)
        console.log('🔍 EmailTestPanel - Admin check:', { email: user?.email, isAdmin })
      }
    } catch (error) {
      console.error('Error checking admin status:', error)
    }
  }, [])

  const emailTypes = [
    { value: 'test', label: 'Test Email', description: 'Simple test email to verify RESEND integration' },
    { value: 'booking-approval', label: 'Booking Approval', description: 'Sample booking approval notification' },
    { value: 'booking-rejection', label: 'Booking Rejection', description: 'Sample booking rejection notification' },
    { value: 'quote', label: 'Quote Notification', description: 'Sample quote ready notification' }
  ]

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
      } else {
        setResult({
          success: false,
          error: data.error || 'Failed to send email'
        })
      }
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error - please try again'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Mail className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Email Management</h2>
          <p className="text-sm text-gray-600">
            {isAdminUser
              ? 'Test email integration and view sent email history'
              : 'Test RESEND email integration and templates'
            }
          </p>
        </div>
      </div>

      {/* Tab Navigation (Admin Only) */}
      {isAdminUser && (
        <div className="border-b border-gray-200 mb-6">
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
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>Email History</span>
              </div>
            </button>
          </nav>
        </div>
      )}

      {/* Test Email Tab */}
      {activeTab === 'test' && (
        <div className="space-y-6">
        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Email Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Type
          </label>
          <div className="space-y-3">
            {emailTypes.map((type) => (
              <label key={type.value} className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="emailType"
                  value={type.value}
                  checked={emailType === type.value}
                  onChange={(e) => setEmailType(e.target.value)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900">{type.label}</div>
                  <div className="text-sm text-gray-600">{type.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSendTestEmail}
          disabled={loading || !email.trim()}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send Test Email</span>
            </>
          )}
        </button>

        {/* Result Display */}
        {result && (
          <div className={`p-4 rounded-lg border ${
            result.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start space-x-3">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <div className={`font-medium ${
                  result.success ? 'text-green-900' : 'text-red-900'
                }`}>
                  {result.success ? 'Email Sent Successfully!' : 'Email Failed'}
                </div>
                <div className={`text-sm mt-1 ${
                  result.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.success ? result.message : result.error}
                </div>
                {result.messageId && (
                  <div className="text-xs text-green-600 mt-2 font-mono">
                    Message ID: {result.messageId}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Configuration Status */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Configuration Status</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              {process.env.NEXT_PUBLIC_RESEND_CONFIGURED ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-600" />
              )}
              <span className="text-sm text-gray-700">
                RESEND API Key: {process.env.NEXT_PUBLIC_RESEND_CONFIGURED ? 'Configured' : 'Not Configured'}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              To configure RESEND, add your API key to the .env.local file:
              <br />
              <code className="bg-gray-100 px-1 rounded">RESEND_API_KEY=re_your_api_key_here</code>
            </div>
          </div>
        </div>

        {/* Email Templates Info */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Available Email Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="font-medium text-gray-900">Booking Notifications</div>
              <div className="text-sm text-gray-600">Approval and rejection emails with booking details</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="font-medium text-gray-900">Quote Notifications</div>
              <div className="text-sm text-gray-600">Professional quote delivery with PDF attachments</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="font-medium text-gray-900">System Notifications</div>
              <div className="text-sm text-gray-600">Account updates and system messages</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="font-medium text-gray-900">Custom Templates</div>
              <div className="text-sm text-gray-600">Customizable templates for specific needs</div>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Email History Tab (Admin Only) */}
      {activeTab === 'history' && isAdminUser && (
        <div className="space-y-6">
          <div className="text-center py-8">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Email History</h3>
            <p className="text-gray-600 mb-4">
              View and manage sent email history
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm text-blue-800">
                  Email history feature coming soon
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Access Restricted Message for Non-Admin Users */}
      {activeTab === 'history' && !isAdminUser && (
        <div className="space-y-6">
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
            <p className="text-gray-600">
              Email history is only available to system administrators.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
