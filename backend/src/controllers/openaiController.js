import openai from '../config/openai.js';

// Function to generate the story based on player's choice
export const generateStory = async (req, res) => {
    const { choice, previousChoices, round } = req.body;

    // Construct the prompt for OpenAI to generate the next part of the story
    let prompt = `
    You are the ruthless global dictator in the game "Dictator's Demise." Your goal is to destroy the world as fast as possible. Based on the player's current choice, generate a catastrophic outcome that escalates the global crisis in exactly 45-50 words.

    The player's current choice is: ${choice}.
    The player's previous choices were: ${previousChoices.join(", ")}.

    The narrative must be immersive and directed at the dictator, showing the consequences of the latest decision. Do not break the role of the narrator. Provide a short, concise result.
    If the player has reached 10 rounds or more, focus on complete global destruction or a faint chance of survival for humanity.
    `;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            max_tokens: 500,
            temperature: 0.8,
        });

        const story = response.choices[0].message.content.trim();

        res.json({ story });

    } catch (error) {
        console.error('Error generating story:', error);
        res.status(500).json({ error: 'Failed to generate story' });
    }
};

// Function to generate new destructive options
export const generateOptions = async (req, res) => {
    const { choice, previousChoices, round } = req.body;

    // Construct the prompt for OpenAI to generate the story and the new options
    let prompt = `
    You are the ruthless global dictator in the game "Dictator's Demise." Based on the player's current choice, generate a catastrophic outcome that escalates the global crisis in exactly 45-50 words. Then, provide exactly six new, creative, and destructive choices, each consisting of 2-5 words, to bring humanity closer to ruin.

    The player's current choice is: ${choice}.
    The player's previous choices were: ${previousChoices.join(", ")}.

    Provide the result in this format:
    1. Story: A brief narrative of the current catastrophic outcome.
    2. Options: A numbered list of six new, destructive actions to choose from.
    `;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            max_tokens: 500,
            temperature: 0.8,
        });

        const result = response.choices[0].message.content.trim();

        // Extract story and options from the response
        const [story, optionsPart] = result.split('Options:');
        const newOptions = optionsPart
            ? optionsPart.trim().split('\n').map(option => option.replace(/^\d+\.\s*/, '').trim())
            : [];

        res.json({ story: story.trim(), newOptions });

    } catch (error) {
        console.error('Error generating options:', error);
        if (!res.headersSent) {
            return res.status(500).json({ error: 'Failed to generate options' });
        }
    }
};

// Helper function to extract the new options from the AI's response
function extractOptions(storyText) {
    const options = [];
    const regex = /(?:\n|^)Option \d+:\s*(.+?)(?=(?:\nOption \d+:|\n*$))/g;
    let match;
    while ((match = regex.exec(storyText)) !== null) {
        options.push(match[1].trim());
    }
    return options.length > 0
        ? options
        : [
              "Initiate a global blackout",
              "Release a deadly airborne toxin",
              "Hack into defense systems to cause misfires",
              "Spread disinformation to incite riots",
              "Trigger a catastrophic climate event",
              "Sabotage international peace treaties",
          ];
}
