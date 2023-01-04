import { Model, DataTypes, UUIDV4 } from "sequelize";
import sequelize from "../config/db";

export default class User extends Model {
   public id!: string;
   public username!: string;
   public firstname!: string;
   public lastname!: string;
   public phone!: string;
   public dob!: string;
   public email!: string;
   public balance!: number;
   public location!: string;
   public password!: string;
   public active!: boolean;
   public verified!: boolean;

   static associate(models: any) {
      User.hasOne(models.Otp, {
         foreignKey: "userId",
      })
      User.hasMany(models.Credit, {
        foreignKey: "userId",
        as: "recipient"
      })
   }
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  googleId: {
    type: DataTypes.STRING,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      notEmpty: true,
      len: {
        args: [1, 20],
        msg: "Username should not be empty"
      }
    }
  },
  firstname: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
      len: [1, 20]
    }
  },
  lastname: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
      len: [1, 20]
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  dob: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      notEmpty: true,
      isEmail: true
    }
  },
  balance: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
    }
  },
  location: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, 
{
  sequelize,
  tableName: "users",
  timestamps: true
});
