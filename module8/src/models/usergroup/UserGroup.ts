import { Table, Model, ForeignKey } from "sequelize-typescript";
import { Group } from "../group/index";
import { User } from "../user/index";

@Table({
  timestamps: false,
})
export class UserGroup extends Model {
  @ForeignKey(() => User)
  userId: string;

  @ForeignKey(() => Group)
  groupId: string;
}
