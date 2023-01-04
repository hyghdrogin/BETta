import { Model, DataTypes, UUIDV4 } from 'sequelize';
import sequelize from '../config/db';

export default class Otp extends Model {
  public id!: string;
  public userId!: string;
  public token!: number;
  public expired!: boolean;

  static associate(models:any) {
    Otp.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'id',
      as: 'user'
    })
  }
}

Otp.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  token: {
    type: DataTypes.INTEGER,
    validate: {
      isInt: true,
      len: [1, 6]
    }
  },
  expired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  sequelize,
  tableName: "otps",
  timestamps: true
});