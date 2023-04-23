import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import DB_Config from "./db-config";

dotenv.config();
DB_Config.init({
  HOST: process.env.DB_HOST || "",
  USER: process.env.DB_USER || "",
  PASSWORD: process.env.DB_PASSWORD || "",
  DB: process.env.DB_NAME || "",
});

import { baseRuter } from "./routers/base-router";
import { Connection } from "./sequelize";
import { usersRouter } from "./routers/user-router";
import { groupRouter } from "./routers/group-router";
import { logger, typicalErrorsMiddleware, notFoundMiddleware } from "./logger";
import { swaggerUiMiddleware, swaggerUiSetup } from "./swagger";

const PORT = process.env.PORT;
const server = express();
const baseURL = `http://localhost:${PORT}`;

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
server.use('/swagger', swaggerUiMiddleware, swaggerUiSetup);
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
    logger.info(`Server started at ${baseURL}`);
  })
  .catch((error) => {
    logger.info("Initialize failure. Server stopped", error);
  });
