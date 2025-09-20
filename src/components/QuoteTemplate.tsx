'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { Download, Send, Print } from 'lucide-react'
import ReactPDFQuote from './ReactPDFQuote'
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
  registrationNumber?: string
  address?: string
  city?: string
  country?: string
  postalCode?: string
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
  lineItems: LineItem[]
}

type QuoteType = 'whale-house' | 'manta-house'

interface QuoteTemplateProps {
  quoteData: Quote
  preview?: boolean
}

export default function QuoteTemplate({ quoteData, preview = true }: QuoteTemplateProps) {
  const quoteRef = useRef<HTMLDivElement>(null)
  const [quoteType, setQuoteType] = useState<QuoteType>(
    (quoteData.quoteType as QuoteType) || 'whale-house'
  )
  const [vatEnabled, setVatEnabled] = useState(
    quoteData.vatEnabled !== undefined ? quoteData.vatEnabled : true
  )

  // Business information based on quote type
  const getBusinessInfo = () => {
    if (quoteType === 'whale-house') {
      return {
        name: 'Whale House',
        logo: '/whale-house-logo.svg',
        address: 'Barra Cabanas, Inhambane, Mozambique',
        phone: '+258 84 123 4567',
        email: 'info@whalehouse.co.mz',
        website: 'www.whalehouse.co.mz',
        vatNumber: 'VAT: 123456789',
        bankDetails: {
          bank: 'Standard Bank Mozambique',
          account: '123456789',
          branch: 'Inhambane Branch'
        }
      }
    } else {
      return {
        name: 'Manta House',
        logo: '/manta-house-logo.svg',
        address: 'Barra Cabanas, Inhambane, Mozambique',
        phone: '+258 84 987 6543',
        email: 'info@mantahouse.co.mz',
        website: 'www.mantahouse.co.mz',
        vatNumber: 'VAT: 987654321',
        bankDetails: {
          bank: 'Standard Bank Mozambique',
          account: '987654321',
          branch: 'Inhambane Branch'
        }
      }
    }
  }

  const businessInfo = getBusinessInfo()

  const handlePrint = () => {
    window.print()
  }

  const calculateTotals = () => {
    const subtotal = quoteData.lineItems.reduce((sum, item) => sum + item.total, 0)
    const vatAmount = vatEnabled ? subtotal * 0.15 : 0 // 15% VAT
    const total = subtotal + vatAmount
    
    return { subtotal, vatAmount, total }
  }

  const totals = calculateTotals()

  // Check if quote is expired
  const isExpired = new Date(quoteData.validUntil) < new Date()

  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* Actions Bar (only in preview mode) */}
      {preview && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
          {/* First Row - Quote Type and VAT */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Quote Type:</label>
              <select
                value={quoteType}
                onChange={(e) => setQuoteType(e.target.value as QuoteType)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="whale-house">Whale House</option>
                <option value="manta-house">Manta House</option>
              </select>
              
              <label className="text-sm font-medium text-gray-700">VAT:</label>
              <button
                onClick={() => setVatEnabled(!vatEnabled)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  vatEnabled 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-gray-100 text-gray-800 border border-gray-300'
                }`}
              >
                {vatEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <ReactPDFQuote quoteData={quoteData} />
              <button 
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <Print className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                <Send className="w-4 h-4" />
                <span>Send to Client</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quote Document */}
      <div ref={quoteRef} className="bg-white border-2 border-black p-8 font-sans quote-document">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8 quote-header">
          {/* Logo */}
          <div className="w-64 h-64">
            <Image
              src={businessInfo.logo}
              alt={`${quoteType === 'whale-house' ? 'Whale House' : 'Manta House'} Logo`}
              width={256}
              height={256}
              className="object-contain"
            />
          </div>

          {/* Quote Title and Number */}
          <div className="text-right">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">QUOTE</h1>
            <div className="text-xl font-semibold text-gray-700">
              Quote #: {quoteData.quoteNumber}
            </div>
            {isExpired && (
              <div className="text-lg font-bold text-red-600 mt-2">
                EXPIRED
              </div>
            )}
          </div>
        </div>

        {/* Business and Customer Information */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* From Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">FROM:</h3>
            <div className="space-y-1 text-sm">
              <div className="font-semibold text-lg">{businessInfo.name}</div>
              <div>{businessInfo.address}</div>
              <div>Phone: {businessInfo.phone}</div>
              <div>Email: {businessInfo.email}</div>
              <div>Website: {businessInfo.website}</div>
              <div>{businessInfo.vatNumber}</div>
            </div>
          </div>

          {/* To Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">TO:</h3>
            <div className="space-y-1 text-sm">
              <div className="font-semibold text-lg">
                {quoteData.customer.isCompany 
                  ? quoteData.customer.companyName 
                  : `${quoteData.customer.firstName} ${quoteData.customer.lastName}`
                }
              </div>
              {quoteData.customer.address && <div>{quoteData.customer.address}</div>}
              {quoteData.customer.city && (
                <div>
                  {quoteData.customer.city}
                  {quoteData.customer.postalCode && `, ${quoteData.customer.postalCode}`}
                </div>
              )}
              {quoteData.customer.country && <div>{quoteData.customer.country}</div>}
              <div>Email: {quoteData.customer.email}</div>
              {quoteData.customer.phone && <div>Phone: {quoteData.customer.phone}</div>}
              {quoteData.customer.vatNumber && <div>VAT: {quoteData.customer.vatNumber}</div>}
            </div>
          </div>
        </div>

        {/* Quote Details */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="font-semibold text-gray-700">Quote Date:</h4>
            <p className="text-gray-900">{new Date(quoteData.issueDate).toLocaleDateString()}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700">Valid Until:</h4>
            <p className={`${isExpired ? 'text-red-600 font-bold' : 'text-gray-900'}`}>
              {new Date(quoteData.validUntil).toLocaleDateString()}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700">Status:</h4>
            <p className="text-gray-900 font-semibold">{quoteData.status}</p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="mb-8">
          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 px-4 py-3 text-left font-semibold">Description</th>
                <th className="border border-gray-400 px-4 py-3 text-center font-semibold w-20">Qty</th>
                <th className="border border-gray-400 px-4 py-3 text-right font-semibold w-32">Unit Price</th>
                <th className="border border-gray-400 px-4 py-3 text-right font-semibold w-32">Total</th>
              </tr>
            </thead>
            <tbody>
              {quoteData.lineItems.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-400 px-4 py-3">{item.description}</td>
                  <td className="border border-gray-400 px-4 py-3 text-center">{item.quantity}</td>
                  <td className="border border-gray-400 px-4 py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="border border-gray-400 px-4 py-3 text-right font-semibold">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-300">
                <span className="font-semibold">Subtotal:</span>
                <span className="font-semibold">{formatCurrency(totals.subtotal)}</span>
              </div>
              
              {vatEnabled && (
                <div className="flex justify-between py-2 border-b border-gray-300">
                  <span className="font-semibold">VAT (15%):</span>
                  <span className="font-semibold">{formatCurrency(totals.vatAmount)}</span>
                </div>
              )}
              
              <div className="flex justify-between py-3 border-t-2 border-gray-400 text-xl">
                <span className="font-bold">TOTAL:</span>
                <span className="font-bold">{formatCurrency(totals.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Deposit Information */}
        {quoteData.depositAmount > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <h4 className="font-semibold text-blue-900 mb-2">Deposit Required:</h4>
            <p className="text-blue-800">
              A deposit of {formatCurrency(quoteData.depositAmount)} ({quoteData.depositPercentage}% of total) 
              is required to confirm this booking.
            </p>
          </div>
        )}

        {/* Notes */}
        {quoteData.notes && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-2">Notes:</h4>
            <p className="text-gray-600 whitespace-pre-wrap">{quoteData.notes}</p>
          </div>
        )}

        {/* Terms and Conditions */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-2">Terms and Conditions:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            {quoteData.terms ? (
              <p className="whitespace-pre-wrap">{quoteData.terms}</p>
            ) : (
              <>
                <p>• This quote is valid until {new Date(quoteData.validUntil).toLocaleDateString()}</p>
                <p>• Prices are subject to change after the validity period</p>
                <p>• A deposit may be required to confirm booking</p>
                <p>• Cancellation policy applies as per our standard terms</p>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 border-t border-gray-300 pt-4">
          <p>Thank you for considering {businessInfo.name} for your accommodation needs.</p>
          <p>We look forward to hosting you!</p>
        </div>
      </div>
    </div>
  )
}
