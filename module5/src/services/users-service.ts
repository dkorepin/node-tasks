import { Op } from "sequelize";
import { User } from "../models/user/User.js";
import { UserDataMapper } from "../data-access/user-data-mapper.js";
import { Connection } from "../sequelize.js";
import { Group } from "../models/group/Group.js";

export class UsersService {
  static addNewUser = async (fields: Partial<User>) => {
    const newUserBody = UserDataMapper.toDalEntity(fields);
    const user = await User.create(newUserBody);

    return UserDataMapper.toDomain(user);
  };

  static updateUser = async (user: User, fields: Partial<User>) => {
    const updatedUser = {
      ...user,
      ...fields,
      id: user.id,
      isDeleted: false,
    };

    const result = await User.update(updatedUser, {
      where: { id: updatedUser.id },
    });

    return result;
  };

  static getUserById = async (id: string) => {
    const user = await User.findOne({ where: { id }, include: [Group] });

    return !user ? undefined : UserDataMapper.toDomain(user);
  };

  static getUserByLogin = async (login: string) => {
    const user = await User.findOne({ where: { login } });

    return !user ? undefined : UserDataMapper.toDomain(user);
  };

  static removeUser = async (id: string): Promise<number> => {
    return await User.destroy({ where: { id } });
  };

  static getFilteredUsers = async (search: string, limit: string) => {
    const result = await User.findAll({
      limit: limit.length > 0 ? Number(limit) : 100,
      ...(search.length > 0
        ? {
            where: {
              login: {
                [Op.iLike]: `%${search}%`,
              },
            },
            order: [["login", "ASC"]],
            include: [Group],
          }
        : { order: [["login", "ASC"]], include: [Group] }),
    });

    return result;
  };

  static addUsersToGroup = async (userId: string, groupId: string) => {
    const transaction = await Connection.sequelize.transaction();
    const result = {
      data: null,
      message: "",
      ok: false,
    };
    try {
      const userDTO = await User.findOne({ where: { id: userId }, include: [Group] });
      const groupDTO = await Group.findOne({ where: { id: groupId } });
      if (groupDTO && userDTO) {
        userDTO?.$set("groups", [groupDTO]);
      } else {
        await transaction.rollback();

        return { ...result, message: `something went wrong: groupDTO:${groupDTO}, userDTO:${userDTO}` };
      }

      await transaction.commit();
      const user = await User.findOne({
        where: { id: userDTO.id },
        include: [Group],
      });

      return { ...result, data: user, ok: true };
    } catch (e) {
      await transaction.rollback();

      return { ...result, message: String(e) };
    }
  };
}
