import express from 'express';
import { baseRuter } from './base-router.js';
import { usersRouter } from './user/user-router.js';

const PORT = 3001;
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

app.listen(PORT);
console.log('\x1b[33m%s\x1b[0m', `server started at localhost:${PORT}`);
app.use(express.json());
app.use(simpleLogger);
app.use('/users', usersRouter);
app.use('/', baseRuter);
