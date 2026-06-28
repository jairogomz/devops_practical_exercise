import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';

import { startTestServer } from './helpers/test-server.js';

let testServer;
let baseUrl;

before(async () => {
  testServer = await startTestServer();
  baseUrl = testServer.baseUrl;
});

after(async () => {
  await testServer.close();
});

test('GET /health returns service status', async () => {
  // Health checks must stay small and deterministic for CI and container probes.
  const response = await fetch(`${baseUrl}/health`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(body, { status: 'ok' });
});
