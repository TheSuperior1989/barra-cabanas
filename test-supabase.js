// Test script to verify Supabase connection and data fetching
import { supabase, testSupabaseConnection } from './src/lib/supabase.js';

console.log('🧪 Testing Supabase Connection...');

// Test 1: Basic connection
console.log('\n1. Testing basic connection...');
testSupabaseConnection().then(result => {
  console.log('Connection result:', result);
});

// Test 2: Fetch accommodations directly
console.log('\n2. Testing accommodations fetch directly...');
supabase
  .from('accommodations')
  .select('*')
  .eq('isActive', true)
  .order('name', { ascending: true })
  .then(({ data, error }) => {
    if (error) {
      console.error('Accommodations query error:', error);
    } else {
      console.log('Accommodations data:', data);
      console.log('Count:', data.length);
    }
  });

// Test 3: Check environment variables
console.log('\n3. Checking environment variables...');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set');
