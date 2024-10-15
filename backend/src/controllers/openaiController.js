import openai from '../config/openai.js';

export const generateStory = async (req, res) => {
    const { choice, previousChoices, previousText, round } = req.body;

    let prompt = `
You are the ruthless global dictator in the interactive game "Dictator's Demise." Your goal is to destroy the world as fast as possible. The story must flow seamlessly, continuing from the last event. You must narrate the player's current choice and how it builds on previous decisions, creating logical and catastrophic outcomes. Keep the narrative between 20 to 25 words.

Previous narrative: ${previousText}
The player's current choice is: ${choice}.
The player's previous choices were: ${previousChoices.join(", ")}.

Continue the narrative, addressing the dictator directly in exactly 20 to 25 words.

If the player has reached 6 rounds or more, provide a very brief description (no more than 25 words) of the final outcome based on the player's choices.

At the end of your narrative, write 'Outcome: win' if the player successfully eradicated humanity, or 'Outcome: lose' if humanity survives.
    `;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            max_tokens: 70,
            temperature: 0.8,
        });

        const story = response.choices[0].message.content.trim();

        res.json({ story });

    } catch (error) {
        console.error('Error generating story:', error);
        res.status(500).json({ error: 'Failed to generate story' });
    }
};

export const generateOptions = async (req, res) => {
    const { choice, previousChoices, previousText, round } = req.body;

    let prompt = `
You are the relentless global dictator in the game "Dictator's Demise." Based on the player's previous narrative and choices, generate a coherent continuation of the story.

The current round is: ${round}.

- If the current round is less than 6:

    - Continue the narrative, addressing the dictator directly.

    - Do not include any titles like 'Story:'.

    - After your narrative, write exactly '[OPTIONS]' on a new line.

    - Then, on the following lines, provide exactly six new creative and destructive options that align with the ongoing narrative and the choices made so far.

    - Each option must be on a new line, starting with '- '.

    - **Each option must be between 2 and 6 words.**

    - Do not include any labels like 'Options:' or 'Story:'.

    - Do not include any extra text before or after the options.

- If the current round is exactly 6:

    - **Provide a very brief description (no more than 25 words) of the final outcome based on the player's choices.**

    - **Determine if the player has successfully eradicated humanity or if humanity survives.**

    - At the end of your narrative, write 'Outcome: win' if the player successfully eradicated humanity, or 'Outcome: lose' if humanity survives.

    - **Do not provide new options in this case.**

Ensure that the output strictly follows this format:

[Narrative]

[If round <6:]

[OPTIONS]

- Option 1

- Option 2

- Option 3

- Option 4

- Option 5

- Option 6

[Each option must be between 2 and 6 words.]

Previous narrative: ${previousText}
The player's current choice is: ${choice}.
The player's previous choices were: ${previousChoices.join(", ")}.
    `;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
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

        console.log('OpenAI API Response:', result);

        let storyText = '';
        let newOptions = [];
        const outcomeMatch = result.match(/Outcome:\s*(win|lose)/i);

        if (round === 6) {
            // Game over scenario
            storyText = result.replace(/Outcome:\s*(win|lose)/i, '').trim();
            const outcome = outcomeMatch ? outcomeMatch[1].toLowerCase() : null;
            res.json({ story: storyText, outcome, newOptions: [] });
        } else {
            // Game continues
            const optionsStartIndex = result.indexOf('[OPTIONS]');
            if (optionsStartIndex !== -1) {
                storyText = result.substring(0, optionsStartIndex).trim();
                const optionsPart = result.substring(optionsStartIndex + '[OPTIONS]'.length).trim();
                const optionsLines = optionsPart.split('\n');
                newOptions = optionsLines
                    .map(line => line.replace(/^- /, '').trim())
                    .filter(line => line !== '' && line.split(' ').length >= 2 && line.split(' ').length <= 6);
                res.json({ story: storyText, newOptions });
            } else {
                // If options are not found, return an error
                console.error('Options not found in the API response.');
                res.status(500).json({ error: 'Failed to generate options' });
            }
        }
    } catch (error) {
        console.error('Error generating options:', error);
        res.status(500).json({ error: 'Failed to generate options' });
    }
};
