const dotenv = require("dotenv");
const OpenAI = require("openai");
dotenv.config();

const openaiAPIKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI(openaiAPIKey);
const SongSuggestions = async (text) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "developer", content: text }],
    store: true,
  });
  const suggestions = completion.data.choices[0].message.content;
  const songSuggestions = suggestions.split("\n");
  console.log(songSuggestions);
  return songSuggestions;
};

module.exports = { SongSuggestions };
