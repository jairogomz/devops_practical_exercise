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

test('GET /version returns APP_VERSION from the environment', async () => {
  // Keep the expected version explicit so CI catches broken runtime configuration.
  process.env.APP_VERSION = 'test-version';

  const response = await fetch(`${baseUrl}/version`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(body, { version: 'test-version' });
});
