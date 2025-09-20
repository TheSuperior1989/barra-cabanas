'use client'

import React, { useState, useEffect } from 'react'
import { X, Save, Settings } from 'lucide-react'

interface DocumentSettingsProps {
  isOpen: boolean
  onClose: () => void
}

interface TermsSettings {
  invoice_terms: {
    content: string
    is_enabled: boolean
  }
  quote_terms: {
    content: string
    is_enabled: boolean
  }
}

export default function DocumentSettings({ isOpen, onClose }: DocumentSettingsProps) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('terms')
  const [termsSettings, setTermsSettings] = useState<TermsSettings>({
    invoice_terms: {
      content: '',
      is_enabled: true
    },
    quote_terms: {
      content: '',
      is_enabled: true
    }
  })

  useEffect(() => {
    if (isOpen) {
      fetchSettings()
    }
  }, [isOpen])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/settings/terms-conditions')
      if (response.ok) {
        const data = await response.json()
        setTermsSettings({
          invoice_terms: data.invoice_terms || { content: '', is_enabled: true },
          quote_terms: data.quote_terms || { content: '', is_enabled: true }
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveTermsSettings = async () => {
    setSaving(true)
    try {
      // Save invoice terms
      await fetch('/api/settings/terms-conditions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'invoice',
          content: termsSettings.invoice_terms.content,
          is_enabled: termsSettings.invoice_terms.is_enabled
        })
      })

      // Save quote terms
      await fetch('/api/settings/terms-conditions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'quote',
          content: termsSettings.quote_terms.content,
          is_enabled: termsSettings.quote_terms.is_enabled
        })
      })

      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  const updateTermsContent = (type: 'invoice_terms' | 'quote_terms', content: string) => {
    setTermsSettings(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        content
      }
    }))
  }

  const toggleTermsEnabled = (type: 'invoice_terms' | 'quote_terms') => {
    setTermsSettings(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        is_enabled: !prev[type].is_enabled
      }
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Settings className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Document Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('terms')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'terms'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => setActiveTab('banking')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'banking'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Banking Details
            </button>
            <button
              onClick={() => setActiveTab('logos')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'logos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Logo Settings
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {activeTab === 'terms' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Invoice Terms */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Invoice Terms</h3>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={termsSettings.invoice_terms.is_enabled}
                            onChange={() => toggleTermsEnabled('invoice_terms')}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-600">Enabled</span>
                        </label>
                      </div>
                      <textarea
                        value={termsSettings.invoice_terms.content}
                        onChange={(e) => updateTermsContent('invoice_terms', e.target.value)}
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter terms and conditions for invoices..."
                      />
                    </div>

                    {/* Quote Terms */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Quote Terms</h3>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={termsSettings.quote_terms.is_enabled}
                            onChange={() => toggleTermsEnabled('quote_terms')}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-600">Enabled</span>
                        </label>
                      </div>
                      <textarea
                        value={termsSettings.quote_terms.content}
                        onChange={(e) => updateTermsContent('quote_terms', e.target.value)}
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter terms and conditions for quotes..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'banking' && (
                <div className="text-center py-12 text-gray-500">
                  Banking details settings coming soon...
                </div>
              )}

              {activeTab === 'logos' && (
                <div className="text-center py-12 text-gray-500">
                  Logo settings coming soon...
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          {activeTab === 'terms' && (
            <button
              onClick={saveTermsSettings}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default DocumentSettings
