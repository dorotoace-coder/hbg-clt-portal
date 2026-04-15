import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function setup() {
  const { data, error } = await supabase.auth.signUp({
    email: 'admin@hbg-clt.vercel.app',
    password: 'securepassword123',
  });

  if (error) {
    console.error('Error signing up admin:', error.message);
  } else {
    console.log('Successfully created admin user!', data.user?.id);
  }
}

setup();
