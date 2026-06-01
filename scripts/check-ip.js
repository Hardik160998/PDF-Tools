const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkIpBased() {
  // Query all policies
  const { data: policies, error: polErr } = await supabase.rpc('get_policies');
  if (polErr) {
    console.log("Could not use get_policies rpc, trying direct query if possible", polErr.message);
  } else {
    console.log("Policies:", policies);
  }

  // Check columns in users table
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .limit(1);
    
  if (data && data.length > 0) {
    console.log("User table columns:", Object.keys(data[0]));
  }
}

checkIpBased();
