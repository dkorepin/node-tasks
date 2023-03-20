import { Sequelize } from "sequelize";

export type TConnection = {
    sequelize: Sequelize;
    Init: () => Promise<void>;
}

export class Connection {
  static sequelize: Sequelize = new Sequelize(
    "postgres://rtgzmuas:Np_vllL24oc4VpNmW_-hnOISdeS5kf1w@dumbo.db.elephantsql.com/rtgzmuas"
  );

  static Init = async () => {
    try {
        await Connection.sequelize.authenticate();
        await Connection.sequelize.sync();
        console.log('\x1b[33m%s\x1b[0m', "Database is Connected");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
  };


}
