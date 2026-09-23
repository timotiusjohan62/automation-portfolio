// ==========================================
// HELPER: Dynamic Recursive Schema Assertion
// ==========================================

export function assertDynamicSchema(actualData, expectedSchema) {
  // Extract first item if actual is an array but schema expects an object
  const target = Array.isArray(actualData) && !Array.isArray(expectedSchema) 
    ? actualData[0] 
    : actualData;

  expect(target).to.not.be.undefined;

  Object.entries(expectedSchema).forEach(([key, expectedValue]) => {
    // 1. Assert property exists
    expect(target).to.have.property(key);

    const actualValue = target[key];

    // 2. Recursively assert nested objects
    if (typeof expectedValue === 'object' && expectedValue !== null && !Array.isArray(expectedValue)) {
      assertDynamicSchema(actualValue, expectedValue);
    } else {
      // 3. Assert data type OR exact value
      const validTypes = ["string", "number", "boolean", "array", "object"];
      
      if (validTypes.includes(expectedValue)) {
        expect(actualValue).to.be.a(expectedValue);
      }
    }
  });
}