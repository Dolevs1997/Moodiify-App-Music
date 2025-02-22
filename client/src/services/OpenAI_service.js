/* eslint-disable no-undef */
import axios from "axios";

async function getSongSuggestions(text) {
  console.log(process.env.REACT_APP_OPENAI_API_KEY);
  console.log(text);
  const response = await axios.post(
    "https://api.openai.com/v1/engines/davinci/completions",
    {
      prompt: text,
      max_tokens: 100,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      },
    }
  );
  return response.data.choices[0].text;
}

export { getSongSuggestions };
