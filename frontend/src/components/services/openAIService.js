import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const doOpenAICall = async (messages, temperature = 0.5, model = 'gpt-3.5-turbo') => {
  const url = 'https://api.openai.com/v1/chat/completions';

  const response = await axios.post(
    url,
    {
      model,
      messages,
      temperature,
      max_tokens: 1024,
    },
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};
