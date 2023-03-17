import express from 'express';
import { baseRuter } from './base-router.js';
import { usersRouter } from './user/user-router.js';

const app = express();
const simpleLogger = (req, res, next) => {
	const currentdate = new Date();
	console.log(
		`${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}`,
		req.method,
		req.path,
		req.method == 'GET' ? '' : req.body
	);
	next();
};

app.listen(3000);

app.use(express.json());
app.use(simpleLogger);
app.use('/users', usersRouter);
app.use('/', baseRuter);
