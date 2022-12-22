import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "mysql",
  host: "localhost",
  username: "root",
  password: "adeosun123",
  database: "testt",
  logging: false
});

export default sequelize;
