// Guest Account Management Service
import { supabaseAdmin } from '@/lib/supabase'
import { sendBookingEmails } from './emailNotificationService'

interface GuestAccountData {
  email: string
  firstName: string
  lastName: string
  phone: string
  customerId: string
}

interface BookingApprovalData {
  bookingId: string
  finalPrice?: number
  notes?: string
  checkInInstructions?: string
}

/**
 * Create a guest account when booking is approved
 */
export async function createGuestAccount(guestData: GuestAccountData): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    // Generate a temporary password
    const tempPassword = generateTempPassword()
    
    // Create auth user in Supabase Auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: guestData.email,
      password: tempPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        firstName: guestData.firstName,
        lastName: guestData.lastName,
        phone: guestData.phone,
        role: 'guest',
        customerId: guestData.customerId,
        accountType: 'guest'
      }
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      return { success: false, error: authError.message }
    }

    // Update customer record with auth user ID
    const { error: updateError } = await supabaseAdmin
      .from('customers')
      .update({ 
        authUserId: authUser.user.id,
        hasGuestAccount: true,
        updatedAt: new Date().toISOString()
      })
      .eq('id', guestData.customerId)

    if (updateError) {
      console.error('Error updating customer record:', updateError)
      // Try to clean up auth user if customer update fails
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)
      return { success: false, error: 'Failed to link guest account' }
    }

    console.log('✅ Guest account created successfully:', authUser.user.email)
    return { 
      success: true, 
      user: {
        ...authUser.user,
        tempPassword
      }
    }

  } catch (error) {
    console.error('Error in createGuestAccount:', error)
    return { success: false, error: 'Failed to create guest account' }
  }
}

/**
 * Handle booking approval and guest account creation
 */
export async function approveBookingWithGuestAccount(approvalData: BookingApprovalData): Promise<{ success: boolean; message: string; guestAccount?: any }> {
  try {
    // Get booking details
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        customer:customers(*),
        accommodation:accommodations(*)
      `)
      .eq('id', approvalData.bookingId)
      .single()

    if (bookingError || !booking) {
      return { success: false, message: 'Booking not found' }
    }

    // Update booking status
    const { error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({
        status: 'CONFIRMED',
        totalPrice: approvalData.finalPrice || booking.totalPrice,
        notes: approvalData.notes || booking.notes,
        updatedAt: new Date().toISOString()
      })
      .eq('id', approvalData.bookingId)

    if (updateError) {
      console.error('Error updating booking:', updateError)
      return { success: false, message: 'Failed to update booking' }
    }

    // Create guest account if customer doesn't have one
    let guestAccount = null
    if (!booking.customer.hasGuestAccount) {
      const accountResult = await createGuestAccount({
        email: booking.customer.email,
        firstName: booking.customer.firstName,
        lastName: booking.customer.lastName,
        phone: booking.customer.phone,
        customerId: booking.customer.id
      })

      if (accountResult.success) {
        guestAccount = accountResult.user
      } else {
        console.error('Failed to create guest account:', accountResult.error)
        // Continue with approval even if account creation fails
      }
    }

    // Send confirmation emails
    try {
      await sendBookingConfirmationEmails({
        booking: {
          ...booking,
          status: 'CONFIRMED',
          totalPrice: approvalData.finalPrice || booking.totalPrice
        },
        guestAccount,
        checkInInstructions: approvalData.checkInInstructions
      })
    } catch (emailError) {
      console.error('Failed to send confirmation emails:', emailError)
      // Don't fail the approval if emails fail
    }

    return {
      success: true,
      message: 'Booking approved successfully',
      guestAccount
    }

  } catch (error) {
    console.error('Error in approveBookingWithGuestAccount:', error)
    return { success: false, message: 'Failed to approve booking' }
  }
}

/**
 * Handle booking decline with notification
 */
export async function declineBookingWithNotification(bookingId: string, reason?: string): Promise<{ success: boolean; message: string }> {
  try {
    // Get booking details
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        customer:customers(*),
        accommodation:accommodations(*)
      `)
      .eq('id', bookingId)
      .single()

    if (bookingError || !booking) {
      return { success: false, message: 'Booking not found' }
    }

    // Update booking status
    const { error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({
        status: 'DECLINED',
        notes: reason || 'Booking declined',
        updatedAt: new Date().toISOString()
      })
      .eq('id', bookingId)

    if (updateError) {
      console.error('Error updating booking:', updateError)
      return { success: false, message: 'Failed to update booking' }
    }

    // Send decline notification email
    try {
      await sendBookingDeclineEmail({
        booking,
        reason
      })
    } catch (emailError) {
      console.error('Failed to send decline email:', emailError)
      // Don't fail the decline if email fails
    }

    return {
      success: true,
      message: 'Booking declined successfully'
    }

  } catch (error) {
    console.error('Error in declineBookingWithNotification:', error)
    return { success: false, message: 'Failed to decline booking' }
  }
}

/**
 * Generate a temporary password for guest accounts
 */
function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  let password = ''
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

/**
 * Send booking confirmation emails with guest account details
 */
async function sendBookingConfirmationEmails(data: any) {
  // Implementation would go here - send emails with:
  // - Booking confirmation
  // - Guest account login details (if created)
  // - Check-in instructions
  // - Payment details
  console.log('📧 Sending booking confirmation emails...')
}

/**
 * Send booking decline email
 */
async function sendBookingDeclineEmail(data: any) {
  // Implementation would go here - send polite decline email with:
  // - Reason for decline
  // - Alternative suggestions
  // - Contact information
  console.log('📧 Sending booking decline email...')
}
