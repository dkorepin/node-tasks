import { GroupDataMapper } from "../data-access/group-data-mapper";
import { Group } from "../models/group/Group";
import { User } from "../models/user/index";

export class GroupService {
  static getAll = async () => {
    return await Group.findAll({ order: [["name", "ASC"]], include: [User] });
  };

  static getByName = async (name: string) => {
    const user = await Group.findOne({ where: { name } });

    return !user ? undefined : GroupDataMapper.toDomain(user);
  };

  static addNew = async (fields: Partial<Group>) => {
    const newGroupBody = GroupDataMapper.toDalEntity(fields);
    const group = await Group.create(newGroupBody);

    return !group ? undefined : GroupDataMapper.toDomain(group);
  };

  static getById = async (id: string) => {
    const group = await Group.findOne({ where: { id }, include: [User] });

    return !group ? undefined : GroupDataMapper.toDomain(group);
  };

  static remove = async (id: string): Promise<number> => {
    return await Group.destroy({ where: { id } });
  };

  static update = async (user: Group, fields: Partial<Group>) => {
    const updatedGroup = {
      ...user,
      ...fields,
      id: user.id,
      isDeleted: false,
    };

    await Group.update(updatedGroup, {
      where: { id: updatedGroup.id },
    });

    return updatedGroup;
  };
}
