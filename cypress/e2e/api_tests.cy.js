import credentials from "../support/credentials.json";
import rows from "../fixtures/dbRows.json";
import { assertDynamicSchema } from "../support/schemaHelper.js";

const groupedData = Cypress._.groupBy(rows, "TEST_CASE_NAME");

describe("Data-Driven Flexible API Suite", () => {
  const baseUrl = credentials.BASE_URL;

  // Global array to store results of all hits in this run
  let executionLogs = [];

  // Before all tests start, ensure the results file is fresh or empty
  before(() => {
    executionLogs = [];
  });

  // After all tests finish, write the complete history to a JSON report file
  after(() => {
    cy.writeFile("cypress/results/api-execution-report.json", executionLogs);
  });

  Object.entries(groupedData).forEach(([testCaseName, steps]) => {
    it(`Executes Flow: ${testCaseName}`, () => {
      const sortedSteps = Cypress._.sortBy(steps, "STEP_ORDER");
      const context = {};

      const injectVars = (rawString) => {
        if (!rawString) return rawString;
        let processed = rawString;
        Object.keys(context).forEach((key) => {
          processed = processed.split(`{{${key}}}`).join(context[key]);
        });
        return processed;
      };

      cy.wrap(sortedSteps).each((step) => {
        cy.then(() => {
          cy.log(`Executing Step ${step.STEP_ORDER}: ${step.TITLE}`);

          const dynamicPath = injectVars(step.PATH);
          const rawPayload = injectVars(step.PAYLOAD);
          const requestBody = rawPayload ? JSON.parse(rawPayload) : undefined;

          if (dynamicPath.includes("{{")) {
            throw new Error(`Unresolved variable in PATH: ${dynamicPath}`);
          }

          cy.request({
            method: step.TYPE,
            url: `${baseUrl}${dynamicPath}`,
            body: requestBody,
            failOnStatusCode: false,
          }).then((response) => {
            const expectedStatus = step.EXPECTED_STATUS || 200;
            
            // Determine if the hit passed or failed
            const isPassed = response.status === expectedStatus;

            // 🚨 STORE THE RESULT OF THIS HIT
            executionLogs.push({
              testCase: testCaseName,
              stepOrder: step.STEP_ORDER,
              stepTitle: step.TITLE,
              method: step.TYPE,
              endpoint: `${baseUrl}${dynamicPath}`,
              requestPayload: requestBody || null,
              expectedStatus: expectedStatus,
              actualStatus: response.status,
              statusMatch: isPassed ? "PASS" : "FAIL",
              responseBody: response.body,
              timestamp: new Date().toISOString()
            });

            expect(response.status).to.eq(
              expectedStatus,
              `Expected HTTP ${expectedStatus} but got ${response.status}`,
            );

            if (step.EXPECTED_SCHEMA) {
              const rawSchema = injectVars(step.EXPECTED_SCHEMA);
              const expectedSchema = JSON.parse(rawSchema);
              assertDynamicSchema(response.body, expectedSchema);
            }

            if (step.EXTRACT_KEY) {
              try {
                const extractionMap = JSON.parse(step.EXTRACT_KEY);
                Object.entries(extractionMap).forEach(([contextKey, responsePath]) => {
                  const val = responsePath.split('.').reduce((acc, part) => acc && acc[part], response.body);
                  if (val !== undefined) {
                    context[contextKey] = val;
                  }
                });
              } catch (e) {
                const extractedValue = response.body.id || response.body.data?.id;
                if (!extractedValue) {
                  throw new Error(`Failed to extract data for key: ${step.EXTRACT_KEY}`);
                }
                context[step.EXTRACT_KEY] = extractedValue;
              }
            }
          });
        });
      });
    });
  });
});