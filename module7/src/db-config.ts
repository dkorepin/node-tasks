import { Dialect } from "sequelize";

export default class DB_Config {
  static config: any;

  static init(cfg: any) {
    DB_Config.config = {
      HOST: cfg.HOST || "",
      USER: cfg.USER || "",
      PASSWORD: cfg.PASSWORD || "",
      DB: cfg.DB || "",
      dialect: "postgres" as Dialect,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    };
  }
}
