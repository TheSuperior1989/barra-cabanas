/**
 * Production-Ready Logging System
 * 
 * Replaces console.log statements with structured logging
 * that's appropriate for production environments.
 */

import { envValidator } from './env-validation'

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: string
  data?: any
  error?: Error
}

interface LoggerConfig {
  level: LogLevel
  enableConsole: boolean
  enableFile: boolean
  enableExternal: boolean
}

class Logger {
  private static instance: Logger
  private config: LoggerConfig

  constructor() {
    const isDevelopment = envValidator.isDevelopment()
    
    this.config = {
      level: isDevelopment ? LogLevel.DEBUG : LogLevel.INFO,
      enableConsole: isDevelopment,
      enableFile: false, // Could be enabled for production file logging
      enableExternal: false // Could be enabled for external logging services
    }
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.config.level
  }

  private formatMessage(entry: LogEntry): string {
    const levelName = LogLevel[entry.level]
    let message = `[${entry.timestamp}] ${levelName}: ${entry.message}`
    
    if (entry.context) {
      message += ` (${entry.context})`
    }
    
    return message
  }

  private log(level: LogLevel, message: string, context?: string, data?: any, error?: Error): void {
    if (!this.shouldLog(level)) {
      return
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      data,
      error
    }

    // Console logging (development)
    if (this.config.enableConsole) {
      const formattedMessage = this.formatMessage(entry)
      
      switch (level) {
        case LogLevel.ERROR:
          console.error(formattedMessage, data, error)
          break
        case LogLevel.WARN:
          console.warn(formattedMessage, data)
          break
        case LogLevel.INFO:
          console.info(formattedMessage, data)
          break
        case LogLevel.DEBUG:
          console.debug(formattedMessage, data)
          break
      }
    }

    // File logging (production)
    if (this.config.enableFile) {
      // TODO: Implement file logging for production
      // This would write to a log file or send to a logging service
    }

    // External logging service (production)
    if (this.config.enableExternal) {
      // TODO: Implement external logging (e.g., Sentry, LogRocket, etc.)
    }
  }

  error(message: string, context?: string, data?: any, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, data, error)
  }

  warn(message: string, context?: string, data?: any): void {
    this.log(LogLevel.WARN, message, context, data)
  }

  info(message: string, context?: string, data?: any): void {
    this.log(LogLevel.INFO, message, context, data)
  }

  debug(message: string, context?: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, context, data)
  }

  // Convenience methods for common use cases
  auth(message: string, data?: any): void {
    this.info(message, 'AUTH', data)
  }

  api(message: string, data?: any): void {
    this.info(message, 'API', data)
  }

  database(message: string, data?: any): void {
    this.info(message, 'DATABASE', data)
  }

  email(message: string, data?: any): void {
    this.info(message, 'EMAIL', data)
  }

  security(message: string, data?: any): void {
    this.warn(message, 'SECURITY', data)
  }

  performance(message: string, data?: any): void {
    this.debug(message, 'PERFORMANCE', data)
  }

  // Error handling helpers
  logError(error: Error, context?: string, additionalData?: any): void {
    this.error(error.message, context, additionalData, error)
  }

  logApiError(endpoint: string, error: Error, requestData?: any): void {
    this.error(
      `API Error on ${endpoint}: ${error.message}`,
      'API',
      { endpoint, requestData },
      error
    )
  }

  logDatabaseError(operation: string, error: Error, query?: any): void {
    this.error(
      `Database Error during ${operation}: ${error.message}`,
      'DATABASE',
      { operation, query },
      error
    )
  }

  // Request logging
  logRequest(method: string, path: string, userId?: string, duration?: number): void {
    this.info(
      `${method} ${path}`,
      'REQUEST',
      { userId, duration: duration ? `${duration}ms` : undefined }
    )
  }

  // Authentication logging
  logLogin(email: string, success: boolean, reason?: string): void {
    if (success) {
      this.auth(`Login successful for ${email}`)
    } else {
      this.security(`Login failed for ${email}: ${reason}`)
    }
  }

  logLogout(email: string): void {
    this.auth(`Logout for ${email}`)
  }

  // Business logic logging
  logInvoiceCreated(invoiceId: string, customerId: string, amount: number): void {
    this.info(
      `Invoice created: ${invoiceId}`,
      'BUSINESS',
      { customerId, amount }
    )
  }

  logBookingStatusChange(bookingId: string, oldStatus: string, newStatus: string): void {
    this.info(
      `Booking status changed: ${bookingId}`,
      'BUSINESS',
      { oldStatus, newStatus }
    )
  }

  logEmailSent(to: string, subject: string, success: boolean): void {
    if (success) {
      this.email(`Email sent to ${to}: ${subject}`)
    } else {
      this.error(`Failed to send email to ${to}: ${subject}`, 'EMAIL')
    }
  }
}

// Export singleton instance
export const logger = Logger.getInstance()

// Export types
export type { LogEntry, LoggerConfig }
