import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import { baseRuter } from "./routers/base-router.js";
import { Connection } from "./sequelize.js";
import { usersRouter } from "./routers/user-router.js";
import { groupRouter } from "./routers/group-router.js";
import chalk from "chalk";

const PORT = 3001;
const app = express();
const simpleLogger = (req: Request, _res: Response, next: NextFunction) => {
  const currentdate = new Date();
  console.log(
    `${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}`,
    req.method,
    req.path,
    req.method == "GET" ? "" : req.body
  );
  next();
};

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);
app.use(simpleLogger);
app.use("/users", usersRouter);
app.use("/group", groupRouter);
app.use("/", baseRuter);

Connection.Init().then(() => {
  app.listen(PORT);
  console.log(chalk.bgBlueBright(`server started at localhost:${PORT}`));
}).catch(() => {
  console.log(chalk.red(`server stopped`));
});
