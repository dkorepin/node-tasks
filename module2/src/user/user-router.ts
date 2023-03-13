import express from "express";
import { filterAndSortUsers, makeNewUserByBody } from "./user-helpers.js";
import { validateUser } from "./user-validation.js";
import { usersData } from "./users-db.js";

export const usersRouter = express.Router({mergeParams: true});

// test autosuggestion http://localhost:3000/users?search=elt&limit=3
usersRouter
  .route("/")
  .get((req, res, next) => {
    const search = req.query.search ? String(req.query.search) : '';
    const limit = req.query.limit ? String(req.query.limit) : '';

    res.json({
      users: filterAndSortUsers(Array.from(usersData.values()), search, limit),
    });
  })
  .post(validateUser, (req, res, next) => {
    const user = makeNewUserByBody(req.body);
    usersData.set(user.id, user);

    res.json({ user });
  });

usersRouter
  .route("/:id")
  .all((req, res, next) => {
    const user = usersData.get(req.params.id);

    if (user === undefined || user.isDeleted) {
      console.error(`User with id ${req.params.id} not found`);

      res
        .status(404)
        .json({ message: `User with id ${req.params.id} not found` });
    } else {
      res.locals.user = user;

      next();
    }
  })
  .get((req, res, next) => {
    res.json({ user: res.locals.user });
  })
  .delete((req, res, next) => {
    const updatedUser = { ...res.locals.user, isDeleted: true };
    usersData.set(updatedUser.id, updatedUser);

    res.status(200).end();
  })
  .put(validateUser, (req, res, next) => {
    const updatedUser = {
      ...res.locals.user,
      ...req.body,
      id: res.locals.user,
      isDeleted: false,
    };
    usersData.set(updatedUser.id, updatedUser);

    res.status(200).json({ user: updatedUser });
  });
