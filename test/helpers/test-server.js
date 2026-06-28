import app from '../../src/app.js';

export const startTestServer = async () => {
  let server;

  await new Promise((resolve) => {
    // Bind to 127.0.0.1 and an ephemeral port to avoid CI conflicts with PORT=3000.
    server = app.listen(0, '127.0.0.1', resolve);
  });

  const { port } = server.address();

  return {
    baseUrl: `http://127.0.0.1:${port}`,
    close: async () => {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }
  };
};
