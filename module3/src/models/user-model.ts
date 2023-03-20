import { DataTypes } from "sequelize";
import { Connection } from "../sequelize.js";

export const UserModel = Connection.sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.NUMBER,
        autoIncrement: true,
        primaryKey: true,
      },
      login: {
        type: new DataTypes.STRING(255),
        allowNull: false,
      },
      password: {
        type: new DataTypes.STRING(255),
        allowNull: false,
      },
      age: DataTypes.SMALLINT,
    },
    {
      timestamps: false,
    }
  );