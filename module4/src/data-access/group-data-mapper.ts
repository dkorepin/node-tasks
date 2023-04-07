import { v4 } from "uuid";
import { Group } from "../models/group/Group";
import { Model } from "sequelize";

export class GroupDataMapper {
  static toDalEntity (body: Partial<Group>) {
    return ({
      id: v4(),
      name: body.name,
      permissions: body.permissions,
    });
  }

  static toDomain (model: Model) {
    return model.dataValues
  }
}