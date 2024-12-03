import express, { Request, Response, Router } from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';
import { startKeepAlive } from './src/keepalive';

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

// Add interface for Message
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const router: Router = express.Router();

// After the imports, add a simple logger
const logger = (message: string, data?: any) => {
  console.log(`[${new Date().toISOString()}] ${message}`, data ? data : '');
};

router.get('/api/test', (req: any, res: any) => {
    logger('Test endpoint called');
    res.json({ message: 'The server is up and running!' });
});

router.post('/api/chat', async (req: any, res: any) => {
  logger('Chat request received', { model: req.body.model });
  const { messages, model = MODEL_NAME } = req.body;

  // Validate request
  if (!messages || !Array.isArray(messages)) {
    logger('Invalid request format', req.body);
    return res.status(400).json({ error: 'Invalid messages format' });
  }

  const formattedMessages: Message[] = messages.map((msg: Message) => ({
    role: msg.role,
    content: msg.content,
  }));
  logger('Formatted messages', formattedMessages);

  try {
    logger('Sending request to Arli AI');
    const response = await axios.post(
      'https://api.arliai.com/v1/chat/completions',
      {
        model: model,
        messages: formattedMessages,
        repetition_penalty: 1.1,
        temperature: 0.7,
        top_p: 0.9,
        top_k: 40,
        max_tokens: 1024,
        stream: false
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    logger('Received response from Arli AI');

    if (!response.data?.choices?.[0]?.message?.content) {
      logger('Invalid response structure', response.data);
      throw new Error('Invalid response from Arli AI');
    }

    const reply = response.data.choices[0].message.content;
    logger('Sending successful response', { model, replyLength: reply.length });
    res.json({ 
      reply,
      model: model
    });
  } catch (error: any) {
    logger('Error in chat request', {
      error: error.message,
      details: error.response?.data
    });
    console.error('Arli AI Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Error communicating with Arli AI',
      details: error.response?.data || error.message 
    });
  }
});

app.use(router);

app.listen(PORT, () => {
  logger(`Server started`, {
    port: PORT,
    environment: process.env.NODE_ENV || 'development'
  });
  if (process.env.NODE_ENV === 'production') {
    startKeepAlive();
  }
});