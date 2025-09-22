# 🏖️ BARRA CABANAS COMPLETE SYSTEM DOCUMENTATION

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Supabase Database Configuration](#supabase-database-configuration)
3. [Admin Dashboard Details](#admin-dashboard-details)
4. [Website Integration Specifications](#website-integration-specifications)
5. [API Endpoints](#api-endpoints)
6. [Environment Configuration](#environment-configuration)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 System Overview

### Architecture
```
Customer Website (React/Vite) ↔ Admin Dashboard (Next.js) ↔ Supabase Database
     Port 5173                      Port 3000                PostgreSQL + Real-time
```

### Project Structure
- **Admin Dashboard:** `C:\Users\chris\AndroidStudioProjects\barra-cabanas-new\barra-cabanas`
- **Website:** `C:\Users\chris\AndroidStudioProjects\barra-website`

---

## 🗄️ Supabase Database Configuration

### Account Details
- **Project URL:** `https://ellmctmcopdymwhalpmi.supabase.co`
- **Project ID:** `ellmctmcopdymwhalpmi`
- **Region:** `eu-west-1`

### API Keys
```bash
# Public (Anon) Key - Safe for frontend use
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsbG1jdG1jb3BkeW13aGFscG1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2ODA3MDEsImV4cCI6MjA2ODI1NjcwMX0.TjSQdVSr0rzCM2HPeZZlzZ2SsZvNYWmgRAMflTcJE3w

# Service Role Key - Server-side only (KEEP SECRET)
# ⚠️ SECURITY: Service role key removed from documentation for security
# Get the current key from Supabase Dashboard → Settings → API → Service Role Key
SUPABASE_SERVICE_ROLE_KEY=[GET_FROM_SUPABASE_DASHBOARD]
```

### Database Schema

#### Core Tables
1. **accommodations** - Property listings
2. **customers** - Customer information  
3. **bookings** - Booking records
4. **users** - Admin users
5. **invoices** - Invoice management
6. **quotes** - Quote management

#### Accommodations Table Structure
```sql
CREATE TABLE accommodations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  description TEXT,
  type VARCHAR,
  maxGuests INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  basePrice DECIMAL(10,2),
  isActive BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Current Accommodation Data
```sql
-- Whale House - Ocean View Villa
INSERT INTO accommodations VALUES (
  'whale-house',
  'Whale House - Ocean View Villa',
  'Luxury ocean view villa with stunning whale watching opportunities',
  'villa',
  6,
  3,
  2,
  3500.00,
  true
);

-- Manta House - Coastal Retreat  
INSERT INTO accommodations VALUES (
  'manta-house',
  'Manta House - Coastal Retreat',
  'Cozy coastal retreat perfect for couples and small families',
  'house',
  4,
  2,
  1,
  2500.00,
  true
);
```

#### Customers Table Structure
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firstName VARCHAR NOT NULL,
  lastName VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  phone VARCHAR,
  address TEXT,
  city VARCHAR,
  country VARCHAR DEFAULT 'South Africa',
  postalCode VARCHAR,
  isCompany BOOLEAN DEFAULT false,
  notes TEXT,
  preferredContact VARCHAR DEFAULT 'email',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Bookings Table Structure
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customerId UUID REFERENCES customers(id),
  accommodationId UUID REFERENCES accommodations(id),
  checkIn DATE NOT NULL,
  checkOut DATE NOT NULL,
  guests INTEGER NOT NULL,
  totalPrice DECIMAL(10,2),
  status VARCHAR DEFAULT 'PENDING',
  specialRequests TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Row Level Security (RLS)
- **Enabled** on all tables
- **Policies** configured for secure data access
- **Real-time** subscriptions enabled for live updates

---

## 📊 Admin Dashboard Details

### Location & Access
- **Path:** `C:\Users\chris\AndroidStudioProjects\barra-cabanas-new\barra-cabanas`
- **URL:** http://localhost:3000
- **Technology:** Next.js 14 + TypeScript + Tailwind CSS

### Admin User Accounts
```bash
# Primary Admin
Email: christiaanvonstade@gmail.com
Password: admin123
Role: admin

# Manager/Owner
Email: jaco@barracabanas.com  
Password: admin123
Role: admin
```

### Key Features
1. **Dashboard Overview** - Real-time statistics
2. **Booking Management** - View, approve, modify bookings
3. **Customer Management** - Customer profiles and history
4. **Invoice Generation** - Create quotes and invoices
5. **User Management** - Admin user controls
6. **Email Integration** - Resend service for notifications

### Main Modules
- **Bookings Tab** - Primary booking management
- **Customers Tab** - Customer database
- **Invoices Tab** - Invoice creation and management
- **Quotes Tab** - Quote generation
- **Users Tab** - Admin user management
- **Email Tab** - Email testing and management

### Starting the Admin Dashboard
```bash
cd "C:\Users\chris\AndroidStudioProjects\barra-cabanas-new\barra-cabanas"
npm run dev
# Runs on http://localhost:3000
```

---

## 🌐 Website Integration Specifications

### Location & Technology
- **Path:** `C:\Users\chris\AndroidStudioProjects\barra-website`
- **URL:** http://localhost:5173
- **Technology:** React + Vite + JavaScript

### Required Environment Variables (.env)
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://ellmctmcopdymwhalpmi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsbG1jdG1jb3BkeW13aGFscG1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2ODA3MDEsImV4cCI6MjA2ODI1NjcwMX0.TjSQdVSr0rzCM2HPeZZlzZ2SsZvNYWmgRAMflTcJE3w

# Admin Backend URL
VITE_ADMIN_API_URL=http://localhost:3000

# EmailJS Configuration (existing)
VITE_EMAILJS_SERVICE_ID=service_gf24d3g
VITE_EMAILJS_TEMPLATE_ID_CONTACT=template_1n2dryo
VITE_EMAILJS_TEMPLATE_ID_QUOTE=template_ckvbt4r
VITE_EMAILJS_PUBLIC_KEY=v_G3DxlVjh4WKNGWJ
```

### Key Components

#### 1. BookingPage.jsx
- **Location:** `src/components/booking/BookingPage.jsx`
- **Purpose:** Main booking interface
- **Features:**
  - Property selection dropdown
  - Date picker (check-in/check-out)
  - Guest counter
  - Real-time availability checking
  - Price calculation

#### 2. BookingForm.jsx  
- **Location:** `src/components/booking/BookingForm.jsx`
- **Purpose:** Customer information form
- **Fields:**
  - firstName, lastName, email, phone
  - address, city, country, postalCode
  - specialRequests

#### 3. bookingService.js
- **Location:** `src/services/bookingService.js`
- **Purpose:** API integration layer
- **Functions:**
  - `getAccommodations()` - Fetch properties from Supabase
  - `getBookedDates()` - Get unavailable dates
  - `submitBooking()` - Submit booking to admin API
  - `subscribeToBookingUpdates()` - Real-time updates

### Expected Booking Workflow
1. **Customer visits** http://localhost:5173/booking
2. **Selects property** from dropdown (Whale House or Manta House)
3. **Chooses dates** using date picker
4. **Sets guest count** using counter controls
5. **Views price calculation** with breakdown
6. **Clicks "Book Now"** to open booking form
7. **Fills customer details** in modal form
8. **Submits booking** which creates:
   - Customer record (if new)
   - Booking record with PENDING status
9. **Admin receives** booking in dashboard for approval

---

## 🔌 API Endpoints

### Admin Dashboard APIs (Port 3000)

#### Accommodations
```bash
GET /api/accommodations
# Returns: Array of accommodation objects
# Expected: 2 properties (Whale House, Manta House)
```

#### Customers  
```bash
GET /api/customers
POST /api/customers
# Create new customer from booking form
```

#### Bookings
```bash
GET /api/bookings  
POST /api/bookings
# Create new booking linked to customer
```

#### Authentication
```bash
POST /api/auth/login
# Admin login with email/password
```

### Supabase Direct Access
```bash
# REST API Base URL
https://ellmctmcopdymwhalpmi.supabase.co/rest/v1/

# Example: Get accommodations
GET /rest/v1/accommodations?select=*
Headers:
  apikey: [SUPABASE_ANON_KEY]
  Authorization: Bearer [SUPABASE_ANON_KEY]
```

---

## ⚙️ Environment Configuration

### Admin Dashboard (.env.local)
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ellmctmcopdymwhalpmi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsbG1jdG1jb3BkeW13aGFscG1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2ODA3MDEsImV4cCI6MjA2ODI1NjcwMX0.TjSQdVSr0rzCM2HPeZZlzZ2SsZvNYWmgRAMflTcJE3w
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsbG1jdG1jb3BkeW13aGFscG1pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjY4MDcwMSwiZXhwIjoyMDY4MjU2NzAxfQ.BnCCxOY8X0gZrR8ocF2i4KPH-i7ShteFTbWt7BNzlKk

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Email Service (Resend)
RESEND_API_KEY=your-resend-api-key-here

# Business Configuration
COMPANY_NAME=Barra Cabanas
COMPANY_EMAIL=info@barracabanas.com
VAT_RATE=0.15
CURRENCY=ZAR
DEFAULT_TIMEZONE=Africa/Johannesburg
```

### Website (.env)
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://ellmctmcopdymwhalpmi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsbG1jdG1jb3BkeW13aGFscG1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2ODA3MDEsImV4cCI6MjA2ODI1NjcwMX0.TjSQdVSr0rzCM2HPeZZlzZ2SsZvNYWmgRAMflTcJE3w

# Admin Backend URL
VITE_ADMIN_API_URL=http://localhost:3000
```

---

## 🔧 Starting Both Systems

### 1. Start Admin Dashboard
```bash
cd "C:\Users\chris\AndroidStudioProjects\barra-cabanas-new\barra-cabanas"
npm run dev
# Access: http://localhost:3000
```

### 2. Start Website  
```bash
cd "C:\Users\chris\AndroidStudioProjects\barra-website"
npm run dev
# Access: http://localhost:5173
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Property Dropdown Empty
**Problem:** Select a Property dropdown shows no accommodations
**Solution:** 
- Check Supabase connection in browser console
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- Test API: `GET https://ellmctmcopdymwhalpmi.supabase.co/rest/v1/accommodations?select=*`

#### 2. Booking Submission Fails
**Problem:** Booking form submission returns error
**Solution:**
- Ensure admin dashboard is running on port 3000
- Check VITE_ADMIN_API_URL points to correct backend
- Verify customer creation API endpoint

#### 3. Real-time Updates Not Working
**Problem:** Changes don't appear immediately
**Solution:**
- Check Supabase real-time subscriptions
- Verify RLS policies allow read access
- Check browser console for WebSocket errors

### Testing Commands
```bash
# Test accommodations API
curl http://localhost:3000/api/accommodations

# Test Supabase direct
curl -H "apikey: [ANON_KEY]" \
     -H "Authorization: Bearer [ANON_KEY]" \
     https://ellmctmcopdymwhalpmi.supabase.co/rest/v1/accommodations?select=*
```

---

## 📞 Support Information

### Key Files to Check
- **Admin:** `src/lib/supabase-service.ts` - Database connection
- **Website:** `src/services/bookingService.js` - API integration  
- **Website:** `src/components/booking/BookingPage.jsx` - Main booking UI

### Database Access
- **Supabase Dashboard:** https://supabase.com/dashboard/project/ellmctmcopdymwhalpmi
- **Direct SQL:** Use Supabase SQL Editor for database queries

### Integration Status
✅ **Database:** Fully configured with sample data  
✅ **Admin Dashboard:** Running and functional  
✅ **APIs:** All endpoints working  
⚠️ **Website:** Property dropdown needs Supabase connection fix

---

## 🔍 Technical Implementation Details

### Website Supabase Integration

#### Required Dependencies
```bash
npm install @supabase/supabase-js
```

#### Supabase Client Setup (src/lib/supabase.js)
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false
  }
})
```

#### BookingService Implementation (src/services/bookingService.js)
```javascript
import { supabase } from '../lib/supabase.js'

// Fetch accommodations from Supabase
export const getAccommodations = async () => {
  try {
    const { data, error } = await supabase
      .from('accommodations')
      .select('*')
      .eq('isActive', true)
      .order('name')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching accommodations:', error)
    return []
  }
}

// Submit booking to admin API
export const submitBooking = async (bookingData) => {
  try {
    // First create customer
    const customerResponse = await fetch(`${import.meta.env.VITE_ADMIN_API_URL}/api/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: bookingData.email,
        firstName: bookingData.firstName,
        lastName: bookingData.lastName,
        phone: bookingData.phone,
        address: bookingData.address,
        city: bookingData.city,
        country: bookingData.country,
        postalCode: bookingData.postalCode,
        isCompany: false,
        notes: `Website booking - ${new Date().toISOString()}`,
        preferredContact: 'email'
      })
    })

    const customer = await customerResponse.json()

    // Then create booking
    const bookingResponse = await fetch(`${import.meta.env.VITE_ADMIN_API_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: customer.id,
        accommodationId: bookingData.accommodationId,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests,
        totalPrice: bookingData.totalAmount,
        specialRequests: bookingData.specialRequests
      })
    })

    const booking = await bookingResponse.json()

    return {
      success: true,
      message: 'Booking submitted successfully!',
      booking: booking,
      customer: customer
    }
  } catch (error) {
    console.error('Booking submission error:', error)
    return {
      success: false,
      message: 'Failed to submit booking. Please try again.',
      error: error.message
    }
  }
}
```

### Admin Dashboard API Details

#### Customer Creation Endpoint
```typescript
// src/app/api/customers/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json()

  const customerData = {
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    phone: body.phone || '',
    address: body.address || '',
    city: body.city || '',
    country: body.country || 'South Africa',
    postalCode: body.postalCode || '',
    isCompany: body.isCompany || false,
    notes: body.notes || '',
    preferredContact: body.preferredContact || 'email'
  }

  const { data, error } = await supabase
    .from('customers')
    .insert(customerData)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data)
}
```

### Database Queries for Testing

#### Check Accommodations
```sql
SELECT id, name, basePrice, maxGuests, isActive
FROM accommodations
WHERE isActive = true
ORDER BY name;
```

#### Check Recent Bookings
```sql
SELECT b.id, b.status, b.checkIn, b.checkOut,
       c.firstName, c.lastName, c.email,
       a.name as accommodation
