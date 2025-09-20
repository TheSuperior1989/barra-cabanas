'use client'

import React from 'react'

interface DocumentSettingsTestProps {
  isOpen: boolean
  onClose: () => void
}

export default function DocumentSettingsTest({ isOpen, onClose }: DocumentSettingsTestProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Document Settings (Test)</h2>
        <p className="text-gray-600 mb-4">This is a test version of the settings modal.</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  )
}
