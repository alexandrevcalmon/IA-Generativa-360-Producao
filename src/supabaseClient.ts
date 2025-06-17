
import { createClient } from '@supabase/supabase-js';
import type { Database } from './integrations/supabase/types';

const supabaseUrl = 'https://swmxqjdvungochdjvtjg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3bXhxamR2dW5nb2NoZGp2dGpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTMzOTYsImV4cCI6MjA2NTY2OTM5Nn0.RqmWdYj-_LCfRr2l6xYJIsCDhWUAUl2ho_-KrUp1igc';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
