import { isEmpty } from "lodash";
import logger from "pino";
import dotenv from "dotenv";

dotenv.config();

const config = {
  logger: logger(),
  PORT: process.env.PORT,
  APP_NAME: process.env.APP_NAME,
  JWT_KEY: process.env.JWT_KEY,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SENDGRID_EMAIL: process.env.SENDGRID_EMAIL,
  SQL_URL: process.env.SQL_URL,
  // USERNAME: process.env.USERNAME as string,
  // HOST: process.env.HOST as string,
  // DATABASE: process.env.DATABASE as string,
  // PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
  CLOUD_NAME: process.env.CLOUD_NAME,
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET,
};

const absentConfig = Object.entries(config)
  .map(([key, value]) => [key, !!value])
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (!isEmpty(absentConfig)) {
  throw new Error(`Missing Config: ${absentConfig.join(", ")}`);
}

export default config;
