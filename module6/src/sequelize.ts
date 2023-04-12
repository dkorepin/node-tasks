import { Sequelize } from "sequelize-typescript";
import dbConfig from "./db-config.js";
import { Group } from "./models/group/index.js";
import { User } from "./models/user/index.js";
import { UserGroup } from "./models/usergroup/index.js";
import { logger } from "./logger.js";

export type TConnection = {
  sequelize: Sequelize;
  Init: () => Promise<void>;
};

export class Connection {
  static sequelize: Sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,

    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
    logging: (msg: string) => logger.debug(msg),
    models: ["./src/models"],
  });

  static Init = async () => {
    try {
      Connection.sequelize.addModels([UserGroup, User, Group]);
      await Connection.sequelize.authenticate();
      logger.info("Database is Authenticated");
      await Connection.sequelize.sync({ alter: true });
      logger.info("Database is Connected");
    } catch (error) {
      logger.error("Unable to connect to the database", error);
      throw error;
    }
  };
}
