const dotenv = require("dotenv");
const OpenAI = require("openai");
dotenv.config();

const openaiAPIKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI(openaiAPIKey);
const SongSuggestions = async (text) => {
  console.log("text: ", text);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: text.role,
        content:
          text.text +
          "only song name - artist name - year and return it without any other information and not in a numbered list",
      },
    ],
    store: true,
  });
  console.log("completion message: \n", completion.choices[0].message.content);

  const suggestions = completion.choices[0].message.content;
  const songSuggestions = suggestions
    .substring(suggestions.indexOf("1.").valueOf())
    .split("\n");

  return songSuggestions;
};

module.exports = { SongSuggestions };
