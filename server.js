import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const exampleDir = path.join(__dirname, 'docs');
const libDir = path.join(__dirname, 'lib');

app.use(express.static(exampleDir));
// app.use('/lib', express.static(libDir)); // ← This line exposes /lib

app.listen(PORT, () => {
  console.log(`Demo running at http://localhost:${PORT}`);
});
