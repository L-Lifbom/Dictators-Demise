# Dictator's Demise
Dictator's Demise is a interactive web experience where users play the role of a global dictator and make decisions to destroy the world as fast as possible. The site allows users to take various actions like unleashing viruses, crashing the global economy, launching wars, and destabilizing alliances, with the goal of creating world-ending scenarios.

## About
- Purpose: To provide a fun and educational experience where users explore the potential global consequences of catastrophic decisions.

- Target Audience: Students, educators, gamers, and anyone interested in learning about global crises and geopolitical issues.

- Ethical and Safe Usage Considerations: The service ensures that only a name and score are stored, and no sensitive personal data is collected. Since users interact by pressing buttons instead of inputting text, there is no risk of misuse or bias based on gender or other personal attributes.

- Other Key Development Considerations: I chose to use a less powerful GPT model to save on costs. Additionally, I opted for a REST API because it is more efficient for my small backend. React was selected for the frontend as it made integration smoother, even though it is more complex to write.

## Installation
- Ensure you have **Node.js** installed on your system. Download it [here](https://nodejs.org/en/download/current).

- To install the project, clone the repository into your preferred directory using the command: 
  `git clone <repository-url>`

- Create a .env file in the backend root directory with the necessary environment variables which consists of:
  - `OPENAI_API_KEY=` https://platform.openai.com/

- Install the required dependencies from the root by executing: 
  `npm run install-all`

- Start the projects frontend and backend by running: 
  `npm start`

- Open your browser and navigate to: 
`http://localhost:5173`