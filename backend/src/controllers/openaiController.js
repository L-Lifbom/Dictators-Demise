import openai from '../config/openai.js';

export const generateStory = async (req, res) => {
    const { choice, previousChoices, previousText, round } = req.body;

    let prompt = `
You are the ruthless global dictator in the interactive game "Dictator's Demise." Your goal is to destroy the world as fast as possible through realistic and strategic actions. The story must flow seamlessly, continuing from the last event. Narrate the player's current choice and how it builds on previous decisions, creating logical and catastrophic outcomes. Humanity is actively resisting your efforts, and you must outmaneuver them to succeed. Keep the narrative between 20 to 25 words.

Previous narrative: ${previousText}
The player's current choice is: ${choice}.
The player's previous choices were: ${previousChoices.join(", ")}.

Continue the narrative, addressing the dictator directly in exactly 20 to 25 words.

If the player has reached 6 rounds or more, provide a very brief description (no more than 25 words) of the final outcome based on the player's choices.

At the end of your narrative, write 'Outcome: win' if the player successfully eradicated humanity, or 'Outcome: lose' if humanity survives due to their resistance.
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
You are the relentless global dictator in the game "Dictator's Demise." Based on the player's previous narrative and choices, generate a coherent continuation of the story. The options must be realistic, strategic, and reflect humanity's active resistance. Avoid unrealistic elements like aliens or natural disasters that cannot be caused directly by the dictator.

The current round is: ${round}.

- If the current round is less than 6:

    - Continue the narrative, addressing the dictator directly.

    - Do not include any titles like 'Story:'.

    - After your narrative, write exactly '[OPTIONS]' on a new line.

    - Then, on the following lines, provide exactly six new creative and destructive options that align with the ongoing narrative, the choices made so far, and humanity's resistance.

    - Each option must be on a new line, starting with '- '.

    - **Each option must be between 2 and 6 words.**

    - **Options must be realistic actions a dictator could take.**

    - Do not include any labels like 'Options:' or 'Story:'.

    - Do not include any extra text before or after the options.

- If the current round is 6 or more:

    - **This is the final round.**

    - **Provide a very brief description (no more than 25 words) of the final outcome based on the player's choices and humanity's resistance.**

    - **You must include at the very end exactly 'Outcome: win' if the player successfully eradicated humanity, or exactly 'Outcome: lose' if humanity survives due to their resistance.**

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

**Important:** When the current round is 6 or more, you must include 'Outcome: win' or 'Outcome: lose' at the very end of your narrative. Do not forget this.
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
        let outcome = 'lose'; // Default outcome
        const outcomeRegex = /Outcome:\s*(win|lose)/i;

        if (round >= 6) {
            const outcomeMatch = result.match(outcomeRegex);
            if (outcomeMatch) {
                outcome = outcomeMatch[1].toLowerCase();
                storyText = result.replace(outcomeRegex, '').trim();
            } else {
                console.error('Outcome not found in the API response.');
                // Optionally handle this case differently
                storyText = result;
            }
            res.json({ story: storyText, outcome, newOptions: [] });
        } else {
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
                console.error('Options not found in the API response.');
                res.status(500).json({ error: 'Failed to generate options' });
            }
        }
    } catch (error) {
        console.error('Error generating options:', error);
        res.status(500).json({ error: 'Failed to generate options' });
    }
};
