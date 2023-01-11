import { Model, DataTypes, UUIDV4 } from "sequelize";
import sequelize from "../config/db";

export default class Notification extends Model {
    public id!: string;
    public message!: string;
    public status!: boolean;
    public owner!: string;
    public title!: string; 

    static associate(models:any) {
       Notification.belongsTo(models.User, {
          foreignKey: 'userId',
          targetKey: 'id',
          as: 'user'
        })
      }
}

Notification.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  owner: {
    type: DataTypes.UUID,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM({
      values: ["read", "unread"]
    }),
    defaultValue: "unread",
  }
}, {
  sequelize,
  tableName: "notifications",
  timestamps: true
});

