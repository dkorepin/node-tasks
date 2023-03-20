import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import { baseRuter } from "./routers/base-router.js";
import { usersRouter } from "./routers/user-router.js";
import { Connection } from "./sequelize.js";

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
app.use(cors({
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200
}));
app.use(simpleLogger);
app.use("/users", usersRouter);
app.use("/", baseRuter);

Connection.Init().then(() => {
  app.listen(PORT);
  console.log("\x1b[33m%s\x1b[0m", `server started at localhost:${PORT}`);
});
