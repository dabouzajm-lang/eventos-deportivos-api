import express from 'express';
import healthRouter from './routes/health.router.js';
import eventsRouter from './routes/events.router.js';

const app = express();

app.use(express.json());

app.use('/api/health', healthRouter);
app.use('/api/events', eventsRouter);

export default app;