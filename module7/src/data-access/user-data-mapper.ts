import { v4 } from "uuid";
import { User } from "../models/user/User";
import { Model } from "sequelize";

export class UserDataMapper {
  static toDalEntity(body: Partial<User>) {
    return {
      id: v4(),
      login: body.login,
      password: body.password,
      age: body.age,
    };
  }

  static toDomain(model: Model) {
    return model.dataValues;
  }
}
