import cors from "cors";
import express from "express";
import { baseRuter } from "./routers/base-router.js";
import { Connection } from "./sequelize.js";
import { usersRouter } from "./routers/user-router.js";
import { groupRouter } from "./routers/group-router.js";
import { logger, typicalErrorsMiddleware, notFoundMiddleware } from "./logger.js";

const PORT = 3001;
const server = express();

server.use(express.json());
server.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

server.use("/users", usersRouter, typicalErrorsMiddleware);
server.use("/group", groupRouter, typicalErrorsMiddleware);
server.use("/", baseRuter, typicalErrorsMiddleware);
server.use(notFoundMiddleware);

server.on("error", (err) => {
  logger.error("Server error:", err);
});

server.on("close", () => {
  logger.info("Server closed");
});

process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception`, err);

  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", { promise, reason });
});

Connection.Init()
  .then(() => {
    server.listen(PORT);
    logger.info(`Server started at localhost:${PORT}`);
  })
  .catch((error) => {
    logger.info("Initialize failure. Server stopped", error);
  });
