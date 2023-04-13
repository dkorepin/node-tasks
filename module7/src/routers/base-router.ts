import express, { Request, Response } from "express";
import { AuthService } from "../services/auth-service";
import { makeServiceLogger } from "../logger";

export const baseRuter = express.Router({ mergeParams: true });
const serviceLogger = makeServiceLogger("base-service");

baseRuter
  .post("/login", serviceLogger.method("login"), async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);

    serviceLogger.logger.warn("Result", result);
    if (!result.ok) return res.status(403).json({ message: result.message });

    res.status(200).json({ token: result.data });
  })
  .get("/", (_req: Request, res: Response) => {
    res.json({ isOk: true });
  });
