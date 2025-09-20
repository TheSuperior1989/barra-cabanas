/**
 * Production Configuration Management
 * 
 * Centralizes all configuration values and provides environment-specific
 * settings with proper fallbacks and validation.
 */

import { envValidator } from './env-validation'

interface AppConfig {
  // Environment
  environment: 'development' | 'production' | 'test'
  
  // URLs and Endpoints
  appUrl: string
  apiUrl: string
  websiteUrl: string
  
  // Database
  supabase: {
    url: string
    anonKey: string
    serviceKey: string
  }
  
  // Authentication
  auth: {
    jwtSecret: string
    sessionDuration: string
    rememberMeDuration: string
  }
  
  // Email Service
  email: {
    apiKey?: string
    fromEmail: string
    fromName: string
    isEnabled: boolean
  }
  
  // Business Settings
  business: {
    companyName: string
    companyEmail: string
    vatRate: number
    currency: string
    defaultTimezone: string
  }
  
  // Feature Flags
  features: {
    enableRealtime: boolean
    enableAnalytics: boolean
    enableNotifications: boolean
    enableFileUploads: boolean
  }
  
  // Limits and Constraints
  limits: {
    maxFileSize: number // in bytes
    maxUploadFiles: number
    apiRateLimit: number // requests per minute
    sessionTimeout: number // in minutes
  }
  
  // Logging
  logging: {
    level: 'error' | 'warn' | 'info' | 'debug'
    enableConsole: boolean
    enableFile: boolean
  }
}

class ConfigManager {
  private static instance: ConfigManager
  private config: AppConfig

  constructor() {
    const envConfig = envValidator.getConfig()
    const isDevelopment = envValidator.isDevelopment()
    const isProduction = envValidator.isProduction()

    this.config = {
      environment: envConfig.NODE_ENV,
      
      // URLs
      appUrl: envConfig.NEXT_PUBLIC_APP_URL || (isProduction ? 'https://admin.barracabanas.com' : 'http://localhost:3001'),
      apiUrl: envConfig.NEXT_PUBLIC_APP_URL ? `${envConfig.NEXT_PUBLIC_APP_URL}/api` : (isProduction ? 'https://admin.barracabanas.com/api' : 'http://localhost:3001/api'),
      websiteUrl: isProduction ? 'https://barracabanas.com' : 'http://localhost:5173',
      
      // Database
      supabase: {
        url: envConfig.NEXT_PUBLIC_SUPABASE_URL,
        anonKey: envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        serviceKey: envConfig.SUPABASE_SERVICE_ROLE_KEY
      },
      
      // Authentication
      auth: {
        jwtSecret: envConfig.JWT_SECRET,
        sessionDuration: '24h',
        rememberMeDuration: '30d'
      },
      
      // Email
      email: {
        apiKey: envConfig.RESEND_API_KEY,
        fromEmail: envConfig.COMPANY_EMAIL || 'admin@barracabanas.com',
        fromName: envConfig.COMPANY_NAME || 'Barra Cabanas',
        isEnabled: !!envConfig.RESEND_API_KEY
      },
      
      // Business
      business: {
        companyName: envConfig.COMPANY_NAME || 'Barra Cabanas',
        companyEmail: envConfig.COMPANY_EMAIL || 'info@barracabanas.com',
        vatRate: parseFloat(envConfig.VAT_RATE || '0.15'),
        currency: envConfig.CURRENCY || 'ZAR',
        defaultTimezone: 'Africa/Johannesburg'
      },
      
      // Features
      features: {
        enableRealtime: true,
        enableAnalytics: isProduction,
        enableNotifications: true,
        enableFileUploads: true
      },
      
      // Limits
      limits: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        maxUploadFiles: 5,
        apiRateLimit: isDevelopment ? 1000 : 100, // requests per minute
        sessionTimeout: isDevelopment ? 480 : 60 // 8 hours dev, 1 hour prod
      },
      
      // Logging
      logging: {
        level: isDevelopment ? 'debug' : 'info',
        enableConsole: isDevelopment,
        enableFile: isProduction
      }
    }
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager()
    }
    return ConfigManager.instance
  }

  getConfig(): AppConfig {
    return this.config
  }

  // Convenience getters
  get environment() { return this.config.environment }
  get isDevelopment() { return this.config.environment === 'development' }
  get isProduction() { return this.config.environment === 'production' }
  get isTest() { return this.config.environment === 'test' }
  
  get appUrl() { return this.config.appUrl }
  get apiUrl() { return this.config.apiUrl }
  get websiteUrl() { return this.config.websiteUrl }
  
  get supabase() { return this.config.supabase }
  get auth() { return this.config.auth }
  get email() { return this.config.email }
  get business() { return this.config.business }
  get features() { return this.config.features }
  get limits() { return this.config.limits }
  get logging() { return this.config.logging }

  // URL builders
  buildApiUrl(path: string): string {
    return `${this.apiUrl}${path.startsWith('/') ? path : `/${path}`}`
  }

  buildAppUrl(path: string): string {
    return `${this.appUrl}${path.startsWith('/') ? path : `/${path}`}`
  }

  buildWebsiteUrl(path: string): string {
    return `${this.websiteUrl}${path.startsWith('/') ? path : `/${path}`}`
  }

  // Feature flag checks
  isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
    return this.config.features[feature]
  }

  // Validation helpers
  validateFileSize(size: number): boolean {
    return size <= this.config.limits.maxFileSize
  }

  validateFileCount(count: number): boolean {
    return count <= this.config.limits.maxUploadFiles
  }

  // Environment-specific configurations
  getDatabaseConfig() {
    return {
      url: this.config.supabase.url,
      anonKey: this.config.supabase.anonKey,
      serviceKey: this.config.supabase.serviceKey,
      maxConnections: this.isProduction ? 20 : 5,
      connectionTimeout: this.isProduction ? 30000 : 10000
    }
  }

  getEmailConfig() {
    return {
      ...this.config.email,
      templates: {
        bookingConfirmation: 'booking-confirmation',
        invoiceCreated: 'invoice-created',
        quoteCreated: 'quote-created',
        passwordReset: 'password-reset'
      }
    }
  }

  getSecurityConfig() {
    return {
      jwtSecret: this.config.auth.jwtSecret,
      sessionDuration: this.config.auth.sessionDuration,
      rememberMeDuration: this.config.auth.rememberMeDuration,
      rateLimiting: {
        enabled: this.isProduction,
        maxRequests: this.config.limits.apiRateLimit,
        windowMs: 60 * 1000 // 1 minute
      },
      cors: {
        origin: this.isProduction 
          ? ['https://barracabanas.com', 'https://admin.barracabanas.com']
          : ['http://localhost:3001', 'http://localhost:5173'],
        credentials: true
      }
    }
  }
}

// Export singleton instance
export const config = ConfigManager.getInstance()

// Export types
export type { AppConfig }
