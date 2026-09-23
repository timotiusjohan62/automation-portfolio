# Data-Driven API Automation Framework (Cypress & SQLite)

A robust, highly flexible, data-driven API testing framework built with **Cypress** and **SQLite**. This architecture completely decouples test logic from test data, allowing you to build complex sequential workflows (CRUD chains), inject dynamic variables, and execute recursive schema and status assertions entirely through database configuration.

---

## 🚀 Key Features

* **SQLite-Driven Execution:** Test flows, steps, payloads, and validations are managed directly within a local database.
* **Sequential Workflows:** Chain multiple dependent requests together (e.g., `POST` -> `GET` -> `PUT` -> `DELETE`) within a single test case.
* **Dynamic Variable Injection (`{{variable}}`):** Extract values from API responses and seamlessly inject them into subsequent paths, JSON payloads, and expected schemas.
* **Multi-Variable Extraction:** Extract multiple parameters at once using JSON mappings (e.g., extracting both `id` and `slug`).
* **Recursive Schema Validation:** Dynamically assert deeply nested JSON objects, data types (`string`, `number`, `boolean`, `array`), or exact values using a modular helper.
* **Flexible HTTP Status Assertion:** Define expected status codes per step (supporting both positive checks and negative error handling).
* **Automated Execution Reporting:** Automatically logs every API hit, request payload, response body, and pass/fail status into a clean JSON report.

---

## 📁 Project Directory Structure

```text
├── db/
│   └── TEST_DATA.db            # SQLite database containing test flows
├── cypress/
│   ├── e2e/
│   │   └── api-flow.cy.js      # Main Cypress test runner & loop
│   ├── fixtures/
│   │   └── dbRows.json         # Generated fixture synchronized from SQLite
│   └── support/
│       └── schemaHelper.js     # Recursive schema validation helper
├── fetch-data.mjs              # Node.js script to pull SQLite data into fixtures
├── package.json
└── README.md
