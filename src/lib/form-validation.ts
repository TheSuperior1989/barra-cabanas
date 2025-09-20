import { z } from 'zod'

/**
 * Common validation schemas
 */

// Email validation
export const emailSchema = z.string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required')

// Phone validation (international format)
export const phoneSchema = z.string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number')
  .optional()

// Name validation
export const nameSchema = z.string()
  .min(1, 'Name is required')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')

// Date validation
export const dateSchema = z.string()
  .refine((date) => !isNaN(Date.parse(date)), 'Please enter a valid date')

// Future date validation
export const futureDateSchema = z.string()
  .refine((date) => !isNaN(Date.parse(date)), 'Please enter a valid date')
  .refine((date) => new Date(date) > new Date(), 'Date must be in the future')

// Currency amount validation
export const currencySchema = z.number()
  .min(0, 'Amount must be positive')
  .max(1000000, 'Amount is too large')

// Guest count validation
export const guestCountSchema = z.number()
  .int('Guest count must be a whole number')
  .min(1, 'At least 1 guest is required')
  .max(20, 'Maximum 20 guests allowed')

/**
 * Customer validation schemas
 */
export const customerCreateSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional()
})

export const customerUpdateSchema = customerCreateSchema.partial()

/**
 * Booking validation schemas
 */
export const bookingCreateSchema = z.object({
  customerId: z.string().uuid('Invalid customer ID'),
  accommodationId: z.string().uuid('Invalid accommodation ID'),
  checkIn: dateSchema,
  checkOut: dateSchema,
  guests: guestCountSchema,
  specialRequests: z.string().max(500, 'Special requests must be less than 500 characters').optional(),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional()
}).refine(
  (data) => new Date(data.checkOut) > new Date(data.checkIn),
  {
    message: 'Check-out date must be after check-in date',
    path: ['checkOut']
  }
).refine(
  (data) => new Date(data.checkIn) >= new Date(new Date().setHours(0, 0, 0, 0)),
  {
    message: 'Check-in date cannot be in the past',
    path: ['checkIn']
  }
)

/**
 * Quote validation schemas
 */
export const quoteCreateSchema = z.object({
  customerId: z.string().uuid('Invalid customer ID'),
  accommodationId: z.string().uuid('Invalid accommodation ID'),
  checkIn: dateSchema,
  checkOut: dateSchema,
  guests: guestCountSchema,
  baseRate: currencySchema,
  cleaningFee: currencySchema.optional(),
  securityDeposit: currencySchema.optional(),
  additionalFees: z.array(z.object({
    name: z.string().min(1, 'Fee name is required'),
    amount: currencySchema,
    description: z.string().optional()
  })).optional(),
  discounts: z.array(z.object({
    name: z.string().min(1, 'Discount name is required'),
    amount: currencySchema,
    description: z.string().optional()
  })).optional(),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
  validUntil: futureDateSchema.optional()
}).refine(
  (data) => new Date(data.checkOut) > new Date(data.checkIn),
  {
    message: 'Check-out date must be after check-in date',
    path: ['checkOut']
  }
)

/**
 * Invoice validation schemas
 */
export const invoiceCreateSchema = z.object({
  customerId: z.string().uuid('Invalid customer ID'),
  quoteId: z.string().uuid('Invalid quote ID').optional(),
  accommodationId: z.string().uuid('Invalid accommodation ID'),
  checkIn: dateSchema,
  checkOut: dateSchema,
  guests: guestCountSchema,
  baseRate: currencySchema,
  cleaningFee: currencySchema.optional(),
  securityDeposit: currencySchema.optional(),
  additionalFees: z.array(z.object({
    name: z.string().min(1, 'Fee name is required'),
    amount: currencySchema,
    description: z.string().optional()
  })).optional(),
  discounts: z.array(z.object({
    name: z.string().min(1, 'Discount name is required'),
    amount: currencySchema,
    description: z.string().optional()
  })).optional(),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
  dueDate: futureDateSchema.optional()
}).refine(
  (data) => new Date(data.checkOut) > new Date(data.checkIn),
  {
    message: 'Check-out date must be after check-in date',
    path: ['checkOut']
  }
)

/**
 * User invitation validation schema
 */
export const userInvitationSchema = z.object({
  email: emailSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  role: z.enum(['ADMIN', 'MANAGER', 'GUEST'], {
    errorMap: () => ({ message: 'Role must be ADMIN, MANAGER, or GUEST' })
  })
})

/**
 * Password validation schema
 */
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

/**
 * Login validation schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
})

/**
 * Password reset validation schema
 */
export const passwordResetSchema = z.object({
  email: emailSchema
})

/**
 * Change password validation schema
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Password confirmation is required')
}).refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  }
)

/**
 * Validation helper functions
 */

/**
 * Validate data against a schema and return formatted errors
 */
export function validateSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  const errors: Record<string, string> = {}
  result.error.errors.forEach((error) => {
    const path = error.path.join('.')
    errors[path] = error.message
  })
  
  return { success: false, errors }
}

/**
 * Format validation errors for API responses
 */
export function formatValidationErrors(errors: Record<string, string>): string {
  const errorMessages = Object.entries(errors).map(([field, message]) => {
    const fieldName = field.split('.').pop() || field
    return `${fieldName}: ${message}`
  })
  
  return errorMessages.join('; ')
}

/**
 * Client-side form validation hook
 */
export function useFormValidation<T>(schema: z.ZodSchema<T>) {
  return {
    validate: (data: unknown) => validateSchema(schema, data),
    validateField: (fieldName: string, value: unknown) => {
      try {
        const fieldSchema = (schema as any).shape[fieldName]
        if (fieldSchema) {
          fieldSchema.parse(value)
          return null
        }
        return null
      } catch (error) {
        if (error instanceof z.ZodError) {
          return error.errors[0]?.message || 'Invalid value'
        }
        return 'Invalid value'
      }
    }
  }
}
