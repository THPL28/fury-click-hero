const test = require('node:test');
const assert = require('node:assert/strict');
require('reflect-metadata');
require('../scripts/register-paths.cjs');

test('health endpoint returns ok payload', async () => {
  const { createHttpServer } = require('../dist/infrastructure/http/server.js');
  const app = createHttpServer();
  const server = app.listen(0);

  await new Promise((resolve) => server.once('listening', resolve));

  const address = server.address();
  const response = await fetch(`http://127.0.0.1:${address.port}/api/health`);
  const body = await response.json();

  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));

  assert.equal(response.status, 200);
  assert.equal(body.status, 'ok');
  assert.equal(typeof body.timestamp, 'string');
});
