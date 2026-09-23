import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function generateTestData() {
  return new Promise((resolve, reject) => {
    // Connect to the DB in read-only mode to prevent accidental file creation
    const dbPath = path.join(__dirname, 'db/TEST_DATA');
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        console.error(`❌ Could not find database at: ${dbPath}`);
        return reject(err);
      }
    });

    // Query the updated DATA table
    db.all('SELECT * FROM DATA', [], (err, rows) => {
      db.close();
      
      if (err) {
        console.error('❌ Query failed:', err);
        return reject(err);
      }
      
      try {
        const outputPath = path.join(__dirname, 'cypress/fixtures/dbRows.json');
        fs.writeFileSync(outputPath, JSON.stringify(rows, null, 2));
        console.log(`✅ Successfully saved ${rows.length} steps to dbRows.json`);
        resolve();
      } catch (writeErr) {
        reject(writeErr);
      }
    });
  });
}

generateTestData().catch(err => process.exit(1));