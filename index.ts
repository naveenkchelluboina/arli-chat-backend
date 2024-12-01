import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001; // Allow dynamic port if needed (e.g., in production)

app.use(
cors({
    origin: '*', // Allow all origins for testing (update this in production)
})
);
app.use(bodyParser.json());

const API_KEY = process.env.API_KEY;
const MODEL_NAME = 'Meta-Llama-3.1-8B-Instruct';

app.get('/api/test', (req, res) => {
    res.json({ message: 'The server is up and running!' });
});

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  const formattedMessages = messages.map((msg: any) => ({
    role: msg.role,
    content: msg.content,
  }));

  try {
    const response = await axios.post(
      'https://api.arliai.com/v1/chat/completions',
      {
        model: MODEL_NAME,
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 150,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    //console.error(error.response?.data || error.message);
    res.status(500).send('Error communicating with Arli AI');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});