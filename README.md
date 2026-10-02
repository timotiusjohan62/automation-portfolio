# Data-Driven API Automation Framework (Cypress & SQLite)

A robust, highly flexible, data-driven API testing framework built with **Cypress** and **SQLite**. This architecture completely decouples test logic from test data, allowing you to build complex sequential workflows (CRUD chains), inject dynamic variables, and execute recursive schema and status assertions entirely through database configuration.

---

## 🚀 Key Features

* **SQLite-Driven Execution:** Test flows, steps, payloads, and validations are managed directly within a local database, eliminating hardcoded test data.
* **Sequential Workflows:** Chain multiple dependent requests together (e.g., `POST` -> `GET` -> `PUT` -> `DELETE`) within a single, cohesive test case.
* **Dynamic Variable Injection (`{{variable}}`):** Extract values from API responses and seamlessly inject them into subsequent paths, JSON payloads, and expected schemas.
* **Multi-Variable Extraction:** Extract multiple parameters simultaneously using JSON mappings (e.g., pulling both `user_id` and `auth_token` from a single login response).
* **Recursive Schema Validation:** Dynamically assert deeply nested JSON objects, enforce data types (`string`, `number`, `boolean`, `array`), or match exact values using a modular helper.
* **Flexible HTTP Status Assertion:** Define expected status codes per step, supporting both positive validations (e.g., `200`, `201`) and negative error handling (e.g., `400`, `401`, `404`).
* **Automated Execution Reporting:** Automatically logs every API hit, request payload, response body, and pass/fail status into a clean JSON report for CI/CD integration.

---

## 📁 Project Directory Structure

```text
├── db/
│   └── TEST_DATA.db            # SQLite database containing test flows, endpoints, and payloads
├── cypress/
│   ├── e2e/
│   │   └── api-flow.cy.js      # Main Cypress test runner & execution loop
│   ├── fixtures/
│   │   └── dbRows.json         # Generated fixture synchronized from SQLite
│   └── support/
│       └── schemaHelper.js     # Recursive schema & type validation helper
├── cypress.config.js           # Cypress environment and reporting configuration
├── fetch-data.mjs              # Node.js script to query SQLite data and generate fixtures
├── package.json                # Project dependencies and npm scripts
└── README.md                   # Project documentation

```

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js** (v16.x or higher recommended)
* **npm** (v8.x or higher)
* **SQLite3** (For viewing/editing the database manually, though the framework handles reads automatically)

---

## 📦 Installation & Setup

1. **Clone the repository:**
```bash
git clone <your-repository-url>
cd <repository-name>

```


2. **Install dependencies:**
```bash
npm install

```


3. **Configure the Database:**
Ensure your `db/TEST_DATA.db` is populated with your test cases. (Optional: Use a database viewer like DB Browser for SQLite to manage your test configurations).

---

## ⚙️ How It Works

This framework separates the **Test Engine** (Cypress) from the **Test Data** (SQLite). The execution lifecycle follows three distinct steps:

1. **Data Synchronization (`fetch-data.mjs`):** Before tests run, this script queries the SQLite database, extracts the active test flows, and writes them to `cypress/fixtures/dbRows.json`.
2. **Execution Engine (`api-flow.cy.js`):** Cypress reads the generated JSON fixture and iterates through the test cases.
3. **Dynamic State Management:** As Cypress executes each step, it stores mapped variables in memory. If step 2 requires an ID generated in step 1, the framework replaces `{{id}}` in the payload or URL before firing the request.

### 💡 Example: Dynamic Variable Injection

**Step 1: Create a User (POST)**

* **Extract Mapping:** `{"id": "response.body.data.id"}`
* The framework saves the new ID to memory.

**Step 2: Update the User (PUT)**

* **Endpoint in DB:** `/api/users/{{id}}`
* **Payload in DB:** `{"name": "Updated Name", "userId": "{{id}}"}`
* The framework automatically injects the extracted ID before sending the request.

---

## 🚀 Execution Commands

**1. Fetch data and generate fixtures:**
Always run this before executing tests if you have modified the SQLite database.

```bash
node fetch-data.mjs

```

**2. Run tests in Headless Mode (CLI):**
Ideal for CI/CD pipelines.

```bash
npx cypress run

```

**3. Run tests in Interactive Mode (UI):**
Ideal for debugging and test creation.

```bash
npx cypress open

```

**4. Combined Script (Recommended):**
You can add a custom script to your `package.json` to fetch data and run tests in one command:

```json
"scripts": {
  "test:api": "node fetch-data.mjs && npx cypress run"
}

```

Run it via: `npm run test:api`

---

## 📊 Reporting

Upon completion of the test suite, the framework generates an automated execution report.

* **Location:** `cypress/results/api-execution-report.json` (or configured directory)
* **Contents:** Detailed logs of every request, injected variables, response times, HTTP statuses, and schema validation results.