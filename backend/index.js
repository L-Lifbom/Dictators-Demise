import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

// import { connectDB } from './config/db.js';
// import dataRoutes from './routes/dataRoutes.js';
import openaiRoutes from './src/routes/openaiRoutes.js';  // Import the OpenAI routes
import openai from './src/config/openai.js';

dotenv.config();
// connectDB();

const port = process.env.PORT || 5001;
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',  // Or the frontend's URL
  }));

app.use(express.json());


const checkOpenAIConnection = async () => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: 'Ping' }],
            max_tokens: 10,
        });
        console.log("OpenAI Connection Successful:", response.choices[0].message.content);
    } catch (error) {
        console.error("OpenAI Connection Test Failed:", error.message);
    }
};


// Use the routes
// app.use('/api', dataRoutes);
app.use('/api', openaiRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, async () => {
    console.log(`Server is running on http://localhost:${port}`);
    await checkOpenAIConnection();
});
