import { Table, Column, Model, DataType, PrimaryKey, BelongsToMany } from "sequelize-typescript";
import { UserGroup } from "../usergroup/index";
import { Group } from "../group/index";

@Table({
  timestamps: false,
  modelName: "users",
})
export class User extends Model {
  @PrimaryKey
  @Column(DataType.STRING(255))
  id: string;

  @Column(DataType.STRING(255))
  login: string;

  @Column(DataType.STRING(255))
  password: string;

  @Column(DataType.SMALLINT)
  age: number;

  @BelongsToMany(() => Group, () => UserGroup)
  groups: Group[];
}
