import { NextResponse } from 'next/server'
import { logger } from './logger'

/**
 * Standard API error response format
 */
export interface ApiErrorResponse {
  error: {
    code: string
    message: string
    details?: Record<string, any>
    timestamp: string
    requestId?: string
  }
}

/**
 * Standard API success response format
 */
export interface ApiSuccessResponse<T = any> {
  data: T
  message?: string
  timestamp: string
  requestId?: string
}

/**
 * Error types for consistent error handling
 */
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  CONFLICT = 'CONFLICT',
  RATE_LIMITED = 'RATE_LIMITED',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR'
}

/**
 * Custom API error class
 */
export class ApiError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly details?: Record<string, any>

  constructor(
    code: string,
    message: string,
    statusCode: number,
    details?: Record<string, any>
  ) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.statusCode = statusCode
    this.details = details
  }

  static validation(message: string, details?: Record<string, any>): ApiError {
    return new ApiError(ErrorType.VALIDATION_ERROR, message, 400, details)
  }

  static notFound(message: string = 'Resource not found'): ApiError {
    return new ApiError(ErrorType.NOT_FOUND, message, 404)
  }

  static unauthorized(message: string = 'Unauthorized'): ApiError {
    return new ApiError(ErrorType.UNAUTHORIZED, message, 401)
  }

  static forbidden(message: string = 'Forbidden'): ApiError {
    return new ApiError(ErrorType.FORBIDDEN, message, 403)
  }

  static conflict(message: string, details?: Record<string, any>): ApiError {
    return new ApiError(ErrorType.CONFLICT, message, 409, details)
  }

  static database(message: string, details?: Record<string, any>): ApiError {
    return new ApiError(ErrorType.DATABASE_ERROR, message, 500, details)
  }

  static internal(message: string = 'Internal server error'): ApiError {
    return new ApiError(ErrorType.INTERNAL_SERVER_ERROR, message, 500)
  }
}

/**
 * Generate a unique request ID for tracing
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Standardized error handler for API routes
 */
export function handleApiError(
  error: unknown,
  context: string,
  requestId?: string
): NextResponse<ApiErrorResponse> {
  const id = requestId || generateRequestId()
  
  // Log the error with context
  logger.error('API Error', {
    context,
    requestId: id,
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : error
  })

  // Handle known API errors
  if (error instanceof ApiError) {
    return NextResponse.json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        timestamp: new Date().toISOString(),
        requestId: id
      }
    }, { status: error.statusCode })
  }

  // Handle Supabase errors
  if (error && typeof error === 'object' && 'code' in error) {
    const supabaseError = error as any
    
    // Map common Supabase error codes
    switch (supabaseError.code) {
      case 'PGRST116':
        return NextResponse.json({
          error: {
            code: ErrorType.NOT_FOUND,
            message: 'Resource not found',
            timestamp: new Date().toISOString(),
            requestId: id
          }
        }, { status: 404 })
      
      case '23505': // Unique constraint violation
        return NextResponse.json({
          error: {
            code: ErrorType.CONFLICT,
            message: 'Resource already exists',
            details: { constraint: supabaseError.constraint },
            timestamp: new Date().toISOString(),
            requestId: id
          }
        }, { status: 409 })
      
      case '23503': // Foreign key constraint violation
        return NextResponse.json({
          error: {
            code: ErrorType.VALIDATION_ERROR,
            message: 'Invalid reference to related resource',
            details: { constraint: supabaseError.constraint },
            timestamp: new Date().toISOString(),
            requestId: id
          }
        }, { status: 400 })
      
      default:
        return NextResponse.json({
          error: {
            code: ErrorType.DATABASE_ERROR,
            message: 'Database operation failed',
            details: process.env.NODE_ENV === 'development' ? {
              code: supabaseError.code,
              message: supabaseError.message
            } : undefined,
            timestamp: new Date().toISOString(),
            requestId: id
          }
        }, { status: 500 })
    }
  }

  // Handle generic errors
  const message = error instanceof Error ? error.message : 'Unknown error occurred'
  
  return NextResponse.json({
    error: {
      code: ErrorType.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? { originalMessage: message } : undefined,
      timestamp: new Date().toISOString(),
      requestId: id
    }
  }, { status: 500 })
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  requestId?: string
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({
    data,
    message,
    timestamp: new Date().toISOString(),
    requestId: requestId || generateRequestId()
  })
}

/**
 * Validation helper for request bodies
 */
export function validateRequired(
  data: Record<string, any>,
  requiredFields: string[]
): void {
  const missing = requiredFields.filter(field => 
    data[field] === undefined || data[field] === null || data[field] === ''
  )
  
  if (missing.length > 0) {
    throw ApiError.validation(
      `Missing required fields: ${missing.join(', ')}`,
      { missingFields: missing }
    )
  }
}

/**
 * Email validation helper
 */
export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw ApiError.validation('Invalid email format')
  }
}

/**
 * Date validation helper
 */
export function validateDate(dateString: string, fieldName: string): Date {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    throw ApiError.validation(`Invalid date format for ${fieldName}`)
  }
  return date
}
