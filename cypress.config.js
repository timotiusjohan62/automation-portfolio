const { defineConfig } = require("cypress");
const sqlite3 = require("sqlite3").verbose();

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        queryDb({ dbPath, query }) {
          return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(dbPath);
            db.all(query, [], (err, rows) => {
              db.close();
              if (err) return reject(err);
              resolve(rows);
            });
          });
        },
      });
    },
  },
});
