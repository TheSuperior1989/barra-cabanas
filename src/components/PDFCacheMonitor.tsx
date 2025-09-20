'use client'

import React, { useState, useEffect } from 'react'
import { RefreshCw, Trash2, BarChart3, FileText, Quote } from 'lucide-react'

interface CacheStats {
  invoices: { total: number; cached: number; cacheRate: number }
  quotes: { total: number; cached: number; cacheRate: number }
  summary: { totalDocuments: number; totalCached: number; overallCacheRate: number }
}

export default function PDFCacheMonitor() {
  const [stats, setStats] = useState<CacheStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [clearing, setClearing] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/pdf-cache')
      const data = await response.json()
      
      if (data.success) {
        setStats({
          invoices: data.stats.invoices,
          quotes: data.stats.quotes,
          summary: data.summary
        })
      } else {
        console.error('Failed to fetch cache stats:', data.error)
      }
    } catch (error) {
      console.error('Error fetching cache stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearCache = async (type: 'invoices' | 'quotes' | 'all') => {
    try {
      setClearing(type)
      const response = await fetch(`/api/admin/pdf-cache?type=${type}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert(data.message)
        await fetchStats() // Refresh stats
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error clearing cache:', error)
      alert('Failed to clear cache')
    } finally {
      setClearing(null)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold">PDF Cache Performance</h3>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold">PDF Cache Performance</h3>
        </div>
        <p className="text-red-600">Failed to load cache statistics</p>
      </div>
    )
  }

  const formatPercentage = (rate: number) => `${rate.toFixed(1)}%`

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold">PDF Cache Performance</h3>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Overall Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Total Documents</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{stats.summary.totalDocuments}</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Cached PDFs</span>
          </div>
          <div className="text-2xl font-bold text-green-900">{stats.summary.totalCached}</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <RefreshCw className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Cache Rate</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">
            {formatPercentage(stats.summary.overallCacheRate)}
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Invoices */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <FileText className="w-4 h-4 text-blue-600" />
            <h4 className="font-semibold">Invoices</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total:</span>
              <span className="font-medium">{stats.invoices.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Cached:</span>
              <span className="font-medium">{stats.invoices.cached}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Cache Rate:</span>
              <span className="font-medium text-green-600">
                {formatPercentage(stats.invoices.cacheRate)}
              </span>
            </div>
          </div>
          <button
            onClick={() => clearCache('invoices')}
            disabled={clearing === 'invoices'}
            className="mt-3 w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{clearing === 'invoices' ? 'Clearing...' : 'Clear Invoice Cache'}</span>
          </button>
        </div>

        {/* Quotes */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Quote className="w-4 h-4 text-purple-600" />
            <h4 className="font-semibold">Quotes</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total:</span>
              <span className="font-medium">{stats.quotes.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Cached:</span>
              <span className="font-medium">{stats.quotes.cached}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Cache Rate:</span>
              <span className="font-medium text-green-600">
                {formatPercentage(stats.quotes.cacheRate)}
              </span>
            </div>
          </div>
          <button
            onClick={() => clearCache('quotes')}
            disabled={clearing === 'quotes'}
            className="mt-3 w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{clearing === 'quotes' ? 'Clearing...' : 'Clear Quote Cache'}</span>
          </button>
        </div>
      </div>

      {/* Clear All Button */}
      <div className="border-t pt-4">
        <button
          onClick={() => clearCache('all')}
          disabled={clearing === 'all'}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          <span>{clearing === 'all' ? 'Clearing All Caches...' : 'Clear All PDF Caches'}</span>
        </button>
        <p className="text-xs text-gray-500 mt-2 text-center">
          This will force regeneration of all PDFs on next access
        </p>
      </div>
    </div>
  )
}
