// Test password hash
// Run: node test-password.js

const bcrypt = require('bcrypt');

const password = 'admin123';
const hashFromDB = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

console.log('Testing password hash...');
console.log('Password:', password);
console.log('Hash from DB:', hashFromDB);
console.log('');

bcrypt.compare(password, hashFromDB)
    .then(result => {
        console.log('Match:', result);
        if (!result) {
            console.log('');
            console.log('Generating new hash...');
            return bcrypt.hash(password, 10);
        }
    })
    .then(newHash => {
        if (newHash) {
            console.log('New hash:', newHash);
            console.log('');
            console.log('SQL Update:');
            console.log(`UPDATE admin_users SET password_hash = '${newHash}' WHERE email = 'admin@krakatau.com';`);
        }
    })
    .catch(err => {
        console.error('Error:', err);
    });

