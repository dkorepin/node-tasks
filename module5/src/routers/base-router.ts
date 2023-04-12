import express, { Request, Response } from "express";

export const baseRuter = express.Router({ mergeParams: true });

baseRuter.get("/", (_req: Request, res: Response) => {
  res.json({ isOk: true });
});
