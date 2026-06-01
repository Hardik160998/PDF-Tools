const { Client } = require('pg');

async function reload() {
  const client = new Client({
    connectionString: 'postgresql://postgres.ukxwejrgfayjlouinpew:bybiyynqdmiappnu@aws-0-ap-south-1.pooler.supabase.com:6543/postgres' // wait, I don't know the new database password. I asked the user for it but they only gave ONE password!
  });
  // ...
}
