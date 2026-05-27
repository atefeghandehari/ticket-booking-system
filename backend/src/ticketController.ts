import { Request, Response } from 'express';
import redis from './redisClient';

const TICKET_KEY = 'flash_sale_tickets';

export const getTickets = async (req: Request, res: Response) => {
  const count = await redis.get(TICKET_KEY);
  res.json({ available: count ? parseInt(count) : 0 });
};

export const bookTicket = async (req: Request, res: Response) => {
  const script = `
    local current = tonumber(redis.call('get', KEYS[1]) or '0')
    if current > 0 then
      redis.call('decr', KEYS[1])
      return 1
    else
      return 0
    end
  `;

  const result = await redis.eval(script, 1, TICKET_KEY);

  if (result === 1) {
    res.json({ success: true, message: 'Ticket successfully booked' });
  } else {
    res.status(400).json({ success: false, message: 'Sold out! No tickets left.' });
  }
};