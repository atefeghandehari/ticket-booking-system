import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

export const login = (req: Request, res: Response) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username required' });
  }
  const token = jwt.sign({ username }, process.env.JWT_SECRET as string, { expiresIn: '2h' });
  res.json({ token });
};