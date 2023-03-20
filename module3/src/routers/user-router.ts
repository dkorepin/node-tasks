import express, { Request, Response } from "express";
import { validateUser } from "../models/user-validation.js";
import { UsersService } from "../services/users-service.js";

export const usersRouter = express.Router({ mergeParams: true });

// test autosuggestion http://localhost:3000/users?search=elt&limit=3
usersRouter
  .route("/")
  .get(async (req: Request, res: Response) => {
    const search = req.query.search ? String(req.query.search) : "";
    const limit = req.query.limit ? String(req.query.limit) : "";
    const users = await UsersService.getFilteredUsers(search, limit);

    res.json({ users });
  })
  .post(validateUser, async (req: Request, res: Response) => {
    const oldUser = await UsersService.getUserByLogin(req.body.login);

    if (oldUser) {
      res
        .status(409)
        .json({ message: `User with login ${req.body.login} already exists` });

      return;
    }

    const user = await UsersService.addNewUser(req.body);

    res.json({ user });
  });

usersRouter
  .route("/:id")
  .all(async (req: Request, res: Response, next) => {
    const userDTO = await UsersService.getUserById(req.params.id);

    if (userDTO === undefined) {
      console.error(`User with id ${req.params.id} not found`);

      res
        .status(404)
        .json({ message: `User with id ${req.params.id} not found` });
    } else {
      res.locals.user = userDTO;

      next();
    }
  })
  .get((_req: Request, res: Response) => {
    res.json({ user: res.locals.user });
  })
  .delete(async (_req: Request, res: Response) => {
    await UsersService.removeUser(res.locals.user.id);

    res.status(200).end();
  })
  .put(validateUser, async (req: Request, res: Response) => {
    const updatedUser = await UsersService.updateUser(
      res.locals.user,
      req.body
    );

    res.status(200).json({ user: updatedUser });
  });
