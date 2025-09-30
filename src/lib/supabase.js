import { createClient } from '@supabase/supabase-js';

// Validate environment variables with better error messages
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables:');
  console.error('VITE_SUPABASE_URL:', !!supabaseUrl);
  console.error('VITE_SUPABASE_ANON_KEY:', !!supabaseKey);
  throw new Error('Missing required Supabase environment variables. Please check your .env file.');
}

// Create Supabase client with enhanced error handling
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'evolve-health@1.0.0',
    },
  },
});

// Enhanced connection test with retry logic
let connectionTested = false;

export const testConnection = async (retries = 3) => {
  if (connectionTested) return true;
  
  for (let i = 0; i < retries; i++) {
    try {
      const { data, error } = await supabase?.auth?.getSession();
      if (error) throw error;
      
      connectionTested = true;
      console.log('✅ Supabase connection established successfully');
      return true;
    } catch (error) {
      console.warn(`⚠️ Supabase connection attempt ${i + 1}/${retries} failed:`, error?.message);
      
      if (i === retries - 1) {
        console.error('❌ Failed to establish Supabase connection after', retries, 'attempts');
        throw new Error(`Supabase connection failed: ${error.message}`);
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  
  return false;
};

// Test connection immediately but don't block app startup
testConnection()?.catch(error => {
  console.warn('Initial Supabase connection test failed, but app will continue:', error?.message);
});

export { supabase };
export default supabase;