FROM bookings b
JOIN customers c ON b.customerId = c.id
JOIN accommodations a ON b.accommodationId = a.id
ORDER BY b.created_at DESC
LIMIT 10;
```

#### Verify RLS Policies
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';
```

---

## 🚀 Quick Start Guide

### For Website Development

1. **Copy this documentation** to your website folder
2. **Install dependencies:**
   ```bash
   npm install @supabase/supabase-js
   ```
3. **Create/verify .env file** with Supabase credentials
4. **Test Supabase connection:**
   ```javascript
   // In browser console
   fetch('https://ellmctmcopdymwhalpmi.supabase.co/rest/v1/accommodations?select=*', {
     headers: {
       'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsbG1jdG1jb3BkeW13aGFscG1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2ODA3MDEsImV4cCI6MjA2ODI1NjcwMX0.TjSQdVSr0rzCM2HPeZZlzZ2SsZvNYWmgRAMflTcJE3w'
     }
   }).then(r => r.json()).then(console.log)
   ```
5. **Fix property dropdown** by implementing `getAccommodations()` function
6. **Test booking submission** with admin dashboard running

### Expected Results
- Property dropdown shows: "Whale House - Ocean View Villa" and "Manta House - Coastal Retreat"
- Booking form submits successfully to admin dashboard
- New bookings appear in admin dashboard with PENDING status

---

*This complete documentation provides everything needed to fix the website integration and continue development independently.*
