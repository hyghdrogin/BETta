import { Sequelize } from "sequelize";
import config from ".";

const sequelize = new Sequelize(config.SQL_URL as string, {
  dialect: "mysql",
  logging: false,
});

export default sequelize;
