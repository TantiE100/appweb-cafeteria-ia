import express from 'express';
import cors from 'cors';
import { router } from './routes/index.js';
import { noEncontrado, manejarErrores } from './middleware/errores.js';

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:4200', allowedHeaders: ['Content-Type', 'X-Sesion'] }));
app.use(express.json({ limit: '100kb' }));

app.get('/api/salud', (req, res) => res.json({ ok: true }));
app.use('/api', router);
app.use(noEncontrado);
app.use(manejarErrores);

app.listen(port, () => {
  console.log(`API de Santi's Coffee en http://localhost:${port}/api`);
});
