import 'dotenv/config';

import app from './app.js';

const port = process.env.PORT || 3000;
const unusedVariable = true;

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
