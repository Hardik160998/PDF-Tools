const https = require('https');

const newConfig = {
  smtp_admin_email: "smartpdfpro@gmail.com",
  smtp_host: "smtp.gmail.com",
  smtp_max_frequency: 60,
  smtp_pass: process.env.SMTP_PASSWORD || "YOUR_SMTP_PASSWORD",
  smtp_port: "465",
  smtp_sender_name: "Smart PDF Pro",
  smtp_user: "smartpdfpro@gmail.com"
};

const payload = JSON.stringify(newConfig);

const options = {
  hostname: 'api.supabase.com',
  port: 443,
  path: '/v1/projects/ukxwejrgfayjlouinpew/config/auth',
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${process.env.SUPABASE_ACCESS_TOKEN || 'YOUR_SUPABASE_TOKEN'}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('Successfully updated SMTP settings on new project!');
    } else {
      console.log('Error Response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.write(payload);
req.end();
