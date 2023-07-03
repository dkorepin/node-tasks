import express, { Request, Response } from "express";
import { AuthService } from "../services/auth-service";
import { makeServiceLogger } from "../logger";
import { StatusCodes } from "http-status-codes";

export const baseRuter = express.Router({ mergeParams: true });
const serviceLogger = makeServiceLogger("base-service");

/**
 * @swagger
 * components:
 *   schemas:
 *     Token:
 *       type: object
 *       required:
 *         - token
 *       properties:
 *         token:
 *           type: string
 *           description: Token string
 *       example:
 *         token: KKd764rJHDjhd&dh$ldklldjk6329
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginCredentials:
 *       type: object
 *       required:
 *         - login
 *         - password
 *       properties:
 *         login:
 *           type: string
 *           description: User name
 *         password:
 *           type: string
 *           description: User password
 *       example:
 *         login: Denis
 *         password: '0000'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *       example:
 *         message: 'Error'
 */

/**
 * @swagger
 * /login:
 *   get:
 *     tags:
 *       - Login
 *     summary: Login to the application
 *     description: Receives token for working app
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginCredentials'
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Token'
 *       403:
 *         description: user not found
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Error'
 */
baseRuter
  .post("/login", serviceLogger.method("login"), async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);

    serviceLogger.logger.warn("Result", result);
    if (!result.ok) return res.status(StatusCodes.FORBIDDEN).json({ message: result.message });

    res.status(StatusCodes.OK).json({ token: result.data });
  })
  .get("/", (_req: Request, res: Response) => {
    res.json({ isOk: true });
  });
