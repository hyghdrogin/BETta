import Joi from "joi";
import { IUser, ILogin } from "../utils/interface";

export const validateSignup = (user: IUser) => {
  const schema = Joi.object({
    username: Joi.string().min(2).max(20).required(),
    firstname: Joi.string().min(2).max(20).required(),
    lastname: Joi.string().min(2).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(16),
    phone: Joi.string().required()
  });
  return schema.validate(user);
};

export const validateLogin = (login: ILogin) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  return schema.validate(login);
};

export const validateUpdate = (user: IUser) => {
  const schema = Joi.object({
    username: Joi.string().min(2).max(20).required(),
    firstname: Joi.string().min(2).max(20).required(),
    lastname: Joi.string().min(2).max(20).required(),
  });
  return schema.validate(user);
};
