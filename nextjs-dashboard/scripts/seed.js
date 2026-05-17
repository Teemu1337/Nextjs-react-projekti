// scripts/seed.js
const postgres = require('postgres');
const bcrypt = require('bcrypt');
require('dotenv').config();

const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require' });

async function seed() {
  try {
    console.log('🌱 Lisätään testikäyttäjä...');
    
    // Hashaa salasana
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    // Lisää käyttäjä
    await sql`
      INSERT INTO users (email, password, name)
      VALUES ('user@nextmail.com', ${hashedPassword}, 'Test User')
      ON CONFLICT (email) DO UPDATE SET password = ${hashedPassword}
    `;
    
    console.log('✅ Testikäyttäjä lisätty onnistuneesti!');
    console.log('📧 Email: user@nextmail.com');
    console.log('🔑 Salasana: 123456');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Virhe:', error);
    process.exit(1);
  }
}

seed();