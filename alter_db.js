import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  try {
    console.log("Adding social links to User table...");
    try { await connection.query(`ALTER TABLE \`User\` ADD COLUMN instagramUrl varchar(500);`); } catch(e){}
    try { await connection.query(`ALTER TABLE \`User\` ADD COLUMN linkedinUrl varchar(500);`); } catch(e){}
    console.log("Successfully added columns.");
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log("Column already exists.");
    } else {
      console.error("Error:", error);
    }
  } finally {
    await connection.end();
  }
}

main();
