// Generate Bcrypt Hash for Admin Password
// Run: node generate-password-hash.js

const bcrypt = require('bcrypt');

const password = process.argv[2] || 'admin123';
const rounds = 10;

console.log('Generating bcrypt hash...');
console.log('Password:', password);
console.log('Rounds:', rounds);
console.log('');

bcrypt.hash(password, rounds)
    .then(hash => {
        console.log('Hash:', hash);
        console.log('');
        console.log('SQL Update Command:');
        console.log(`UPDATE admin_users SET password_hash = '${hash}' WHERE email = 'admin@krakatau.com';`);
        console.log('');
        console.log('Or use update-admin-password.sh script');
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });

