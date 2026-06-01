const https = require('https');

const options = {
  hostname: 'api.supabase.com',
  port: 443,
  path: '/v1/projects/hcgjatlbduyswuporqmg/config/auth',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${process.env.SUPABASE_ACCESS_TOKEN}`, // Replace with your actual token or use env var
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(data);
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
