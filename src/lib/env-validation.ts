/**
 * Environment Variable Validation for Production Readiness
 * 
 * This module validates all required environment variables and provides
 * proper error handling for missing or invalid configurations.
 */

interface EnvironmentConfig {
  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY: string
  
  // Authentication
  JWT_SECRET: string
  NEXTAUTH_SECRET?: string
  NEXTAUTH_URL?: string
  
  // Email Service
  RESEND_API_KEY?: string
  
  // Application Configuration
  NODE_ENV: 'development' | 'production' | 'test'
  NEXT_PUBLIC_APP_URL?: string
  
  // Business Configuration
  COMPANY_NAME?: string
  COMPANY_EMAIL?: string
  VAT_RATE?: string
  CURRENCY?: string
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  config: Partial<EnvironmentConfig>
}

class EnvironmentValidator {
  private static instance: EnvironmentValidator
  private validatedConfig: EnvironmentConfig | null = null

  static getInstance(): EnvironmentValidator {
    if (!EnvironmentValidator.instance) {
      EnvironmentValidator.instance = new EnvironmentValidator()
    }
    return EnvironmentValidator.instance
  }

  /**
   * Validate all environment variables
   */
  validate(): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    const config: Partial<EnvironmentConfig> = {}

    // Required variables
    const requiredVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
      'SUPABASE_SERVICE_ROLE_KEY',
      'JWT_SECRET'
    ]

    // Check required variables
    for (const varName of requiredVars) {
      const value = process.env[varName]
      if (!value) {
        errors.push(`Missing required environment variable: ${varName}`)
      } else {
        config[varName as keyof EnvironmentConfig] = value
      }
    }

    // Validate NODE_ENV
    const nodeEnv = process.env.NODE_ENV
    if (!nodeEnv || !['development', 'production', 'test'].includes(nodeEnv)) {
      errors.push('NODE_ENV must be set to development, production, or test')
    } else {
      config.NODE_ENV = nodeEnv as 'development' | 'production' | 'test'
    }

    // Validate Supabase URL format
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (supabaseUrl && !supabaseUrl.includes('supabase.co')) {
      errors.push('NEXT_PUBLIC_SUPABASE_URL must be a valid Supabase URL')
    }

    // Validate JWT Secret strength
    const jwtSecret = process.env.JWT_SECRET
    if (jwtSecret && jwtSecret.length < 32) {
      errors.push('JWT_SECRET must be at least 32 characters long for security')
    }

    // Optional but recommended variables
    const optionalVars = [
      'RESEND_API_KEY',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'NEXT_PUBLIC_APP_URL'
    ]

    for (const varName of optionalVars) {
      const value = process.env[varName]
      if (!value) {
        if (config.NODE_ENV === 'production') {
          warnings.push(`Recommended environment variable missing: ${varName}`)
        }
      } else {
        config[varName as keyof EnvironmentConfig] = value
      }
    }

    // Business configuration with defaults
    config.COMPANY_NAME = process.env.COMPANY_NAME || 'Barra Cabanas'
    config.COMPANY_EMAIL = process.env.COMPANY_EMAIL || 'info@barracabanas.com'
    config.VAT_RATE = process.env.VAT_RATE || '0.15'
    config.CURRENCY = process.env.CURRENCY || 'ZAR'

    // Production-specific validations
    if (config.NODE_ENV === 'production') {
      if (!process.env.RESEND_API_KEY) {
        warnings.push('RESEND_API_KEY not set - email functionality will be limited')
      }
      
      if (!process.env.NEXT_PUBLIC_APP_URL) {
        warnings.push('NEXT_PUBLIC_APP_URL not set - some features may not work correctly')
      }
    }

    const isValid = errors.length === 0

    // Cache validated config if valid
    if (isValid) {
      this.validatedConfig = config as EnvironmentConfig
    }

    return {
      isValid,
      errors,
      warnings,
      config
    }
  }

  /**
   * Get validated configuration (throws if not validated)
   */
  getConfig(): EnvironmentConfig {
    if (!this.validatedConfig) {
      const result = this.validate()
      if (!result.isValid) {
        throw new Error(`Environment validation failed: ${result.errors.join(', ')}`)
      }
    }
    return this.validatedConfig!
  }

  /**
   * Check if running in production
   */
  isProduction(): boolean {
    return this.getConfig().NODE_ENV === 'production'
  }

  /**
   * Check if running in development
   */
  isDevelopment(): boolean {
    return this.getConfig().NODE_ENV === 'development'
  }

  /**
   * Get application URL with fallback
   */
  getAppUrl(): string {
    const config = this.getConfig()
    return config.NEXT_PUBLIC_APP_URL || 
           (config.NODE_ENV === 'production' ? 'https://admin.barracabanas.com' : 'http://localhost:3001')
  }

  /**
   * Get email service configuration
   */
  getEmailConfig() {
    const config = this.getConfig()
    return {
      apiKey: config.RESEND_API_KEY,
      fromEmail: config.COMPANY_EMAIL || 'admin@barracabanas.com',
      companyName: config.COMPANY_NAME || 'Barra Cabanas',
      isEnabled: !!config.RESEND_API_KEY
    }
  }

  /**
   * Get business configuration
   */
  getBusinessConfig() {
    const config = this.getConfig()
    return {
      companyName: config.COMPANY_NAME || 'Barra Cabanas',
      companyEmail: config.COMPANY_EMAIL || 'info@barracabanas.com',
      vatRate: parseFloat(config.VAT_RATE || '0.15'),
      currency: config.CURRENCY || 'ZAR'
    }
  }
}

// Export singleton instance
export const envValidator = EnvironmentValidator.getInstance()

// Export types
export type { EnvironmentConfig, ValidationResult }

// Validate environment on module load (but don't throw in development)
const validation = envValidator.validate()
if (!validation.isValid) {
  const isProduction = process.env.NODE_ENV === 'production'
  const message = `Environment validation failed: ${validation.errors.join(', ')}`
  
  if (isProduction) {
    throw new Error(message)
  } else {
    console.warn('⚠️ Environment validation warnings:', validation.errors)
  }
}

if (validation.warnings.length > 0) {
  console.warn('⚠️ Environment warnings:', validation.warnings)
}
