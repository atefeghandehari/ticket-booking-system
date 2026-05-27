import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { login } from './auth';
import { getTickets, bookTicket } from './ticketController';
import redis from './redisClient';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/login', login);
app.get('/api/tickets', getTickets);
app.post('/api/book', bookTicket);

const PORT = process.env.PORT || 5000;

const initializeTickets = async () => {
  const exists = await redis.exists('flash_sale_tickets');
  if (!exists) {
    await redis.set('flash_sale_tickets', '1000');
  }
};

app.listen(PORT, async () => {
  await initializeTickets();
  console.log(`Server running on port ${PORT}`);
});