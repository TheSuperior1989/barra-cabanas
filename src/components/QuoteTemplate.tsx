'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { Download, Send, Print } from 'lucide-react'
import EmailQuoteDialog from './EmailQuoteDialog'
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
}

interface QuoteData {
  quote: Quote
  customer: Customer
  lineItems: LineItem[]
}

type QuoteType = 'whale-house' | 'manta-house'

interface QuoteTemplateProps {
  quoteData: QuoteData
  preview?: boolean
}

export default function QuoteTemplate({ quoteData, preview = true }: QuoteTemplateProps) {
  const quoteRef = useRef<HTMLDivElement>(null)
  const [quoteType, setQuoteType] = useState<QuoteType>(
    (quoteData.quote.quoteType as QuoteType) || 'whale-house'
  )
  const [vatEnabled, setVatEnabled] = useState(
    quoteData.quote.vatEnabled !== undefined ? quoteData.quote.vatEnabled : true
  )

  // Email dialog state
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)

  // Check if this is for printing (hide controls)
  const isPrintMode = typeof window !== 'undefined' && window.location.search.includes('print=true')

  // Business information based on quote type
  const getBusinessInfo = () => {
    const baseInfo = {
      companyName: 'Turbolink Property Investment Pty Ltd',
      regNumber: '2016/199275/07',
      address: 'XP Square, Shop No 9',
      city: 'Nigel, 1490',
      province: 'Gauteng',
      country: 'South Africa',
      phone: '+27 82 123 4567',
      email: 'jaco@barracabanas.co.za',
    }

    if (quoteType === 'whale-house') {
      return {
        ...baseInfo,
        tradingAs: 'T/A Whale House@Barra Cabanas',
        logo: '/whale-house-logo.svg'
      }
    } else {
      return {
        ...baseInfo,
        tradingAs: 'T/A Manta House@Barra Cabanas',
        logo: '/manta-house-logo.svg'
      }
    }
  }

  const businessInfo = getBusinessInfo()

  const handlePrint = () => {
    window.print()
  }

  // Email sending function
  const handleEmailSend = async (emailData: any) => {
    try {
      setEmailLoading(true)

      // Send the email with quote attachment
      const response = await fetch('/api/quotes/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteId: quoteData.quote.id,
          emailData
        }),
      })

      if (response.ok) {
        // The API automatically updates the quote status to 'SENT', so no need to do it manually
        setShowEmailDialog(false)
        alert('Quote sent successfully and marked as sent!')

        // Refresh the page to show updated status
        window.location.reload()
      } else {
        const error = await response.json()
        alert(`Error sending email: ${error.error}`)
      }
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Failed to send email')
    } finally {
      setEmailLoading(false)
    }
  }

  const calculateTotals = () => {
    const subtotal = quoteData.lineItems.reduce((sum, item) => sum + item.total, 0)
    const vatAmount = vatEnabled ? subtotal * 0.15 : 0 // 15% VAT
    const total = subtotal + vatAmount

    return { subtotal, vatAmount, total }
  }

  const totals = calculateTotals()

  // Check if quote is expired
  const isExpired = new Date(quoteData.quote.validUntil) < new Date()

  return (
    <>
      {/* Print Styles - EXACT COPY FROM INVOICE TEMPLATE - ADAPTED FOR QUOTES */}
      <style jsx global>{`
        @media print {
          body { margin: 0; padding: 0; }
          .no-print { display: none !important; }
          .print-page {
            width: 210mm;
            min-height: 297mm;
            margin: 0;
            padding: 8mm;
            box-shadow: none;
            position: relative;
          }

          /* ULTRA COMPACT HEADER - Much tighter spacing */
          .quote-header {
            margin-bottom: 6px !important;
            padding-bottom: 4px !important;
          }

          /* COMPANY INFO - MUCH LARGER FONTS */
          .company-info {
            line-height: 1.2 !important;
            margin-bottom: 6px !important;
          }
          .company-info h1 {
            font-size: 24px !important;
            margin-bottom: 4px !important;
            line-height: 1.2 !important;
            font-weight: bold !important;
          }
          .company-info div {
            margin: 0 !important;
            padding: 0 !important;
            font-size: 14px !important;
            line-height: 1.2 !important;
          }

          /* COMPACT BILL TO SECTION - LARGER FONTS */
          .quote-to-section {
            margin-bottom: 6px !important;
            padding: 4px 0 !important;
          }
          .quote-to-section h3 {
            font-size: 14px !important;
            margin-bottom: 2px !important;
            line-height: 1.1 !important;
            font-weight: bold !important;
          }
          .quote-to-section div {
            margin: 0 !important;
            padding: 0 !important;
            font-size: 11px !important;
            line-height: 1.1 !important;
          }

          /* QUOTE DETAILS - MUCH LARGER FONTS */
          .quote-details-table {
            margin-bottom: 8px !important;
          }
          .quote-details-table div {
            margin: 0 !important;
            padding: 2px 0 !important;
            font-size: 13px !important;
            line-height: 1.2 !important;
          }
          .quote-details-table span {
            font-size: 13px !important;
          }

          /* MOVE EVERYTHING UP MORE - Reduce all top margins */
          .quote-header + * { margin-top: 0 !important; }
          .quote-to-section + * { margin-top: 0 !important; }

          /* COMPACT LINE ITEMS TABLE - LARGER FONTS */
          .line-items-table {
            margin-bottom: 8px !important;
            margin-top: 4px !important;
          }
          .line-items-table th {
            padding: 3px 6px !important;
            font-size: 12px !important;
          }
          .line-items-table td {
            padding: 2px 6px !important;
            font-size: 11px !important;
          }

          /* COMPACT TOTALS SECTION - LARGER FONTS */
          .totals-section {
            margin-bottom: 10px !important;
          }
          .totals-row {
            margin-bottom: 2px !important;
            font-size: 12px !important;
          }
          .totals-row.total-final {
            font-size: 14px !important;
            margin-bottom: 4px !important;
          }

          /* COMPACT EXTRAS SECTION - SMALLER FONTS */
          .extras-section {
            margin-bottom: 10px !important;
            padding: 6px 0 !important;
          }
          .extras-section .extras-header {
            font-size: 10px !important;
            margin-bottom: 4px !important;
          }
          .extras-row {
            margin-bottom: 2px !important;
            font-size: 10px !important;
          }

          /* COMPACT PAYMENTS SECTION - LARGER FONTS */
          .payments-section {
            margin-bottom: 10px !important;
          }
          .payments-section h4 {
            font-size: 13px !important;
            margin-bottom: 4px !important;
          }
          .payments-section div {
            font-size: 12px !important;
          }

          /* BANKING DETAILS - ALWAYS AT BOTTOM */
          .banking-details {
            position: absolute !important;
            bottom: 10mm !important;
            left: 8mm !important;
            right: 8mm !important;
            margin: 0 !important;
            padding: 8px !important;
            font-size: 11px !important;
          }
          .banking-details h3 {
            font-size: 13px !important;
            margin-bottom: 4px !important;
            font-weight: bold !important;
          }
          .banking-details div {
            margin: 0 !important;
            line-height: 1.2 !important;
            font-size: 11px !important;
          }

          /* ENSURE MAIN CONTENT DOESN'T OVERLAP BANKING */
          .print-page {
            padding-bottom: 60px !important;
          }

          /* REMOVE MAIN QUOTE BORDER */
          .quote-document {
            border: none !important;
          }

          /* GLOBAL OVERRIDES for ultra-tight spacing */
          .space-y-1 > * + * { margin-top: 0 !important; }
          .space-y-2 > * + * { margin-top: 1px !important; }
          .mb-8 { margin-bottom: 4px !important; }
          .mb-6 { margin-bottom: 3px !important; }
          .mb-4 { margin-bottom: 2px !important; }
          .mb-3 { margin-bottom: 2px !important; }
          .mb-2 { margin-bottom: 1px !important; }
          .py-1 { padding-top: 0 !important; padding-bottom: 0 !important; }
        }
      `}</style>



      <div className={`max-w-4xl mx-auto bg-white ${isPrintMode ? 'print-page' : ''}`}>
      {/* Actions Bar (only in preview mode and not print mode) */}
      {preview && !isPrintMode && (
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

            {/* Action Buttons - FIXED: No more ReactPDFQuote */}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  // Use the same method as InvoiceTemplate - open viewable quote with print
                  const quoteUrl = `/admin/quotes/${quoteData.quote.id}?print=true&autoDownload=true`
                  window.open(quoteUrl, '_blank')
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
              <button
                onClick={() => {
                  // Use the same method as InvoiceTemplate - open viewable quote with print
                  const quoteUrl = `/admin/quotes/${quoteData.quote.id}?print=true`
                  window.open(quoteUrl, '_blank')
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <Print className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button
                onClick={() => setShowEmailDialog(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
                <span>Send to Client</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quote Document - EXACT SAME STRUCTURE AS INVOICE */}
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

          {/* Company Info - EXACT SAME AS INVOICE */}
          <div className="text-left company-info">
            <h1 className="text-xl font-bold mb-4">PRO FORMA QUOTE</h1>
            <div className="text-sm space-y-1">
              <div className="font-semibold">{businessInfo.companyName}</div>
              <div>{businessInfo.tradingAs}</div>
              <div>{businessInfo.address}</div>
              <div>{businessInfo.city}</div>
              <div>{businessInfo.province}</div>
              <div>{businessInfo.country}</div>
              <div className="mt-2">Reg No - {businessInfo.regNumber}</div>
            </div>

            {/* Quote Number and Status */}
            <div className="mt-4 text-sm">
              <div className="font-semibold">Quote #: {quoteData.quote.quoteNumber}</div>
              {isExpired && (
                <div className="text-red-600 font-bold mt-1">EXPIRED</div>
              )}
            </div>
          </div>
        </div>

        {/* Quote To and Quote Details - Match invoice layout */}
        <div className="flex justify-between mb-8 quote-to-section">
          {/* Quote To - Match invoice Bill To format */}
          <div>
            <h3 className="font-bold mb-2">Quote To:</h3>
            <div className="text-sm space-y-1">
              {quoteData.customer.isCompany ? (
                <>
                  <div className="font-medium">{quoteData.customer.companyName}</div>
                  <div>Contact: {quoteData.customer.firstName} {quoteData.customer.lastName}</div>
                </>
              ) : (
                <div className="font-medium">{quoteData.customer.firstName} {quoteData.customer.lastName}</div>
              )}
              <div>{quoteData.customer.email}</div>
              {quoteData.customer.phone && <div>{quoteData.customer.phone}</div>}
              {quoteData.customer.address && (
                <>
                  <div>{quoteData.customer.address}</div>
                  {quoteData.customer.city && <div>{quoteData.customer.city}</div>}
                  {quoteData.customer.country && <div>{quoteData.customer.country}</div>}
                </>
              )}
            </div>

          {/* Quote Details - Left Aligned to match invoice */}
          <div className="text-left text-sm quote-details-table">
            <div className="space-y-2">
              <div><span className="font-semibold">Quote #:</span> <span className="ml-4">{quoteData.quote.quoteNumber}</span></div>
              <div><span className="font-semibold">Quote Date:</span> <span className="ml-4">{new Date(quoteData.quote.issueDate).toLocaleDateString()}</span></div>
              <div><span className="font-semibold">Valid Until:</span> <span className={`ml-4 ${isExpired ? 'text-red-600 font-bold' : ''}`}>{new Date(quoteData.quote.validUntil).toLocaleDateString()}</span></div>
              <div><span className="font-semibold">Status:</span> <span className="ml-4">{quoteData.quote.status}</span></div>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="mb-8 line-items-table">
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

        {/* Totals Section - Right Aligned to match invoice */}
        <div className="flex justify-end mb-6 totals-section">
          <div className="w-80">
            <div className="space-y-2">
              <div className="flex justify-between py-1 totals-row">
                <span className="font-semibold">Subtotal:</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              {vatEnabled && (
                <div className="flex justify-between py-1 totals-row">
                  <span className="font-semibold">VAT (15%):</span>
                  <span>{formatCurrency(totals.vatAmount)}</span>
                </div>
              )}

              <div className="flex justify-between py-2 border-t border-black totals-row total-final">
                <span className="font-bold">Total:</span>
                <span className="font-bold">{formatCurrency(totals.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Deposit Information */}
        {quoteData.quote.depositAmount > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded extras-section">
            <h4 className="font-semibold text-blue-900 mb-2">Deposit Required:</h4>
            <p className="text-blue-800">
              A deposit of {formatCurrency(quoteData.quote.depositAmount)} ({quoteData.quote.depositPercentage}% of total)
              is required to confirm this booking.
            </p>
          </div>
        )}

        {/* Notes */}
        {quoteData.quote.notes && (
          <div className="mb-6 notes-section">
            <h4 className="font-semibold text-gray-700 mb-2">Notes:</h4>
            <p className="text-gray-600 whitespace-pre-wrap">{quoteData.quote.notes}</p>
          </div>
        )}

        {/* Terms and Conditions */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-2">Terms and Conditions:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            {quoteData.quote.terms ? (
              <p className="whitespace-pre-wrap">{quoteData.quote.terms}</p>
            ) : (
              <>
                <p>• This quote is valid until {new Date(quoteData.quote.validUntil).toLocaleDateString()}</p>
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

    {/* Email Quote Dialog */}
    <EmailQuoteDialog
      isOpen={showEmailDialog}
      onClose={() => setShowEmailDialog(false)}
      onSend={handleEmailSend}
      quote={{
        id: quoteData.quote.id,
        quoteNumber: quoteData.quote.quoteNumber,
        issueDate: quoteData.quote.issueDate,
        validUntil: quoteData.quote.validUntil,
        subtotal: quoteData.quote.subtotal,
        vatAmount: quoteData.quote.vatAmount,
        total: quoteData.quote.total,
        status: quoteData.quote.status,
        notes: quoteData.quote.notes,
        terms: quoteData.quote.terms,
        quoteType: quoteData.quote.quoteType,
        vatEnabled: quoteData.quote.vatEnabled,
        breakageDeposit: quoteData.quote.breakageDeposit,
        customer: quoteData.customer
      }}
      loading={emailLoading}
    />
    </>
  )
}
