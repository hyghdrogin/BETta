import { Model, DataTypes, UUIDV4 } from 'sequelize';
import sequelize from '../config/db';

export default class Credit extends Model {
  public id!: string;
  public amount!: number;
  public recipient!: string;
  public sender!: string;
  public status!: string;
  public type!: string;
  public reference!: string;

  static associate(models:any) {
    Credit.hasMany(models.User, {
      foreignKey: 'recipient',
      as: "User",
    })
  }
}

Credit.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
    unique: true,
  },
  amount: {
    type: DataTypes.INTEGER, 
    allowNull: false
  },
  recipient: {
    type: DataTypes.UUID
  },
  sender: {
    type: DataTypes.UUID
  },
  status: {
    type: DataTypes.ENUM({
      values: ["pending", "successful", "declined", "failed", "cancelled", "conflict"]
    }),
    allowNull: false,
    defaultValue: "pending"
  },
  type: {
    type: DataTypes.ENUM({
      values: ["Bank-transfer", "Deposit", "BETta-Transfer"]
    })
  },
  reference: {
    type: DataTypes.STRING
  },
}, {
  sequelize,
  tableName: "credits",
  timestamps: true
});