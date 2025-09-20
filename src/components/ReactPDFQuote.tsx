'use client'

import React from 'react'
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { Download } from 'lucide-react'
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

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
  },
  titleSection: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  quoteNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4B5563',
  },
  expiredLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#DC2626',
    marginTop: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
    paddingBottom: 2,
  },
  addressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  addressBlock: {
    width: '45%',
  },
  addressText: {
    fontSize: 10,
    lineHeight: 1.4,
    color: '#374151',
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  detailsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailBlock: {
    width: '30%',
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 10,
    color: '#1F2937',
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderTopWidth: 0,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tableColDescription: {
    width: '50%',
    fontSize: 9,
    paddingRight: 4,
  },
  tableColQty: {
    width: '15%',
    fontSize: 9,
    textAlign: 'center',
  },
  tableColPrice: {
    width: '17.5%',
    fontSize: 9,
    textAlign: 'right',
  },
  tableColTotal: {
    width: '17.5%',
    fontSize: 9,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 9,
  },
  totalsSection: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  totalsTable: {
    width: 200,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
  },
  totalValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: 2,
    borderTopColor: '#6B7280',
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  depositSection: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    padding: 10,
    marginBottom: 15,
  },
  depositTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 4,
  },
  depositText: {
    fontSize: 9,
    color: '#1E40AF',
  },
  notesSection: {
    marginBottom: 15,
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 9,
    color: '#6B7280',
    lineHeight: 1.4,
  },
  termsSection: {
    marginBottom: 15,
  },
  termsTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  termsText: {
    fontSize: 8,
    color: '#6B7280',
    lineHeight: 1.3,
  },
  footer: {
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#D1D5DB',
    paddingTop: 10,
    marginTop: 20,
  },
  footerText: {
    fontSize: 8,
    color: '#9CA3AF',
    lineHeight: 1.3,
  },
})

