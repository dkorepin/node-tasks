import express, { Request, Response, NextFunction } from "express";
import { GroupService } from "../services/group-service";
import { validateGroup } from "../models/group/group-validation";
import { makeServiceLogger } from "../logger";
import { sendResponse400 } from "../helpers";
import { AuthService } from "../services/auth-service";
import { StatusCodes } from "http-status-codes";

export const groupRouter = express.Router();
const serviceLogger = makeServiceLogger("group-service");

groupRouter
  .route("/")
  .get(
    serviceLogger.method("get all"),
    AuthService.checkToken,
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const group = await GroupService.getAll();

        res.json({ group });
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
    validateGroup,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const oldGroup = await GroupService.getByName(req.body.name);

        if (oldGroup) return sendResponse400(res, serviceLogger, `Group with name ${req.body.name} already exists`);

        const group = await GroupService.addNew(req.body);

        res.json({ group });
      } catch (error) {
        serviceLogger.logger.error("Internal Server Error", error);

        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        next();
      }
    }
  );

groupRouter
  .route("/:id")
  .all(serviceLogger.method("check id"), AuthService.checkToken, async (req: Request, res: Response, next) => {
    try {
      const groupDTO = await GroupService.getById(req.params.id);

      if (!groupDTO) return sendResponse400(res, serviceLogger, `Group with id ${req.params.id} not found`);
      res.locals.group = groupDTO;

      next();
    } catch (error) {
      serviceLogger.logger.error("Internal Server Error", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      next();
    }
  })
  .get(serviceLogger.method("get by id"), (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({ group: res.locals.group });
    } catch (error) {
      serviceLogger.logger.error("Internal Server Error", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      next();
    }
  })
  .delete(serviceLogger.method("delete"), async (_req: Request, res: Response, next: NextFunction) => {
    try {
      await GroupService.remove(res.locals.group.id);

      res.status(StatusCodes.OK).end();
    } catch (error) {
      serviceLogger.logger.error("Internal Server Error", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      next();
    }
  })
  .put(serviceLogger.method("update"), validateGroup, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedGroup = await GroupService.update(res.locals.group, req.body);

      res.status(StatusCodes.OK).json({ group: updatedGroup });
    } catch (error) {
      serviceLogger.logger.error("Internal Server Error", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      next();
    }
  });
