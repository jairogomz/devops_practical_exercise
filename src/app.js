import express from 'express';

const app = express();

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/version', (_req, res) => {
  // APP_VERSION injected by the runtime environment.
  const version = process.env.APP_VERSION || '1.0.0';

  res.status(200).json({ version });
});

export default app;
