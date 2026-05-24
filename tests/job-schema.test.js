const test = require('node:test');
const assert = require('node:assert/strict');

test('dispatchJobSchema accepts valid payload', async () => {
  const { dispatchJobSchema } = require('../dist/interface-adapters/validation/job.schema.js');

  const result = dispatchJobSchema.parse({
    target: 'john@example.com',
    type: 'email',
    payload: { subject: 'hello' },
  });

  assert.equal(result.target, 'john@example.com');
  assert.equal(result.type, 'email');
  assert.deepEqual(result.payload, { subject: 'hello' });
});

test('dispatchJobSchema rejects unsupported type', async () => {
  const { dispatchJobSchema } = require('../dist/interface-adapters/validation/job.schema.js');

  assert.throws(() => {
    dispatchJobSchema.parse({
      target: 'john@example.com',
      type: 'sms',
      payload: {},
    });
  });
});
