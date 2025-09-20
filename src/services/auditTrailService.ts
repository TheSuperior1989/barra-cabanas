import { requireSupabaseAdmin } from '../lib/supabase'

export interface AuditTrailEntry {
  id?: string
  bookingId: string
  action: string
  adminNotes?: string
  changes?: Record<string, any>
  adminUserId?: string
  createdAt?: string
}

export class AuditTrailService {
  /**
   * Create an audit trail entry for a booking action
   */
  static async createEntry(entry: Omit<AuditTrailEntry, 'id' | 'createdAt'>): Promise<boolean> {
    try {
      const supabaseAdmin = requireSupabaseAdmin()
      
      // First, ensure the audit trail table exists
      await this.ensureTableExists()
      
      const { error } = await supabaseAdmin
        .from('booking_audit_trail')
        .insert({
          bookingId: entry.bookingId,
          action: entry.action,
          adminNotes: entry.adminNotes,
          changes: entry.changes,
          adminUserId: entry.adminUserId
        })

      if (error) {
        console.error('Error creating audit trail entry:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in audit trail service:', error)
      return false
    }
  }

  /**
   * Get audit trail for a specific booking
   */
  static async getBookingAuditTrail(bookingId: string): Promise<AuditTrailEntry[]> {
    try {
      const supabaseAdmin = requireSupabaseAdmin()
      
      const { data, error } = await supabaseAdmin
        .from('booking_audit_trail')
        .select(`
          id,
          bookingId,
          action,
          adminNotes,
          changes,
          adminUserId,
          createdAt,
          user:users(firstName, lastName, email)
        `)
        .eq('bookingId', bookingId)
        .order('createdAt', { ascending: false })

      if (error) {
        console.error('Error fetching audit trail:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in audit trail service:', error)
      return []
    }
  }

  /**
   * Get all audit trail entries with pagination
   */
  static async getAllAuditTrail(limit = 50, offset = 0): Promise<AuditTrailEntry[]> {
    try {
      const supabaseAdmin = requireSupabaseAdmin()
      
      const { data, error } = await supabaseAdmin
        .from('booking_audit_trail')
        .select(`
          id,
          bookingId,
          action,
          adminNotes,
          changes,
          adminUserId,
          createdAt,
          user:users(firstName, lastName, email),
          booking:bookings(
            customer:customers(firstName, lastName, email)
          )
        `)
        .order('createdAt', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        console.error('Error fetching audit trail:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in audit trail service:', error)
      return []
    }
  }

  /**
   * Ensure the audit trail table exists
   */
  private static async ensureTableExists(): Promise<void> {
    try {
      const supabaseAdmin = requireSupabaseAdmin()
      
      const { error } = await supabaseAdmin.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS booking_audit_trail (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            "bookingId" UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
            action VARCHAR(50) NOT NULL,
            "adminNotes" TEXT,
            changes JSONB,
            "adminUserId" UUID REFERENCES users(id),
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          -- Create index for faster queries
          CREATE INDEX IF NOT EXISTS idx_booking_audit_trail_booking_id 
          ON booking_audit_trail("bookingId");
          
          CREATE INDEX IF NOT EXISTS idx_booking_audit_trail_created_at 
          ON booking_audit_trail("createdAt");
        `
      })

      if (error) {
        console.error('Error creating audit trail table:', error)
      }
    } catch (error) {
      console.error('Error ensuring audit trail table exists:', error)
    }
  }

  /**
   * Helper method to log booking approval
   */
  static async logBookingApproval(
    bookingId: string, 
    adminUserId?: string, 
    notes?: string,
    finalPrice?: number
  ): Promise<boolean> {
    return this.createEntry({
      bookingId,
      action: 'APPROVED',
      adminNotes: notes,
      changes: finalPrice ? { finalPrice } : undefined,
      adminUserId
    })
  }

  /**
   * Helper method to log booking rejection
   */
  static async logBookingRejection(
    bookingId: string, 
    adminUserId?: string, 
    reason?: string,
    customMessage?: string
  ): Promise<boolean> {
    return this.createEntry({
      bookingId,
      action: 'REJECTED',
      adminNotes: reason,
      changes: customMessage ? { customMessage } : undefined,
      adminUserId
    })
  }

  /**
   * Helper method to log booking modification
   */
  static async logBookingModification(
    bookingId: string, 
    adminUserId?: string, 
    changes: Record<string, any>,
    notes?: string
  ): Promise<boolean> {
    return this.createEntry({
      bookingId,
      action: 'MODIFIED',
      adminNotes: notes,
      changes,
      adminUserId
    })
  }

  /**
   * Helper method to log bulk actions
   */
  static async logBulkAction(
    bookingIds: string[], 
    action: 'BULK_APPROVED' | 'BULK_REJECTED',
    adminUserId?: string
  ): Promise<boolean> {
    try {
      const promises = bookingIds.map(bookingId => 
        this.createEntry({
          bookingId,
          action,
          adminNotes: `Bulk ${action.toLowerCase().replace('bulk_', '')}`,
          adminUserId
        })
      )

      const results = await Promise.all(promises)
      return results.every(result => result)
    } catch (error) {
      console.error('Error logging bulk action:', error)
      return false
    }
  }
}
