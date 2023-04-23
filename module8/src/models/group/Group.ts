import { Table, Column, Model, DataType, PrimaryKey, BelongsToMany } from "sequelize-typescript";
import { Permission } from "./group-types";
import { User } from "../user/index";
import { UserGroup } from "../usergroup/index";

@Table({
  timestamps: false,
  modelName: "Groups",
})
export class Group extends Model {
  @PrimaryKey
  @Column(DataType.STRING(255))
  id: string;

  @Column(DataType.STRING(255))
  name: string;

  @Column(DataType.ARRAY(DataType.TEXT))
  permissions: Permission[];

  @BelongsToMany(() => User, () => UserGroup)
  users: User[];
}
