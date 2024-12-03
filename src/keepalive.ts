import axios from 'axios';
import cron from 'node-cron';

const RENDER_URL = process.env.RENDER_URL || 'https://arli-chat-backend.onrender.com/api/test';

export const startKeepAlive = () => {
  // Run every 5 minutes to prevent the 10-minute inactivity shutdown
  cron.schedule('*/5 * * * *', async () => {
    try {
      const response = await axios.get(`${RENDER_URL}/api/test`);
      console.log(`[${new Date().toISOString()}] Keepalive ping:`, response.data);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Keepalive failed:`, error);
    }
  });
  
  console.log('Keepalive cron job started');
}; 