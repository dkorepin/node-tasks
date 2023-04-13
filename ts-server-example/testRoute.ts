import { Request, Response } from 'express';
export const getUser = (req: Request, res: Response) => {
    res.send('All users');
  }