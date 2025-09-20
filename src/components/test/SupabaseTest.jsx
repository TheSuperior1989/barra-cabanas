import { useState, useEffect } from 'react';
import { supabase, testSupabaseConnection } from '../../lib/supabase.js';
import { getAccommodations, getBookedDates } from '../../services/bookingService.js';

const SupabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('Testing...');
  const [accommodations, setAccommodations] = useState([]);
  const [bookedDates, setBookedDates] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const runTests = async () => {
      try {
        // Test 1: Basic connection
        console.log('🧪 Testing Supabase connection...');
        const connectionResult = await testSupabaseConnection();
        setConnectionStatus(connectionResult.success ? '✅ Connected' : '❌ Failed');
        
        if (!connectionResult.success) {
          setError(connectionResult.message);
          return;
        }

        // Test 2: Fetch accommodations
        console.log('🧪 Testing accommodations fetch...');
        const accommodationsData = await getAccommodations();
        setAccommodations(accommodationsData);
        console.log('Accommodations:', accommodationsData);

        // Test 3: Fetch booked dates
        console.log('🧪 Testing booked dates fetch...');
        const bookedDatesData = await getBookedDates();
        setBookedDates(bookedDatesData);
        console.log('Booked dates:', bookedDatesData);

        // Test 4: Direct Supabase query
        console.log('🧪 Testing direct Supabase query...');
        const { data: directData, error: directError } = await supabase
          .from('accommodations')
          .select('*')
          .eq('isActive', true);
        
        if (directError) {
          console.error('Direct query error:', directError);
        } else {
          console.log('Direct query result:', directData);
        }

      } catch (err) {
        console.error('Test error:', err);
        setError(err.message);
      }
    };

    runTests();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🧪 Supabase Integration Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Connection Status</h2>
        <p>{connectionStatus}</p>
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Environment Variables</h2>
        <p><strong>VITE_SUPABASE_URL:</strong> {import.meta.env.VITE_SUPABASE_URL}</p>
        <p><strong>VITE_SUPABASE_ANON_KEY:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Accommodations ({accommodations.length})</h2>
        {accommodations.length > 0 ? (
          <ul>
            {accommodations.map(acc => (
              <li key={acc.id}>
                <strong>{acc.name}</strong> - R{acc.price}/night (Max {acc.maxGuests} guests)
              </li>
            ))}
          </ul>
        ) : (
          <p>No accommodations loaded</p>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Booked Dates</h2>
        {Object.keys(bookedDates).length > 0 ? (
          <div>
            {Object.entries(bookedDates).map(([propertyId, dates]) => (
              <div key={propertyId}>
                <strong>{propertyId}:</strong> {dates.length} booked dates
              </div>
            ))}
          </div>
        ) : (
          <p>No booked dates loaded</p>
        )}
      </div>
    </div>
  );
};

export default SupabaseTest;
