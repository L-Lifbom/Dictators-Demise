import dotenv from 'dotenv';
import express from 'express';

import { connectDB } from './config/db.js';
import dataRoutes from './routes/dataRoutes.js';
import openaiRoutes from './routes/openaiRoutes.js';


dotenv.config();
connectDB();

const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());

// Routes
app.use('/api', dataRoutes);
app.use('/api', openaiRoutes);


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

