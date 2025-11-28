// Test Bcrypt Performance
// Run: node test-bcrypt.js

const bcrypt = require('bcrypt');

const password = 'admin123';
const hash = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

console.log('Testing bcrypt.compare...');
console.log('Password:', password);
console.log('Hash:', hash);
console.log('Hash length:', hash.length);
console.log('');

const startTime = Date.now();

bcrypt.compare(password, hash)
  .then(result => {
    const duration = Date.now() - startTime;
    console.log(`✅ Compare completed in ${duration}ms`);
    console.log('Result:', result);
    
    if (result) {
      console.log('✅ Password matches!');
    } else {
      console.log('❌ Password does not match');
    }
    
    process.exit(0);
  })
  .catch(error => {
    const duration = Date.now() - startTime;
    console.error(`❌ Error after ${duration}ms:`, error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  });

// Timeout after 10 seconds
setTimeout(() => {
  const duration = Date.now() - startTime;
  console.error(`❌ Timeout after ${duration}ms - bcrypt.compare is hanging!`);
  process.exit(1);
}, 10000);

