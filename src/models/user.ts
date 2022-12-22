import { Model, DataTypes, UUIDV4 } from 'sequelize';
import sequelize from '../config/db';
import Otp from './otp';

export default class User extends Model {
   public id!: string;
   public username!: string;
   public firstname!: string;
   public lastname!: string;
   public email!: string;
   public password!: string;
   public phone!: string;
   public photo!: string;
   public active!: boolean;
   public verified!: boolean;
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  photo: {
    type: DataTypes.STRING,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'users',
  timestamps: false
});

User.hasOne(Otp, { foreignKey: 'userId' });
Otp.hasOne(User, { foreignKey: "userId"});