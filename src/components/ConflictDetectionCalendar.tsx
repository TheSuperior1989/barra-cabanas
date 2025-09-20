'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, AlertTriangle, CheckCircle, Clock, Users } from 'lucide-react'

interface Booking {
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

interface ConflictDetectionCalendarProps {
  accommodationId: string
  onDateSelect?: (date: string) => void
  selectedDates?: { checkIn: string; checkOut: string }
}

export default function ConflictDetectionCalendar({ 
  accommodationId, 
  onDateSelect, 
  selectedDates 
}: ConflictDetectionCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [conflicts, setConflicts] = useState<any>(null)

  useEffect(() => {
    if (accommodationId) {
      fetchBookings()
    }
  }, [accommodationId, currentMonth])

  useEffect(() => {
    if (selectedDates && selectedDates.checkIn && selectedDates.checkOut) {
      checkForConflicts()
    }
  }, [selectedDates])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
      
      const response = await fetch(
        `/api/bookings/check-conflicts?accommodationId=${accommodationId}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      )
      
      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings || [])
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkForConflicts = async () => {
    if (!selectedDates || !accommodationId) return

    try {
      const response = await fetch('/api/bookings/check-conflicts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accommodationId,
          checkIn: selectedDates.checkIn,
          checkOut: selectedDates.checkOut,
          guests: 1
        }),
      })

      if (response.ok) {
        const conflictResult = await response.json()
        setConflicts(conflictResult)
      }
    } catch (error) {
      console.error('Error checking conflicts:', error)
    }
  }

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const isDateBooked = (date: Date) => {
    return bookings.some(booking => {
      const checkIn = new Date(booking.checkIn)
      const checkOut = new Date(booking.checkOut)
      return date >= checkIn && date < checkOut
    })
  }

  const isDateSelected = (date: Date) => {
    if (!selectedDates) return false
    const checkIn = new Date(selectedDates.checkIn)
    const checkOut = new Date(selectedDates.checkOut)
    return date >= checkIn && date < checkOut
  }

  const getBookingForDate = (date: Date) => {
    return bookings.find(booking => {
      const checkIn = new Date(booking.checkIn)
      const checkOut = new Date(booking.checkOut)
      return date >= checkIn && date < checkOut
    })
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1)
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1)
      }
      return newMonth
    })
  }

  const days = getDaysInMonth()
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Booking Calendar</span>
        </h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            ←
          </button>
          <span className="font-medium">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {days.map((date, index) => {
          if (!date) {
            return <div key={index} className="p-2"></div>
          }

          const isBooked = isDateBooked(date)
          const isSelected = isDateSelected(date)
          const booking = getBookingForDate(date)
          const isPast = date < new Date()

          return (
            <div
              key={index}
              className={`
                p-2 text-center text-sm border rounded cursor-pointer relative
                ${isPast ? 'text-gray-400 bg-gray-50' : 'text-gray-900'}
                ${isBooked ? 'bg-red-100 border-red-200' : 'bg-white border-gray-200'}
                ${isSelected ? 'bg-blue-100 border-blue-300' : ''}
                ${!isPast && !isBooked ? 'hover:bg-gray-50' : ''}
              `}
              onClick={() => onDateSelect && !isPast && onDateSelect(date.toISOString().split('T')[0])}
            >
              <span>{date.getDate()}</span>
              {isBooked && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
              )}
              {booking && (
                <div className="text-xs text-red-600 truncate">
                  {booking.customer.firstName}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
            <span className="text-gray-600">Booked</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
            <span className="text-gray-600">Selected</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-white border border-gray-200 rounded"></div>
            <span className="text-gray-600">Available</span>
          </div>
        </div>
        
        {loading && (
          <div className="flex items-center space-x-1 text-gray-500">
            <Clock className="w-4 h-4 animate-spin" />
            <span>Loading...</span>
          </div>
        )}
      </div>

      {/* Conflict Alert */}
      {conflicts && conflicts.hasConflict && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-900">Booking Conflict Detected</h4>
              <p className="text-red-700 text-sm mt-1">{conflicts.message}</p>
              
              {conflicts.conflictingBookings && conflicts.conflictingBookings.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-red-900">Conflicting Bookings:</p>
                  <ul className="mt-1 space-y-1">
                    {conflicts.conflictingBookings.map((booking: any) => (
                      <li key={booking.id} className="text-sm text-red-700">
                        {booking.customer.firstName} {booking.customer.lastName} - 
                        {new Date(booking.checkIn).toLocaleDateString()} to {new Date(booking.checkOut).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {conflicts.suggestedAlternatives && conflicts.suggestedAlternatives.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-red-900">Suggested Alternative Dates:</p>
                  <ul className="mt-1 space-y-1">
                    {conflicts.suggestedAlternatives.map((alt: any, index: number) => (
                      <li key={index} className="text-sm text-red-700">
                        {new Date(alt.checkIn).toLocaleDateString()} to {new Date(alt.checkOut).toLocaleDateString()} ({alt.nights} nights)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {conflicts && !conflicts.hasConflict && selectedDates && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <h4 className="font-medium text-green-900">Dates Available</h4>
              <p className="text-green-700 text-sm">{conflicts.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
