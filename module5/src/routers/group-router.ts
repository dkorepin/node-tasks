import express, { Request, Response, NextFunction } from "express";
import { GroupService } from "../services/group-service.js";
import { validateGroup } from "../models/group/group-validation.js";
import { makeServiceLogger } from "../logger.js";
import { sendResponse400 } from "../helpers.js";

export const groupRouter = express.Router();
const serviceLogger = makeServiceLogger("group-service");

groupRouter
  .route("/")
  .get(serviceLogger.method("get all"), async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const group = await GroupService.getAll();

      res.json({ group });
    } catch (error) {
      serviceLogger.logger.error("Internal Server Error", error);

      res.status(500);
      next();
    }
  })
  .post(serviceLogger.method("create new"), validateGroup, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const oldGroup = await GroupService.getByName(req.body.name);

      if (oldGroup) return sendResponse400(res, serviceLogger, `Group with name ${req.body.name} already exists`);

      const group = await GroupService.addNew(req.body);

      res.json({ group });
    } catch (error) {
      serviceLogger.logger.error("Internal Server Error", error);

      res.status(500);
      next();
    }
  });

groupRouter
  .route("/:id")
  .all(serviceLogger.method("check id"), async (req: Request, res: Response, next) => {
    try {
      const groupDTO = await GroupService.getById(req.params.id);

      if (!groupDTO) return sendResponse400(res, serviceLogger, `Group with id ${req.params.id} not found`);
      res.locals.group = groupDTO;

      next();
    } catch (error) {
      serviceLogger.logger.error("Internal Server Error", error);

      res.status(500);
      next();
    }
  })
  .get(serviceLogger.method("get by id"), (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({ group: res.locals.group });
    } catch (error) {
      serviceLogger.logger.error("Internal Server Error", error);

      res.status(500);
      next();
    }
  })
  .delete(serviceLogger.method("delete"), async (_req: Request, res: Response, next: NextFunction) => {
    try {
      await GroupService.remove(res.locals.group.id);

      res.status(200).end();
    } catch (error) {
      serviceLogger.logger.error("Internal Server Error", error);

      res.status(500);
      next();
    }
  })
  .put(serviceLogger.method("update"), validateGroup, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedGroup = await GroupService.update(res.locals.group, req.body);

      res.status(200).json({ group: updatedGroup });
    } catch (error) {
      serviceLogger.logger.error("Internal Server Error", error);

      res.status(500);
      next();
    }
  });
