// Test Login Endpoint Directly
// Run: node test-login-endpoint.js

const http = require('http');

const data = JSON.stringify({
  email: 'admin@krakatau.com',
  password: 'admin123'
});

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/admin/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('Testing login endpoint...');
console.log('Request:', options);
console.log('');

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log('Headers:', res.headers);
  console.log('');

  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Response:', responseData);
    try {
      const json = JSON.parse(responseData);
      console.log('Parsed:', JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Not JSON');
    }
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('Request timeout');
  req.destroy();
  process.exit(1);
});

req.setTimeout(10000); // 10 second timeout

req.write(data);
req.end();

