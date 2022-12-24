import { Model, DataTypes, UUIDV4 } from 'sequelize';
import sequelize from '../config/db';

export default class Otp extends Model {
  public id!: string;
  public userId!: string;
  public email!: string;
  public token!: number;
  public expired!: boolean;
}

Otp.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING, 
    allowNull: false
  },
  token: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  expired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
}, {
  sequelize,
  tableName: "otps",
  timestamps: false
});