// PDF Document Component
const QuotePDFDocument = ({ quoteData }: { quoteData: Quote }) => {
  const getBusinessInfo = () => {
    if (quoteData.quoteType === 'whale-house') {
      return {
        name: 'Whale House',
        address: 'Barra Cabanas, Inhambane, Mozambique',
        phone: '+258 84 123 4567',
        email: 'info@whalehouse.co.mz',
        website: 'www.whalehouse.co.mz',
        vatNumber: 'VAT: 123456789',
      }
    } else {
      return {
        name: 'Manta House',
        address: 'Barra Cabanas, Inhambane, Mozambique',
        phone: '+258 84 987 6543',
        email: 'info@mantahouse.co.mz',
        website: 'www.mantahouse.co.mz',
        vatNumber: 'VAT: 987654321',
      }
    }
  }

  const businessInfo = getBusinessInfo()
  const isExpired = new Date(quoteData.validUntil) < new Date()

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>QUOTE</Text>
            <Text style={styles.quoteNumber}>Quote #: {quoteData.quoteNumber}</Text>
            {isExpired && (
              <Text style={styles.expiredLabel}>EXPIRED</Text>
            )}
          </View>
        </View>

        {/* Business and Customer Information */}
        <View style={styles.addressSection}>
          <View style={styles.addressBlock}>
            <Text style={styles.sectionTitle}>FROM:</Text>
            <Text style={styles.companyName}>{businessInfo.name}</Text>
            <Text style={styles.addressText}>{businessInfo.address}</Text>
            <Text style={styles.addressText}>Phone: {businessInfo.phone}</Text>
            <Text style={styles.addressText}>Email: {businessInfo.email}</Text>
            <Text style={styles.addressText}>Website: {businessInfo.website}</Text>
            <Text style={styles.addressText}>{businessInfo.vatNumber}</Text>
          </View>

          <View style={styles.addressBlock}>
            <Text style={styles.sectionTitle}>TO:</Text>
            <Text style={styles.companyName}>
              {quoteData.customer.isCompany 
                ? quoteData.customer.companyName 
                : `${quoteData.customer.firstName} ${quoteData.customer.lastName}`
              }
            </Text>
            {quoteData.customer.address && (
              <Text style={styles.addressText}>{quoteData.customer.address}</Text>
            )}
            {quoteData.customer.city && (
              <Text style={styles.addressText}>
                {quoteData.customer.city}
                {quoteData.customer.postalCode && `, ${quoteData.customer.postalCode}`}
              </Text>
            )}
            {quoteData.customer.country && (
              <Text style={styles.addressText}>{quoteData.customer.country}</Text>
            )}
            <Text style={styles.addressText}>Email: {quoteData.customer.email}</Text>
            {quoteData.customer.phone && (
              <Text style={styles.addressText}>Phone: {quoteData.customer.phone}</Text>
            )}
            {quoteData.customer.vatNumber && (
              <Text style={styles.addressText}>VAT: {quoteData.customer.vatNumber}</Text>
            )}
          </View>
        </View>

        {/* Quote Details */}
        <View style={styles.detailsSection}>
          <View style={styles.detailBlock}>
            <Text style={styles.detailLabel}>Quote Date:</Text>
            <Text style={styles.detailValue}>
              {new Date(quoteData.issueDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.detailBlock}>
            <Text style={styles.detailLabel}>Valid Until:</Text>
            <Text style={[styles.detailValue, isExpired && { color: '#DC2626', fontWeight: 'bold' }]}>
              {new Date(quoteData.validUntil).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.detailBlock}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={[styles.detailValue, { fontWeight: 'bold' }]}>{quoteData.status}</Text>
          </View>
        </View>

        {/* Line Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableColDescription, styles.tableHeaderText]}>Description</Text>
            <Text style={[styles.tableColQty, styles.tableHeaderText]}>Qty</Text>
            <Text style={[styles.tableColPrice, styles.tableHeaderText]}>Unit Price</Text>
            <Text style={[styles.tableColTotal, styles.tableHeaderText]}>Total</Text>
          </View>
          {quoteData.lineItems.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableColDescription}>{item.description}</Text>
              <Text style={styles.tableColQty}>{item.quantity}</Text>
              <Text style={styles.tableColPrice}>{formatCurrency(item.unitPrice)}</Text>
              <Text style={styles.tableColTotal}>{formatCurrency(item.total)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsTable}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalValue}>{formatCurrency(quoteData.subtotal)}</Text>
            </View>
            
            {quoteData.vatEnabled && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>VAT (15%):</Text>
                <Text style={styles.totalValue}>{formatCurrency(quoteData.vatAmount)}</Text>
              </View>
            )}
            
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>TOTAL:</Text>
              <Text style={styles.grandTotalValue}>{formatCurrency(quoteData.total)}</Text>
            </View>
          </View>
        </View>

        {/* Deposit Information */}
        {quoteData.depositAmount > 0 && (
          <View style={styles.depositSection}>
            <Text style={styles.depositTitle}>Deposit Required:</Text>
            <Text style={styles.depositText}>
              A deposit of {formatCurrency(quoteData.depositAmount)} ({quoteData.depositPercentage}% of total) 
              is required to confirm this booking.
            </Text>
          </View>
        )}

        {/* Notes */}
        {quoteData.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>Notes:</Text>
            <Text style={styles.notesText}>{quoteData.notes}</Text>
          </View>
        )}

        {/* Terms and Conditions */}
        <View style={styles.termsSection}>
          <Text style={styles.termsTitle}>Terms and Conditions:</Text>
          {quoteData.terms ? (
            <Text style={styles.termsText}>{quoteData.terms}</Text>
          ) : (
            <View>
              <Text style={styles.termsText}>
                • This quote is valid until {new Date(quoteData.validUntil).toLocaleDateString()}{'\n'}
                • Prices are subject to change after the validity period{'\n'}
                • A deposit may be required to confirm booking{'\n'}
                • Cancellation policy applies as per our standard terms
              </Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for considering {businessInfo.name} for your accommodation needs.{'\n'}
            We look forward to hosting you!
          </Text>
        </View>
      </Page>
    </Document>
  )
}

// Main Component
interface ReactPDFQuoteProps {
  quoteData: Quote
}

export default function ReactPDFQuote({ quoteData }: ReactPDFQuoteProps) {
  return (
    <PDFDownloadLink
      document={<QuotePDFDocument quoteData={quoteData} />}
      fileName={`quote-${quoteData.quoteNumber}.pdf`}
      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
    >
      {({ blob, url, loading, error }) => (
        <>
          <Download className="w-4 h-4" />
          <span>{loading ? 'Generating PDF...' : 'Download PDF'}</span>
        </>
      )}
    </PDFDownloadLink>
  )
}
