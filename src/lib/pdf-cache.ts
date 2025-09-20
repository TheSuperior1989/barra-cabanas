/**
 * PDF Cache Management Utilities
 * Provides centralized logic for PDF caching and regeneration
 */

import { requireSupabaseAdmin } from '@/lib/supabase'

export interface PDFCacheOptions {
  forceRegenerate?: boolean
  maxAge?: number // Maximum age in milliseconds before regeneration
}

export interface PDFCacheResult {
  pdfBuffer: Buffer
  wasRegenerated: boolean
  cacheAge?: number
}

/**
 * Determines if a PDF should be regenerated based on cache status and document updates
 */
export function shouldRegeneratePDF(
  pdfBuffer: any,
  pdfGeneratedAt: string | null,
  documentUpdatedAt: string,
  options: PDFCacheOptions = {}
): boolean {
  // Force regeneration if requested
  if (options.forceRegenerate) {
    return true
  }

  // No cached PDF exists
  if (!pdfBuffer || !pdfGeneratedAt) {
    return true
  }

  // Document was updated after PDF generation
  const pdfDate = new Date(pdfGeneratedAt)
  const docDate = new Date(documentUpdatedAt)
  if (docDate > pdfDate) {
    return true
  }

  // Check maximum age if specified
  if (options.maxAge) {
    const ageMs = Date.now() - pdfDate.getTime()
    if (ageMs > options.maxAge) {
      return true
    }
  }

  return false
}

/**
 * Stores a generated PDF in the database
 */
export async function storePDF(
  table: 'invoices' | 'quotes',
  documentId: string,
  pdfBuffer: Buffer
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabaseAdmin = requireSupabaseAdmin()
    
    const { error } = await supabaseAdmin
      .from(table)
      .update({
        pdf_buffer: pdfBuffer,
        pdf_generated_at: new Date().toISOString()
      })
      .eq('id', documentId)

    if (error) {
      console.error(`Failed to store PDF for ${table}/${documentId}:`, error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Error storing PDF for ${table}/${documentId}:`, errorMessage)
    return { success: false, error: errorMessage }
  }
}

/**
 * Retrieves a cached PDF from the database
 */
export function getCachedPDF(
  pdfBuffer: any,
  pdfGeneratedAt: string | null
): Buffer | null {
  if (!pdfBuffer || !pdfGeneratedAt) {
    return null
  }

  try {
    return Buffer.from(pdfBuffer)
  } catch (error) {
    console.error('Error converting cached PDF buffer:', error)
    return null
  }
}

/**
 * Generates cache headers for PDF responses
 */
export function generateCacheHeaders(
  documentId: string,
  wasRegenerated: boolean,
  pdfGeneratedAt?: string
): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/pdf'
  }

  if (wasRegenerated) {
    // Fresh PDF - allow short-term caching
    headers['Cache-Control'] = 'private, max-age=300, must-revalidate' // 5 minutes
    headers['ETag'] = `"${documentId}-${Date.now()}"`
  } else {
    // Cached PDF - allow longer caching
    headers['Cache-Control'] = 'private, max-age=3600, must-revalidate' // 1 hour
    if (pdfGeneratedAt) {
      headers['ETag'] = `"${documentId}-${new Date(pdfGeneratedAt).getTime()}"`
      headers['Last-Modified'] = new Date(pdfGeneratedAt).toUTCString()
    }
  }

  return headers
}

/**
 * Clears cached PDFs for a document (useful when forcing regeneration)
 */
export async function clearPDFCache(
  table: 'invoices' | 'quotes',
  documentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabaseAdmin = requireSupabaseAdmin()
    
    const { error } = await supabaseAdmin
      .from(table)
      .update({
        pdf_buffer: null,
        pdf_generated_at: null
      })
      .eq('id', documentId)

    if (error) {
      console.error(`Failed to clear PDF cache for ${table}/${documentId}:`, error)
      return { success: false, error: error.message }
    }

    console.log(`PDF cache cleared for ${table}/${documentId}`)
    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Error clearing PDF cache for ${table}/${documentId}:`, errorMessage)
    return { success: false, error: errorMessage }
  }
}

/**
 * Gets cache statistics for monitoring
 */
export async function getCacheStats(): Promise<{
  invoices: { total: number; cached: number; cacheRate: number }
  quotes: { total: number; cached: number; cacheRate: number }
}> {
  try {
    const supabaseAdmin = requireSupabaseAdmin()
    
    // Get invoice stats
    const { data: invoiceStats } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        SELECT 
          COUNT(*) as total,
          COUNT(pdf_buffer) as cached
        FROM invoices
      `
    })

    // Get quote stats  
    const { data: quoteStats } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        SELECT 
          COUNT(*) as total,
          COUNT(pdf_buffer) as cached
        FROM quotes
      `
    })

    const invoiceTotal = invoiceStats?.[0]?.total || 0
    const invoiceCached = invoiceStats?.[0]?.cached || 0
    const quoteTotal = quoteStats?.[0]?.total || 0
    const quoteCached = quoteStats?.[0]?.cached || 0

    return {
      invoices: {
        total: invoiceTotal,
        cached: invoiceCached,
        cacheRate: invoiceTotal > 0 ? (invoiceCached / invoiceTotal) * 100 : 0
      },
      quotes: {
        total: quoteTotal,
        cached: quoteCached,
        cacheRate: quoteTotal > 0 ? (quoteCached / quoteTotal) * 100 : 0
      }
    }
  } catch (error) {
    console.error('Error getting cache stats:', error)
    return {
      invoices: { total: 0, cached: 0, cacheRate: 0 },
      quotes: { total: 0, cached: 0, cacheRate: 0 }
    }
  }
}
