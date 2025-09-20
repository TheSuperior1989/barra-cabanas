'use client'

import React, { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Plus, Trash2, Calculator, ToggleLeft, ToggleRight } from 'lucide-react'
import {
  calculateInvoiceTotals,
  calculateLineItemTotal,
  formatCurrency,
  parseDecimal
} from '@/lib/currency'

interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  isCompany?: boolean
  companyName?: string
  vatNumber?: string
}

type QuoteType = 'whale-house' | 'manta-house'

interface QuoteFormData {
  customerId: string
  issueDate: string
  validUntil: string
  notes: string
  terms: string
  lineItems: LineItem[]
  quoteType: QuoteType
  vatEnabled: boolean
  breakageDeposit: number
  depositPercentage: number
}

interface StandaloneQuoteFormProps {
  customers: Customer[]
  onSubmit: (data: Record<string, unknown>) => void
  onCancel: () => void
  loading?: boolean
  preFilledData?: Record<string, unknown>
}

export default function StandaloneQuoteForm({
  customers,
  onSubmit,
  onCancel,
  loading = false,
  preFilledData
}: StandaloneQuoteFormProps) {
  const [subtotal, setSubtotal] = useState(0)
  const [vatAmount, setVatAmount] = useState(0)
  const [total, setTotal] = useState(0)
  const [quoteType, setQuoteType] = useState<QuoteType>('whale-house')
  const [vatEnabled, setVatEnabled] = useState(true)

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<QuoteFormData>({
    defaultValues: preFilledData || {
      customerId: '',
      issueDate: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      notes: '',
      terms: 'This quote is valid for 7 days from the issue date. Prices are subject to change after the validity period.',
      lineItems: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
      quoteType: 'whale-house',
      vatEnabled: true,
      breakageDeposit: 0,
      depositPercentage: 50
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lineItems'
  })

  const watchedLineItems = watch('lineItems')

  useEffect(() => {
    calculateTotals()
  }, [watchedLineItems, vatEnabled])

  const calculateTotals = () => {
    const lineItems = watchedLineItems || []
    const calculatedSubtotal = lineItems.reduce((sum, item) => {
      const itemTotal = calculateLineItemTotal(item.quantity || 0, item.unitPrice || 0)
      return sum + itemTotal
    }, 0)

    const calculatedVatAmount = vatEnabled ? calculatedSubtotal * 0.15 : 0 // 15% VAT
    const calculatedTotal = calculatedSubtotal + calculatedVatAmount

    setSubtotal(calculatedSubtotal)
    setVatAmount(calculatedVatAmount)
    setTotal(calculatedTotal)

    // Update line item totals
    lineItems.forEach((item, index) => {
      const itemTotal = calculateLineItemTotal(item.quantity || 0, item.unitPrice || 0)
      setValue(`lineItems.${index}.total`, itemTotal)
    })
  }

  const handleFormSubmit = (data: QuoteFormData) => {
    // Filter out empty line items
    const filteredLineItems = data.lineItems.filter(item =>
      item.description.trim() !== ''
    )

    const quoteData = {
      ...data,
      subtotal,
      vatAmount,
      total,
      lineItems: filteredLineItems,
      quoteType,
      vatEnabled,
      breakageDeposit: data.breakageDeposit || 0,
      deposit: {
        percentage: data.depositPercentage || 50,
        amount: total * ((data.depositPercentage || 50) / 100)
      }
    }
    onSubmit(quoteData)
  }

  const addLineItem = () => {
    append({ id: `line-item-${Date.now()}`, description: '', quantity: 1, unitPrice: 0, total: 0 })
  }

  const removeLineItem = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Quote Settings */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quote Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quote Type Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quote Type *
              </label>
              <select
                value={quoteType}
                onChange={(e) => setQuoteType(e.target.value as QuoteType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="whale-house">Whale House</option>
                <option value="manta-house">Manta House</option>
              </select>
            </div>

            {/* VAT Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                VAT Calculation
              </label>
              <button
                type="button"
                onClick={() => setVatEnabled(!vatEnabled)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  vatEnabled 
                    ? 'bg-green-50 border-green-300 text-green-800' 
                    : 'bg-gray-50 border-gray-300 text-gray-800'
                }`}
              >
                {vatEnabled ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                <span className="text-sm font-medium">
                  {vatEnabled ? 'VAT Enabled (15%)' : 'VAT Disabled'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Customer Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer *
          </label>
          <select
            {...register('customerId', { required: 'Customer is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">Select a customer...</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.isCompany 
                  ? customer.companyName 
                  : `${customer.firstName} ${customer.lastName}`
                } - {customer.email}
              </option>
            ))}
          </select>
          {errors.customerId && (
            <p className="mt-1 text-sm text-red-600">{errors.customerId.message}</p>
          )}
        </div>

        {/* Quote Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Date *
            </label>
            <input
              type="date"
              {...register('issueDate', { required: 'Issue date is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            {errors.issueDate && (
              <p className="mt-1 text-sm text-red-600">{errors.issueDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valid Until *
            </label>
            <input
              type="date"
              {...register('validUntil', { required: 'Valid until date is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            {errors.validUntil && (
              <p className="mt-1 text-sm text-red-600">{errors.validUntil.message}</p>
            )}
          </div>
        </div>

        {/* Line Items */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Quote Items</h3>
            <button
              type="button"
              onClick={addLineItem}
              className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    {...register(`lineItems.${index}.description` as const)}
                    placeholder="Item description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    {...register(`lineItems.${index}.quantity` as const, {
                      valueAsNumber: true,
                      min: 1
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    {...register(`lineItems.${index}.unitPrice` as const, {
                      valueAsNumber: true,
                      min: 0
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium">
                    {formatCurrency(calculateLineItemTotal(
                      watchedLineItems[index]?.quantity || 0,
                      watchedLineItems[index]?.unitPrice || 0
                    ))}
                  </div>
                </div>

                <div className="col-span-1">
                  <button
                    type="button"
                    onClick={() => removeLineItem(index)}
                    disabled={fields.length === 1}
                    className="p-2 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Display */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal:</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              {vatEnabled && (
                <div className="flex justify-between">
                  <span className="font-medium">VAT (15%):</span>
                  <span className="font-medium">{formatCurrency(vatAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Deposit Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deposit Percentage
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="5"
              {...register('depositPercentage', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Breakage Deposit
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              {...register('breakageDeposit', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Additional notes for the quote..."
          />
        </div>

        {/* Terms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Terms and Conditions
          </label>
          <textarea
            {...register('terms')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Terms and conditions for this quote..."
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2"
          >
            {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
            <span>Create Quote</span>
          </button>
        </div>
      </form>
    </div>
  )
}
