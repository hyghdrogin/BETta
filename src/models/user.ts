import { UUIDV4 } from "sequelize";
import { Table, Model, Column, DataType } from "sequelize-typescript";
import { IUser } from "../utils/interface";

@Table({
  timestamps: true,
  tableName: "users"
})

export default class User extends Model implements IUser {
  static first(arg0: string) {
    throw new Error("Method not implemented.");
  }
  @Column({
    type: DataType.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
    unique: true,
    allowNull: false
  })
  id!: string;
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  username!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  firstname!: string;
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  lastname!: string;
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  email!: string;
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  password!: string;
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  phone!: string;
}
