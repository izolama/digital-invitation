// Generate Bcrypt Hash for Password
// Run: node generate-hash.js [password]

const bcrypt = require('bcryptjs');

const password = process.argv[2] || 'admin123';
const rounds = 10;

console.log('Generating bcrypt hash...');
console.log('Password:', password);
console.log('Rounds:', rounds);
console.log('');

bcrypt.hash(password, rounds)
    .then(hash => {
        console.log('✅ Hash generated:');
        console.log(hash);
        console.log('');
        console.log('SQL Update Command:');
        console.log(`UPDATE admin_users SET password_hash = '${hash}' WHERE email = 'admin@krakatau.com';`);
        console.log('');
        console.log('Or use fix-password script');
        
        // Also test the hash
        return bcrypt.compare(password, hash);
    })
    .then(match => {
        console.log('✅ Hash verification test:', match ? 'PASSED' : 'FAILED');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Error:', err.message);
        process.exit(1);
    });

