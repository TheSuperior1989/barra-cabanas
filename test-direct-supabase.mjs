// Direct test of Supabase connection using fetch
import fetch from 'node-fetch';

const SUPABASE_URL = 'https://ellmctmcopdymwhalpmi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsbG1jdG1jb3BkeW13aGFscG1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2ODA3MDEsImV4cCI6MjA2ODI1NjcwMX0.TjSQdVSr0rzCM2HPeZZlzZ2SsZvNYWmgRAMflTcJE3w';

console.log('🧪 Testing direct Supabase REST API connection...');

try {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/accommodations?select=*&isActive=eq.true`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log('✅ Success! Accommodations data:');
  console.log(JSON.stringify(data, null, 2));
  console.log(`\n📊 Found ${data.length} accommodations`);
  
  data.forEach(acc => {
    console.log(`- ${acc.name}: R${acc.basePrice}/night (${acc.maxGuests} guests)`);
  });

} catch (error) {
  console.error('❌ Error:', error.message);
}
