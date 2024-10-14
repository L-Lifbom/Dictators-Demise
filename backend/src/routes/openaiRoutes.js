import express from 'express';
import { generateOptions, generateStory } from '../controllers/openaiController.js';

const openaiRoutes = express.Router();

// Story route
openaiRoutes.post('/story', (req, res) => {
    console.log('Request received for story:', req.body);
    generateStory(req, res);
});

// Options route
openaiRoutes.post('/options', (req, res) => {
    console.log('Request received for options:', req.body);
    generateOptions(req, res);
});

export default openaiRoutes;
