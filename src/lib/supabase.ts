import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Enhanced validation and error reporting
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Present' : 'Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing');
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Validate URL format and common issues
try {
  const url = new URL(supabaseUrl);
  
  // Check for common URL issues
  if (!url.hostname.includes('supabase.co')) {
    console.warn('Warning: Supabase URL does not contain "supabase.co". Please verify the URL.');
  }
  
  // Check for trailing slashes or API paths that shouldn't be there
  if (supabaseUrl.endsWith('/') || supabaseUrl.includes('/rest/') || supabaseUrl.includes('/auth/')) {
    console.error('Invalid Supabase URL format. URL should not contain trailing slashes or API paths.');
    console.error('Correct format: https://your-project-ref.supabase.co');
    console.error('Your URL:', supabaseUrl);
    throw new Error('Invalid Supabase URL format. Please check your VITE_SUPABASE_URL in .env file.');
  }
} catch (error) {
  console.error('Invalid Supabase URL format:', supabaseUrl);
  throw new Error('Invalid Supabase URL format. Please check your VITE_SUPABASE_URL in .env file.');
}

// Create Supabase client with enhanced configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Add retry configuration for auth
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'expense-tracker'
    },
    // Add fetch configuration to handle network issues
    fetch: (url, options = {}) => {
      return fetch(url, {
        ...options,
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(30000), // 30 second timeout
      }).catch((error) => {
        console.error('Network request failed:', {
          url,
          error: error.message,
          type: error.name
        });
        
        // Provide more specific error messages
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - please check your internet connection');
        }
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Network connection failed - please check if Supabase is accessible');
        }
        throw error;
      });
    }
  },
  // Add database configuration
  db: {
    schema: 'public'
  }
});

// Enhanced connection test with better error handling
const testConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    console.log('URL:', supabaseUrl);
    console.log('Key (first 20 chars):', supabaseAnonKey.substring(0, 20) + '...');
    
    // Test basic connectivity first
    const { data, error, status } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Supabase connection test failed:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        status
      });
      
      // Provide specific guidance based on error type
      if (error.message.includes('JWT')) {
        console.error('Authentication error - please verify your VITE_SUPABASE_ANON_KEY');
      } else if (error.message.includes('relation') || error.message.includes('table')) {
        console.error('Database schema error - the users table may not exist');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        console.error('Network error - please check your internet connection and Supabase project status');
      }
    } else {
      console.log('✅ Supabase connection successful');
    }
  } catch (error: any) {
    console.error('Supabase connection error:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    
    // Provide troubleshooting guidance
    console.error('Troubleshooting steps:');
    console.error('1. Verify your Supabase project is active at https://supabase.com/dashboard');
    console.error('2. Check that your .env file contains the correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    console.error('3. Ensure no firewall or VPN is blocking the connection');
    console.error('4. Try accessing your Supabase URL directly in a browser');
  }
};

// Run connection test
testConnection();

// Export a function to manually test connection
export const testSupabaseConnection = testConnection;