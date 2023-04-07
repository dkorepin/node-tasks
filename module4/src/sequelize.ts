import chalk from "chalk";
import { Sequelize } from 'sequelize-typescript';
import dbConfig from "./db-config.js";
import { Group } from "./models/group/index.js";
import { User } from "./models/user/index.js";
import { UserGroup } from "./models/usergroup/index.js";

export type TConnection = {
  sequelize: Sequelize;
  Init: () => Promise<void>;
};

export class Connection {
  static sequelize: Sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
      host: dbConfig.HOST,
      dialect: dbConfig.dialect,

      pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
      },
      models: ['./src/models']
    },
  );

  static Init = async () => {
    try {
      Connection.sequelize.addModels([UserGroup, User, Group]);
      await Connection.sequelize.authenticate();
      console.log(chalk.yellow("Database is Authenticated"));
      await Connection.sequelize.sync({ alter: true });
      console.log(chalk.yellow("Database is Connected"));
    } catch (error) {
      console.error(chalk.red("Unable to connect to the database:", error));
      throw null;
    }
  };
}
