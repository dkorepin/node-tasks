import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import moment from "moment";
import { createLogger, transports, format } from "winston";

export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARNING = "warn",
  ERROR = "error",
  FATAL = "fatal",
}

export type LogFunction = (message: string, metadata?: any) => void;
export type LoggerType = {
  debug: LogFunction;
  info: LogFunction;
  warn: LogFunction;
  error: LogFunction;
};

const tsFormat = () => moment().format("YY.MM.DD hh:mm:ss").trim();
const winstonLogger = createLogger({
  transports: [
    new transports.Console({
      level: LogLevel.INFO,
      format: format.combine(
        format.timestamp({ format: tsFormat }),
        format.colorize(),
        format.printf((info: any) => {
          return `${info.timestamp} ${info.level}: ${info.message} ${
            info.metadata ? JSON.stringify(info.metadata) : ""
          }`;
        })
      ),
    }),
    new transports.File({
      filename: "log.log",
      maxFiles: 3,
      level: LogLevel.INFO,
      format: format.combine(format.timestamp({ format: tsFormat }), format.json()),
    }),
  ],
});

export const logger: LoggerType = {
  debug: (message, metadata) => winstonLogger.debug(message, { metadata }),
  info: (message, metadata) => winstonLogger.info(message, { metadata }),
  warn: (message, metadata) => winstonLogger.warn(message, { metadata }),
  error: (message, metadata) => winstonLogger.error(message, { metadata }),
};

export const makePrefixLogger = (prefix: string): LoggerType => ({
  debug: (message, metadata) => winstonLogger.debug(`${prefix} ${message}`, { metadata }),
  info: (message, metadata) => winstonLogger.info(`${prefix} ${message}`, { metadata }),
  warn: (message, metadata) => winstonLogger.warn(`${prefix} ${message}`, { metadata }),
  error: (message, metadata) => winstonLogger.error(`${prefix} ${message}`, { metadata }),
});

export type ServiceLogger = {
  logger: LoggerType;
  method: (name: string) => (req: Request, res: Response, next: NextFunction) => void;
};

export const makeServiceLogger = (serviceName: string): ServiceLogger => ({
  logger: makePrefixLogger(serviceName),
  method: (methodName: string) => (req: Request, _res: Response, next: NextFunction) => {
    logger.info(`${serviceName}.${methodName} http:`, {
      method: req.method,
      path: req.path,
      query: req.query,
      body: req.method == "GET" ? undefined : req.body,
    });
    next();
  },
});

export const typicalErrorsMiddleware = (_req: Request, res: Response, next: NextFunction) => {
  if (res.statusCode < 400) next();
  switch (res.statusCode) {
    case 404:
      res.json({ message: "service not found" });
      break;
    case 500:
      res.json({ message: "Internal Server Error" });
      break;
  }
};

export const notFoundMiddleware = (_req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({ message: "Not Found" });
};
