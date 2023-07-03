import express, { Request, Response, NextFunction } from "express";
import { validateUser } from "../models/user/user-validation";
import { UsersService } from "../services/users-service";
import { makeServiceLogger } from "../logger";
import { sendResponse200, sendResponse400 } from "../helpers";
import { AuthService } from "../services/auth-service";
import { StatusCodes } from "http-status-codes";

export const usersRouter = express.Router({ mergeParams: true });

const serviceLogger = makeServiceLogger("user-service");

// test autosuggestion http://localhost:3000/users?search=elt&limit=3
usersRouter
  .route("/")
  .get(
    serviceLogger.method("get all"),
    AuthService.checkToken,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const search = req.query.search ? String(req.query.search) : "";
        const limit = req.query.limit ? String(req.query.limit) : "";
        const users = await UsersService.getFilteredUsers(search, limit);

        sendResponse200(res, { users });
      } catch (error) {
        serviceLogger.logger.error("Internal Server Error", error);

        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        next();
      }
    }
  )
  .post(
    serviceLogger.method("create new"),
    AuthService.checkToken,
    validateUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const oldUser = await UsersService.getUserByLogin(req.body.login);

        if (oldUser) return sendResponse400(res, serviceLogger, `User with id ${req.params.id} already exists`);

        const user = await UsersService.addNewUser(req.body);

        res.json({ user });
      } catch (error) {
        serviceLogger.logger.error("Internal Server Error", error);

        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        next();
      }
    }
  );

usersRouter
  .route("/:id")
  .all(serviceLogger.method("check id"), AuthService.checkToken, async (req: Request, res: Response, next) => {
    try {
      const userDTO = await UsersService.getUserById(req.params.id);

      if (!userDTO) return sendResponse400(res, serviceLogger, `User with id ${req.params.id} not found`);

      res.locals.user = userDTO;
      next();
    } catch (error) {
      serviceLogger.logger.error("Internal Server Error", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      next();
    }
  })
  .get(serviceLogger.method("get by id"), (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({ user: res.locals.user });
    } catch (error) {
      serviceLogger.logger.error("Internal Server Error", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      next();
    }
  })
  .delete(serviceLogger.method("delete"), async (_req: Request, res: Response, next: NextFunction) => {
    try {
      await UsersService.removeUser(res.locals.user.id);

      res.status(StatusCodes.OK).end();
    } catch (error) {
      serviceLogger.logger.error("Internal Server Error", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      next();
    }
  })
  .put(serviceLogger.method("update"), validateUser, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedUser = await UsersService.updateUser(res.locals.user, req.body);

      res.status(StatusCodes.OK).json({ user: updatedUser });
    } catch (error) {
      serviceLogger.logger.error("Internal Server Error", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      next();
    }
  });

usersRouter
  .route("/addToGroup/:id")
  .all(serviceLogger.method("add to group"), AuthService.checkToken, async (req: Request, res: Response, next) => {
    try {
      if (!req.params.id) return sendResponse400(res, serviceLogger, `User id is missing`);
      if (!req.body.id) return sendResponse400(res, serviceLogger, `Group id is missing`);
      next();
    } catch (error) {
      serviceLogger.logger.error("Internal Server Error", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      next();
    }
  })
  .post(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await UsersService.addUsersToGroup(req.params.id, req.body.id);

      if (result.ok) return res.json({ user: result.data });
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error: " + result.message });
    } catch (error) {
      serviceLogger.logger.error("Internal Server Error", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      next();
    }
  });
