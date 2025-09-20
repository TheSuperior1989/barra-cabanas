'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, Download, Save, X, Calendar, User, DollarSign, MapPin } from 'lucide-react'
import { formatCurrency } from '@/lib/currency'

interface SearchFilters {
  searchTerm: string
  status: string[]
  accommodationType: string[]
  dateRange: {
    start: string
    end: string
  }
  priceRange: {
    min: number
    max: number
  }
  guestCount: {
    min: number
    max: number
  }
  customerType: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

interface SavedFilter {
  id: string
  name: string
  filters: SearchFilters
  createdAt: string
}

interface AdvancedBookingSearchProps {
  onFiltersChange: (filters: SearchFilters) => void
  onExport: (format: 'csv' | 'excel' | 'pdf') => void
  totalResults: number
}

export default function AdvancedBookingSearch({ 
  onFiltersChange, 
  onExport, 
  totalResults 
}: AdvancedBookingSearchProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([])
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [filterName, setFilterName] = useState('')

  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    status: [],
    accommodationType: [],
    dateRange: {
      start: '',
      end: ''
    },
    priceRange: {
      min: 0,
      max: 10000
    },
    guestCount: {
      min: 1,
      max: 20
    },
    customerType: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  useEffect(() => {
    onFiltersChange(filters)
  }, [filters, onFiltersChange])

  useEffect(() => {
    loadSavedFilters()
  }, [])

  const loadSavedFilters = async () => {
    try {
      const response = await fetch('/api/search/saved-filters')
      if (response.ok) {
        const data = await response.json()
        setSavedFilters(data)
      }
    } catch (error) {
      console.error('Error loading saved filters:', error)
    }
  }

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleArrayFilterChange = (key: keyof SearchFilters, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [key]: checked 
        ? [...(prev[key] as string[]), value]
        : (prev[key] as string[]).filter(item => item !== value)
    }))
  }

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      status: [],
      accommodationType: [],
      dateRange: {
        start: '',
        end: ''
      },
      priceRange: {
        min: 0,
        max: 10000
      },
      guestCount: {
        min: 1,
        max: 20
      },
      customerType: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
  }

  const saveCurrentFilters = async () => {
    if (!filterName.trim()) return

    try {
      const response = await fetch('/api/search/saved-filters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: filterName,
          filters
        }),
      })

      if (response.ok) {
        await loadSavedFilters()
        setShowSaveModal(false)
        setFilterName('')
        alert('Filter saved successfully!')
      }
    } catch (error) {
      console.error('Error saving filter:', error)
      alert('Failed to save filter')
    }
  }

  const loadSavedFilter = (savedFilter: SavedFilter) => {
    setFilters(savedFilter.filters)
    setShowFilters(false)
  }

  const deleteSavedFilter = async (filterId: string) => {
    if (!confirm('Are you sure you want to delete this saved filter?')) return

    try {
      const response = await fetch(`/api/search/saved-filters/${filterId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await loadSavedFilters()
        alert('Filter deleted successfully!')
      }
    } catch (error) {
      console.error('Error deleting filter:', error)
      alert('Failed to delete filter')
    }
  }

  const statusOptions = [
    { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'CONFIRMED', label: 'Confirmed', color: 'bg-green-100 text-green-800' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    { value: 'COMPLETED', label: 'Completed', color: 'bg-blue-100 text-blue-800' }
  ]

  const accommodationOptions = [
    { value: 'whale-house', label: 'Whale House' },
    { value: 'manta-house', label: 'Manta House' }
  ]

  const sortOptions = [
    { value: 'createdAt', label: 'Date Created' },
    { value: 'checkIn', label: 'Check-in Date' },
    { value: 'checkOut', label: 'Check-out Date' },
    { value: 'totalPrice', label: 'Total Price' },
    { value: 'guests', label: 'Guest Count' },
    { value: 'customer.lastName', label: 'Customer Name' }
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      {/* Search Bar */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search bookings by customer name, email, or booking ID..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            showFilters ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>

        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Clear
        </button>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          {totalResults} booking{totalResults !== 1 ? 's' : ''} found
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Sort Controls */}
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                Sort by {option.label}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
            className="text-sm px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
          >
            {filters.sortOrder === 'asc' ? '↑' : '↓'}
          </button>

          {/* Export Options */}
          <div className="relative group">
            <button className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-1">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => onExport('csv')}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
              >
                Export as CSV
              </button>
              <button
                onClick={() => onExport('excel')}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
              >
                Export as Excel
              </button>
              <button
                onClick={() => onExport('pdf')}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
              >
                Export as PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="space-y-2">
                {statusOptions.map(status => (
                  <label key={status.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status.value)}
                      onChange={(e) => handleArrayFilterChange('status', status.value, e.target.checked)}
                      className="mr-2"
                    />
                    <span className={`px-2 py-1 text-xs rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Accommodation Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Accommodation</label>
              <div className="space-y-2">
                {accommodationOptions.map(accommodation => (
                  <label key={accommodation.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.accommodationType.includes(accommodation.value)}
                      onChange={(e) => handleArrayFilterChange('accommodationType', accommodation.value, e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">{accommodation.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  placeholder="Start date"
                />
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  placeholder="End date"
                />
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="space-y-2">
                <input
                  type="number"
                  value={filters.priceRange.min}
                  onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, min: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  placeholder="Min price"
                />
                <input
                  type="number"
                  value={filters.priceRange.max}
                  onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, max: parseInt(e.target.value) || 10000 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  placeholder="Max price"
                />
              </div>
            </div>

            {/* Guest Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Guest Count</label>
              <div className="space-y-2">
                <input
                  type="number"
                  value={filters.guestCount.min}
                  onChange={(e) => handleFilterChange('guestCount', { ...filters.guestCount, min: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  placeholder="Min guests"
                  min="1"
                />
                <input
                  type="number"
                  value={filters.guestCount.max}
                  onChange={(e) => handleFilterChange('guestCount', { ...filters.guestCount, max: parseInt(e.target.value) || 20 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  placeholder="Max guests"
                  min="1"
                />
              </div>
            </div>

            {/* Customer Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer Type</label>
              <select
                value={filters.customerType}
                onChange={(e) => handleFilterChange('customerType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              >
                <option value="">All Customers</option>
                <option value="individual">Individual</option>
                <option value="company">Company</option>
              </select>
            </div>
          </div>

          {/* Saved Filters */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700">Saved Filters</h4>
              <button
                onClick={() => setShowSaveModal(true)}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center space-x-1"
              >
                <Save className="w-3 h-3" />
                <span>Save Current</span>
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {savedFilters.map(savedFilter => (
                <div key={savedFilter.id} className="flex items-center bg-gray-100 rounded-lg px-3 py-1">
                  <button
                    onClick={() => loadSavedFilter(savedFilter)}
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    {savedFilter.name}
                  </button>
                  <button
                    onClick={() => deleteSavedFilter(savedFilter.id)}
                    className="ml-2 text-gray-400 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Save Filter Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Save Filter</h3>
            <input
              type="text"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Enter filter name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={saveCurrentFilters}
                disabled={!filterName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
