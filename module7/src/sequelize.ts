import { Sequelize } from "sequelize-typescript";
import { Group } from "./models/group/index";
import { User } from "./models/user/index";
import { UserGroup } from "./models/usergroup/index";
import { logger } from "./logger";
import DB_Config from "./db-config";

export type TConnection = {
  sequelize: Sequelize;
  Init: () => Promise<void>;
};

export class Connection {
  static sequelize: Sequelize = new Sequelize(DB_Config.config.DB, DB_Config.config.USER, DB_Config.config.PASSWORD, {
    host: DB_Config.config.HOST,
    dialect: DB_Config.config.dialect,

    pool: {
      max: DB_Config.config.pool.max,
      min: DB_Config.config.pool.min,
      acquire: DB_Config.config.pool.acquire,
      idle: DB_Config.config.pool.idle,
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
