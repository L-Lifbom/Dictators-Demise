import OpenAI from "openai";

const openai = new OpenAI({
    organization: "org-YMlEsT9g7onoLqWJmnNdXuCG",
    project: "$PROJECT_ID",
});

module.exports = openai;