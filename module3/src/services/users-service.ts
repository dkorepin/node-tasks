import { Op } from "sequelize";
import { User } from "../models/user-types.js";
import { UserModel } from "../models/user-model.js";
import { UserDataMapper } from "../data-access/user-data-mapper.js";

export class UsersService {
  static addNewUser = async (fields: Partial<User>) => {
    const newUserBody = UserDataMapper.toDalEntity(fields);
    const user = await UserModel.create(newUserBody);

    return UserDataMapper.toDomain(user);
  };

  static updateUser = async (user: User, fields: Partial<User>) => {
    const updatedUser = {
      ...user,
      ...fields,
      id: user.id,
      isDeleted: false,
    };

    const result = await UserModel.update(updatedUser, {
      where: { id: updatedUser.id },
    });

    return result;
  };

  static getUserById = async (id: string) => {
    const user = await UserModel.findOne({ where: { id } });

    return !user ? undefined : UserDataMapper.toDomain(user);
  };

  static getUserByLogin = async (login: string) => {
    const user = await UserModel.findOne({ where: { login } });

    return !user ? undefined : UserDataMapper.toDomain(user);
  };

  static removeUser = async (id: string): Promise<number> => {
    return await UserModel.destroy({ where: { id } });
  };

  static getFilteredUsers = async (search: string, limit: string) => {
    const result = await UserModel.findAll({
      limit: limit.length > 0 ? Number(limit) : 100,
      ...(search.length > 0
        ? {
            where: {
              login: {
                [Op.iLike]: `%${search}%`,
              },
            },
            order: [["login", "ASC"]],
          }
        : { order: [["login", "ASC"]] }),
    });

    return result;
  };
}
