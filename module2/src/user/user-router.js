import express from 'express';
import { validateUser } from './user-validation.js';
import UsersService from './users-service.js';

export const usersRouter = express.Router({ mergeParams: true });

// test autosuggestion http://localhost:3000/users?search=elt&limit=3
usersRouter
	.route('/')
	.get((req, res) => {
		const search = req.query.search ? String(req.query.search) : '';
		const limit = req.query.limit ? String(req.query.limit) : '';
		const users = UsersService.getFilteredUsers(search, limit);

		res.json({ users });
	})
	.post(validateUser, (req, res) => {
		const user = UsersService.addNewUser(req.body);

		res.json({ user });
	});

usersRouter
	.route('/:id')
	.all((req, res, next) => {
		const user = UsersService.getUserById(req.params.id);

		if (user === undefined) {
			console.error(`User with id ${req.params.id} not found`);

			res
				.status(404)
				.json({ message: `User with id ${req.params.id} not found` });
		} else {
			res.locals.user = user;

			next();
		}
	})
	.get((req, res) => {
		res.json({ user: res.locals.user });
	})
	.delete((req, res) => {
		UsersService.removeUser(res.locals.user);

		res.status(200).end();
	})
	.put(validateUser, (req, res) => {
		const updatedUser = UsersService.updateUser(res.locals.user, req.body);

		res.status(200).json({ user: updatedUser });
	});
