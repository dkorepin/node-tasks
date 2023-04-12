import { Table, Column, Model, ForeignKey } from "sequelize-typescript";
import { Group } from "../group/index.js";
import { User } from "../user/index.js";

@Table({
  timestamps: false,
})
export class UserGroup extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Group)
  @Column
  groupId: number;
}
