import express from 'express';
import dataRoutes from './routes/dataRoutes.js';
import openaiRoutes from './routes/openaiRoutes.js';

const app = express();
app.use(express.json());

// Routes
app.use('/api', dataRoutes);
app.use('/api', openaiRoutes);

export default app;
