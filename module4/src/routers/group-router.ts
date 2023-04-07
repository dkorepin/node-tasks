import express, { Request, Response } from "express";
import { GroupService } from "../services/group-service.js";
import { validateGroup } from "../models/group/group-validation.js";

export const groupRouter = express.Router();

groupRouter
  .route("/")
  .get(async (_req: Request, res: Response) => {
    const group = await GroupService.getAll();

    res.json({ group });
  })
  .post(validateGroup, async (req: Request, res: Response) => {
    const oldGroup = await GroupService.getByName(req.body.name);

    if (oldGroup) {
      res
        .status(409)
        .json({ message: `Group with name ${req.body.name} already exists` });

      return;
    }

    const group = await GroupService.addNew(req.body);

    res.json({ group });
  })
  .all(async (_req: Request, res: Response) => {
    res.status(404).json({ message: "service not found" });
  });

groupRouter
  .route("/:id")
  .all(async (req: Request, res: Response, next) => {
    const groupDTO = await GroupService.getById(req.params.id);

    if (groupDTO === undefined) {
      console.error(`Group with id ${req.params.id} not found`);

      res
        .status(404)
        .json({ message: `Group with id ${req.params.id} not found` });
    } else {
      res.locals.group = groupDTO;

      next();
    }
  })
  .get((_req: Request, res: Response) => {
    res.json({ group: res.locals.group });
  })
  .delete(async (_req: Request, res: Response) => {
    await GroupService.remove(res.locals.group.id);

    res.status(200).end();
  })
  .put(validateGroup, async (req: Request, res: Response) => {
    const updatedGroup = await GroupService.update(res.locals.group, req.body);

    res.status(200).json({ group: updatedGroup });
  })
  .all(async (_req: Request, res: Response) => {
    res.status(404).json({ message: "service not found" });
  });
